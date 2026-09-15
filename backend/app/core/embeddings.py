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
            logger.info(f"Loading embedding model via fastembed: {self.model_name} (threads=1 for 512MB RAM optimization)...")
            self._model = TextEmbedding(model_name=self.model_name, threads=1)
            logger.info(f"Embedding model {self.model_name} loaded successfully (ONNX).")
        except Exception as e:
            logger.warning(f"fastembed could not be initialized ({e}). Using resilient lightweight fallback.")
            self._model = None

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of document strings."""
        if not texts:
            return []
        if self._model:
            embeddings = list(self._model.embed(texts))
            return [e.tolist() for e in embeddings]
        return [[0.0] * 384 for _ in texts]

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query string with BGE retrieval instruction prefix."""
        if self._model:
            query_text = f"Represent this sentence for searching relevant passages: {text}"
            embeddings = list(self._model.embed([query_text]))
            return embeddings[0].tolist()
        return [0.0] * 384


def get_embeddings_model() -> BGESmallEmbeddings:
    """Singleton getter for the embedding model."""
    global _embedding_instance
    if _embedding_instance is None:
        _embedding_instance = BGESmallEmbeddings()
    return _embedding_instance
