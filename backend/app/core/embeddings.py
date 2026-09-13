"""
Embedding model service for BIS Saathi.
Uses fastembed (ONNX-based) for BAAI/bge-small-en-v1.5 — no PyTorch dependency,
keeping RAM usage well within Render's 512 MB free-tier limit.
"""

from typing import List
import logging
from app.config import settings

logger = logging.getLogger(__name__)

_embedding_instance = None


class BGESmallEmbeddings:
    """Wrapper around BAAI/bge-small-en-v1.5 via fastembed (ONNX runtime)."""

    def __init__(self, model_name: str = settings.EMBEDDING_MODEL_NAME):
        self.model_name = model_name
        self._model = None
        self._load_model()

    def _load_model(self):
        try:
            from fastembed import TextEmbedding
            logger.info(f"Loading embedding model via fastembed: {self.model_name}...")
            self._model = TextEmbedding(model_name=self.model_name)
            logger.info(f"Embedding model {self.model_name} loaded successfully (ONNX).")
        except Exception as e:
            logger.error(f"Failed to load fastembed model {self.model_name}: {e}")
            raise e

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of document strings."""
        if not texts:
            return []
        embeddings = list(self._model.embed(texts))
        return [e.tolist() for e in embeddings]

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query string with BGE retrieval instruction prefix."""
        # BGE models benefit from instruction prefix for asymmetric retrieval
        query_text = f"Represent this sentence for searching relevant passages: {text}"
        embeddings = list(self._model.embed([query_text]))
        return embeddings[0].tolist()


def get_embeddings_model() -> BGESmallEmbeddings:
    """Singleton getter for the embedding model."""
    global _embedding_instance
    if _embedding_instance is None:
        _embedding_instance = BGESmallEmbeddings()
    return _embedding_instance
