"""
Speech API Router for BIS Saathi (PS107).
Exposes:
- POST /api/v1/speech/transcribe & /api/speech/transcribe (Audio buffer -> Text transcript)
- POST /api/v1/speech/synthesize & /api/speech/synthesize (Grounded text -> Spoken audio WAV)
"""

import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status

from app.models.schemas import (
    SpeechTranscribeResponse,
    SpeechSynthesizeRequest,
    SpeechSynthesizeResponse
)
from app.services.speech import SpeechService, get_speech_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["Speech & Voice"])

@router.post(
    "/speech/transcribe",
    response_model=SpeechTranscribeResponse,
    status_code=status.HTTP_200_OK,
    summary="Transcribe user speech audio into text",
    description="Accepts an uploaded audio file (WAV, WEBM, MP3) and returns recognized transcript with language code."
)
async def transcribe_speech_endpoint(
    file: UploadFile = File(..., description="Recorded audio buffer from browser"),
    language_code: Optional[str] = Form(default="en-IN", description="Expected or selected BCP-47 language code"),
    speech_service: SpeechService = Depends(get_speech_service)
) -> SpeechTranscribeResponse:
    try:
        audio_bytes = await file.read()
        logger.info(f"Incoming voice STT request: {file.filename} ({len(audio_bytes)} bytes) | Language: {language_code}")
        
        result = speech_service.transcribe(
            audio_bytes=audio_bytes,
            language_code=language_code,
            filename=file.filename or "audio.wav",
            content_type=file.content_type or "audio/wav"
        )
        return result
    except Exception as e:
        logger.error(f"Error in STT transcription endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech transcription failed: {str(e)}"
        )

@router.post(
    "/speech/synthesize",
    response_model=SpeechSynthesizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Synthesize grounded text into natural audio speech",
    description="Accepts grounded text, cleans markdown formatting, and returns base64 audio WAV buffer or browser fallback indicator."
)
async def synthesize_speech_endpoint(
    request: SpeechSynthesizeRequest,
    speech_service: SpeechService = Depends(get_speech_service)
) -> SpeechSynthesizeResponse:
    try:
        logger.info(f"Incoming TTS request for [{request.language}]: '{request.text[:50]}...'")
        result = speech_service.synthesize(request)
        return result
    except Exception as e:
        logger.error(f"Error in TTS synthesis endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech synthesis failed: {str(e)}"
        )
