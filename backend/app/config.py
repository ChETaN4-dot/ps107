"""
Configuration settings for BIS Saathi Backend.
Reads environment variables cleanly with production defaults.
"""

from pathlib import Path
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = BASE_DIR.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "BIS Saathi Backend"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = Field(default="development", validation_alias="ENVIRONMENT")
    DEBUG: bool = Field(default=True, validation_alias="DEBUG")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    # ChromaDB Vector Store
    CHROMA_PERSIST_DIR: str = str(WORKSPACE_DIR / "data" / "chroma_db")
    CHROMA_COLLECTION_NAME: str = "bis_saathi_kb"
    
    # Embeddings
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-small-en-v1.5"
    EMBEDDING_DEVICE: str = "cpu"
    
    # LLM (Ollama)
    OLLAMA_BASE_URL: str = Field(default="http://localhost:11434", validation_alias="OLLAMA_BASE_URL")
    OLLAMA_MODEL: str = Field(default="qwen2.5:7b", validation_alias="OLLAMA_MODEL")
    OLLAMA_TIMEOUT: float = 60.0
    
    # Multilingual Layer & Speech (Sarvam AI for 10 Indian Languages)
    SARVAM_API_KEY: str = Field(default="", validation_alias="SARVAM_API_KEY")
    SARVAM_BASE_URL: str = Field(default="https://api.sarvam.ai", validation_alias="SARVAM_BASE_URL")
    SARVAM_MODEL: str = Field(default="mayura:v1", validation_alias="SARVAM_MODEL")
    SARVAM_TTS_MODEL: str = Field(default="bulbul:v3", validation_alias="SARVAM_TTS_MODEL")
    SARVAM_STT_MODEL: str = Field(default="saaras:v1", validation_alias="SARVAM_STT_MODEL")
    SARVAM_DEFAULT_SPEAKER: str = Field(default="ritu", validation_alias="SARVAM_DEFAULT_SPEAKER")
    
    # RAG Retrieval Parameters
    RETRIEVAL_TOP_K: int = 4
    CONFIDENCE_THRESHOLD: float = 0.65
    HIGH_CONFIDENCE_THRESHOLD: float = 0.78
    
    # Knowledge Base Raw Data Path
    PROCESSED_DATA_DIR: str = str(WORKSPACE_DIR / "data" / "processed")
    CHUNKS_FILE_PATH: str = str(WORKSPACE_DIR / "data" / "processed" / "chunks.jsonl")
    STANDARDS_FILE_PATH: str = str(WORKSPACE_DIR / "data" / "processed" / "standards_metadata.csv")
    LIFECYCLE_CACHE_TTL_DAYS: int = 30
    LIFECYCLE_UNKNOWN_TTL_DAYS: int = 1

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
