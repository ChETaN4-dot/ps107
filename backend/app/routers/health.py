"""
Health check router exposing GET /health for system observability.
"""

from fastapi import APIRouter, status
try:
    from app.config import settings
    from app.models.schemas import HealthResponse
    from app.core.vectorstore import get_vectorstore
    from app.core.llm import get_llm_service
except ImportError:
    from app.config import settings
    from app.models.schemas import HealthResponse
    from app.core.vectorstore import get_vectorstore
    from app.core.llm import get_llm_service

router = APIRouter(prefix="", tags=["Health"])

@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="System Health & Knowledge Base Status",
    description="Returns vector index count, Ollama service status, and model metadata."
)
async def health_check() -> HealthResponse:
    try:
        vs = get_vectorstore()
        total_chunks = vs.collection.count()
        chroma_status = "connected"
    except Exception as e:
        total_chunks = 0
        chroma_status = f"error: {str(e)}"

    llm = get_llm_service()
    ollama_active = llm.is_available()
    ollama_status = "online" if ollama_active else "offline (fallback synthesis active)"

    sarvam_status = "ready" if settings.SARVAM_API_KEY else "standby (key not set, english fallback active)"

    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        chroma_db_status=chroma_status,
        total_indexed_chunks=total_chunks,
        total_standards_catalog=741,
        ollama_status=ollama_status,
        embedding_model=settings.EMBEDDING_MODEL_NAME,
        sarvam_multilingual_status=sarvam_status
    )
