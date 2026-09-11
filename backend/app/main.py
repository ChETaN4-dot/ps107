"""
Main FastAPI application entry point for BIS Saathi (PS107).
Configures CORS, security headers, request ID tracing, structured logging,
and dual API endpoints (POST /api/chat and POST /api/v1/chat).
"""

import time
import uuid
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers.chat import router as chat_router
from app.routers.health import router as health_router
from app.routers.speech import router as speech_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
)
logger = logging.getLogger("bis_saathi.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle startup and shutdown events."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]...")
    
    # Pre-warm vector store and check collection count
    try:
        from app.core.vectorstore import get_vectorstore
        vs = get_vectorstore()
        logger.info(f"ChromaDB ready with {vs.collection.count()} verified BIS chunks.")
    except Exception as e:
        logger.warning(f"ChromaDB pre-warm notice: {e}")
        
    yield
    logger.info("BIS Saathi backend shutting down cleanly.")

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Conversational AI Copilot for Indian Standards, Certification Schemes (Scheme I/II), "
        "Gold/Silver Hallmarking (HUID), Laboratory Testing (LRS/Citizen's Charter), and "
        "Consumer Quality Protection (Smart India Hackathon PS107)."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Request ID & Latency Tracking Middleware
@app.middleware("http")
async def request_tracing_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4())[:8])
    start_time = time.perf_counter()
    
    # Process request
    response = await call_next(request)
    
    duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time-MS"] = str(duration_ms)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    
    # Structured log
    logger.info(
        f"req_id={request_id} method={request.method} path={request.url.path} "
        f"status={response.status_code} latency_ms={duration_ms}"
    )
    return response

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Response-Time-MS"]
)

# Include Chat & Speech Routers: Both /api/v1 and /api supported
app.include_router(chat_router, prefix=settings.API_V1_PREFIX)
app.include_router(chat_router, prefix="/api")
app.include_router(speech_router, prefix=settings.API_V1_PREFIX)
app.include_router(speech_router, prefix="/api")
app.include_router(health_router)

@app.get("/", tags=["Root"])
async def root():
    return JSONResponse(
        content={
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "operational",
            "docs_url": "/docs",
            "health_url": "/health",
            "chat_endpoints": [
                f"{settings.API_V1_PREFIX}/chat",
                "/api/chat"
            ],
            "disclaimer": "BIS Saathi provides citation-grounded guidance from public BIS documents. Official statutory actions must be performed on official BIS portals."
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
