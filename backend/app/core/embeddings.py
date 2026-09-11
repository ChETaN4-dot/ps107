"""
Embedding model service for BIS Saathi.
Loads BAAI/bge-small-en-v1.5 using sentence-transformers.
Provides cached singletons for high inference throughput on CPU.
"""

from typing import List
import logging
from app.config import settings

logger = logging.getLogger(__name__)

_embedding_instance = None

class BGESmallEmbeddings:
    """Wrapper around BAAI/bge-small-en-v1.5 embedding model."""
    
    def __init__(self, model_name: str = settings.EMBEDDING_MODEL_NAME, device: str = settings.EMBEDDING_DEVICE):
        self.model_name = model_name
        self.device = device
        self._model = None
        self._load_model()

    def _load_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {self.model_name} on {self.device}...")
            self._model = SentenceTransformer(self.model_name, device=self.device)
            logger.info(f"Embedding model {self.model_name} loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load sentence_transformers model {self.model_name}: {e}")
            raise e

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of document strings."""
        if not texts:
            return []
        embeddings = self._model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=False,
            batch_size=32
        )
        return embeddings.tolist()

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query string with BGE retrieval instruction prefix."""
        # BGE models benefit from instruction prefix for asymmetric retrieval
        query_text = f"Represent this sentence for searching relevant passages: {text}"
        embedding = self._model.encode(
            query_text,
            normalize_embeddings=True,
            show_progress_bar=False
        )
        return embedding.tolist()

def get_embeddings_model() -> BGESmallEmbeddings:
    """Singleton getter for the embedding model."""
    global _embedding_instance
    if _embedding_instance is None:
        _embedding_instance = BGESmallEmbeddings()
    return _embedding_instance
