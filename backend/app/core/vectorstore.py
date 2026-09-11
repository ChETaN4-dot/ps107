"""
ChromaDB Vector Store management for BIS Saathi.
Maintains persistent on-disk index and provides filtered similarity retrieval.
Automatically seeds from data/processed/chunks.jsonl if collection is empty.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path

import chromadb

from app.config import settings
from app.core.embeddings import get_embeddings_model

logger = logging.getLogger(__name__)

_vectorstore_instance = None

class ChromaVectorStore:
    def __init__(self):
        self.persist_dir = settings.CHROMA_PERSIST_DIR
        self.collection_name = settings.CHROMA_COLLECTION_NAME
        self.embeddings = get_embeddings_model()
        
        # Ensure persistence directory exists
        os.makedirs(self.persist_dir, exist_ok=True)
        
        # Initialize persistent client
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"Connected to ChromaDB at {self.persist_dir}, collection: {self.collection_name}")
        
        # Check if database needs seeding
        self._ensure_seeded()

    def _ensure_seeded(self):
        count = self.collection.count()
        logger.info(f"Current collection count: {count}")
        if count == 0:
            chunks_path = Path(settings.CHUNKS_FILE_PATH)
            if chunks_path.exists():
                logger.info(f"Seeding vectorstore from {chunks_path}...")
                self.index_chunks_from_file(str(chunks_path))
            else:
                logger.warning(f"Chunks file not found at {chunks_path}. Collection remains empty.")

    def index_chunks_from_file(self, file_path: str):
        """Load chunks from JSONL file and insert into ChromaDB."""
        chunks = []
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    chunks.append(json.loads(line))

        if not chunks:
            logger.warning("No chunks to index.")
            return

        logger.info(f"Indexing {len(chunks)} chunks into ChromaDB...")
        
        # Prepare batches
        batch_size = 64
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            ids = [ch["id"] for ch in batch]
            documents = [ch["text"] for ch in batch]
            
            # Embed documents
            embeddings = self.embeddings.embed_documents(documents)
            
            # Metadata must be primitive types for Chroma
            metadatas = []
            for ch in batch:
                personas_str = ",".join(ch.get("persona", []))
                metadatas.append({
                    "source_title": ch.get("source_title", ""),
                    "source_url": ch.get("source_url", ""),
                    "section": ch.get("section", ""),
                    "category": ch.get("category", ""),
                    "personas": personas_str
                })
            
            self.collection.add(
                ids=ids,
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas
            )
            logger.info(f"Indexed batch {i // batch_size + 1}/{(len(chunks) + batch_size - 1) // batch_size}")

        logger.info(f"Indexing complete! Total documents in collection: {self.collection.count()}")

    def similarity_search(
        self,
        query: str,
        top_k: int = settings.RETRIEVAL_TOP_K,
        category_filter: Optional[str] = None,
        persona: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform vector similarity search with optional metadata filtering.
        Returns list of dicts with document, metadata, and similarity score.
        """
        if self.collection.count() == 0:
            logger.warning("Search called on empty vector collection.")
            return []

        query_embedding = self.embeddings.embed_query(query)
        
        # Build where filter if category is specified
        where_filter = None
        if category_filter and category_filter not in ["general", "all", "out_of_scope", "greeting"]:
            where_filter = {"category": category_filter}

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k * 2, self.collection.count()),  # Fetch candidate pool for re-ranking
            where=where_filter
        )

        candidates = []
        if results and results["documents"] and results["documents"][0]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if results["metadatas"] else [{}] * len(docs)
            distances = results["distances"][0] if results["distances"] else [0.0] * len(docs)
            ids = results["ids"][0] if results["ids"] else [""] * len(docs)

            for doc_id, doc, meta, dist in zip(ids, docs, metas, distances):
                # Cosine distance to similarity: similarity = 1 - distance
                similarity = max(0.0, min(1.0, 1.0 - dist))
                
                # Persona boosting: slight boost if candidate matches persona
                persona_match = False
                if persona:
                    chunk_personas = meta.get("personas", "").lower().split(",")
                    if persona.lower() in [p.strip() for p in chunk_personas]:
                        similarity = min(1.0, similarity + 0.05)
                        persona_match = True

                candidates.append({
                    "id": doc_id,
                    "text": doc,
                    "metadata": meta,
                    "similarity": round(similarity, 4),
                    "persona_match": persona_match
                })

        # Sort by similarity descending
        candidates.sort(key=lambda x: x["similarity"], reverse=True)
        return candidates[:top_k]

def get_vectorstore() -> ChromaVectorStore:
    """Singleton getter for the Chroma vectorstore."""
    global _vectorstore_instance
    if _vectorstore_instance is None:
        _vectorstore_instance = ChromaVectorStore()
    return _vectorstore_instance
