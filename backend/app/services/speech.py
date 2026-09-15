"""
Voice & Speech Service for BIS Saathi (PS107).
Provides:
1. Speech-to-Text (STT) transcription via Sarvam AI API (saaras:v1) with browser fallback.
2. Text-to-Speech (TTS) natural audio synthesis via Sarvam AI API (bulbul:v1) with browser fallback.
3. Factual speakability parser that strips markdown formatting, tables, and raw URLs
   while strictly preserving standard numbers (e.g. 'IS 14543', 'IS 17803:2022'), 'HUID',
   'CML', 'QCO', and statutory clauses.
4. Ephemeral in-memory audio processing ensuring zero permanent audio storage on disk.
"""

import re
import io
import time
import logging
from typing import Optional
import httpx

from app.config import settings
from app.models.schemas import (
    SpeechTranscribeResponse, SpeechSynthesizeRequest, SpeechSynthesizeResponse
)
from app.services.sarvam import SARVAM_LANGUAGE_MAP

logger = logging.getLogger(__name__)

class SpeechService:
    """Unified Speech Service abstraction for BIS Saathi voice interface."""

    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY.strip()
        self.base_url = settings.SARVAM_BASE_URL.rstrip("/")
        self.stt_model = settings.SARVAM_STT_MODEL
        self.tts_model = settings.SARVAM_TTS_MODEL
        self.default_speaker = settings.SARVAM_DEFAULT_SPEAKER
        self.timeout = 8.0  # Interactive voice timeout

    def is_configured(self) -> bool:
        """Check if Sarvam API key is configured for server-side audio processing."""
        return bool(self.api_key and len(self.api_key) > 5)

    def clean_for_speech(self, text: str) -> str:
        """
        Transforms raw grounded RAG responses into natural, fluent speakable prose:
        - Removes Markdown headers, bold, italics, code fences, blockquotes, and tables
        - Replaces markdown links [Title](url) with just 'Title'
        - Strips standalone raw URLs
        - Strips emojis and visual bullet markers
        - Preserves standard designations intact (e.g., 'IS 17803:2022', 'IS 14543', 'HUID')
        """
        cleaned = text.strip()

        # 1. Remove code blocks
        cleaned = re.sub(r"```[\s\S]*?```", "", cleaned)
        cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)

        # 2. Convert markdown links [Label](url) to just Label
        cleaned = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", cleaned)

        # 3. Strip standalone URLs
        cleaned = re.sub(r"https?://[^\s)\]]+", "official BIS portal", cleaned)

        # 4. Remove Markdown headers, bold, italics, blockquotes
        cleaned = re.sub(r"^#+\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\*\*([^*]+)\*\*", r"\1", cleaned)
        cleaned = re.sub(r"\*([^*]+)\*", r"\1", cleaned)
        cleaned = re.sub(r"^>\s*", "", cleaned, flags=re.MULTILINE)

        # 5. Remove bullet list markers (*, -, •, 1., 2.)
        cleaned = re.sub(r"^\s*[-*•]\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"^\s*\d+\.\s*", "", cleaned, flags=re.MULTILINE)

        # 6. Simplify markdown tables: remove pipe separators
        cleaned = re.sub(r"\|[^\n]+\|", "", cleaned)

        # 7. Strip emojis and special decorative symbols
        cleaned = re.sub(r"[🏛️🛡️🏭🏗️💍🎓🔬🌐💬📐🔍🚨📋⚡💰🔎⚖️🧪✨📝📖📚💡📊📄⚠️↗️➡️✅❌]", "", cleaned)

        # 8. Collapse whitespace into clean prose
        cleaned = re.sub(r"\n\s*\n+", "\n\n", cleaned)
        cleaned = " ".join(cleaned.split())

        return cleaned

    def transcribe(
        self,
        audio_bytes: bytes,
        language_code: Optional[str] = None,
        filename: str = "audio.wav",
        content_type: str = "audio/wav"
    ) -> SpeechTranscribeResponse:
        """
        Transcribes audio bytes to text using Sarvam AI STT (saaras:v1).
        If Sarvam API key is not configured, returns fallback indicator for browser STT.
        """
        start_time = time.perf_counter()

        if not self.is_configured():
            logger.info("Sarvam API key not set. Indicating browser Web Speech STT fallback.")
            return SpeechTranscribeResponse(
                transcript="",
                detected_language=language_code or "en-IN",
                language_confidence=0.0,
                provider="browser_fallback"
            )

        # Validate input
        if not audio_bytes or len(audio_bytes) < 100:
            return SpeechTranscribeResponse(
                transcript="",
                detected_language=language_code,
                language_confidence=0.0,
                provider="sarvam"
            )

        url = f"{self.base_url}/speech-to-text"
        headers = {
            "api-subscription-key": self.api_key
        }

        # Prepare multipart payload
        files = {
            "file": (filename, io.BytesIO(audio_bytes), content_type)
        }
        data = {
            "model": self.stt_model
        }
        if language_code and language_code != "unknown":
            data["language_code"] = language_code

        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.post(url, headers=headers, data=data, files=files)
                latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

                if resp.status_code == 200:
                    res_json = resp.json()
                    transcript = res_json.get("transcript", "").strip()
                    det_lang = res_json.get("language_code") or language_code or "en-IN"
                    logger.info(f"Sarvam STT success ({latency_ms}ms): '{transcript[:50]}...'")
                    return SpeechTranscribeResponse(
                        transcript=transcript,
                        detected_language=det_lang,
                        language_confidence=0.95,
                        provider="sarvam"
                    )
                else:
                    logger.warning(f"Sarvam STT returned HTTP {resp.status_code}: {resp.text[:120]}")
                    return SpeechTranscribeResponse(
                        transcript="",
                        detected_language=language_code,
                        language_confidence=0.0,
                        provider="browser_fallback"
                    )

        except Exception as e:
            logger.warning(f"Sarvam STT invocation failed ({e}). Falling back to browser recognition.")
            return SpeechTranscribeResponse(
                transcript="",
                detected_language=language_code,
                language_confidence=0.0,
                provider="browser_fallback"
            )

    def synthesize(
        self,
        request: SpeechSynthesizeRequest
    ) -> SpeechSynthesizeResponse:
        """
        Synthesizes text into natural spoken audio via Sarvam AI TTS (bulbul:v1).
        If Sarvam API key is not configured, returns fallback indicator for browser SpeechSynthesis.
        """
        start_time = time.perf_counter()
        target_lang = request.language
        lang_code = SARVAM_LANGUAGE_MAP.get(target_lang, "en-IN")
        # Ensure valid Sarvam bulbul:v3 speaker
        valid_speakers = {
            "ritu", "aditya", "priya", "neha", "rahul", "pooja", "rohan", "simran",
            "kavya", "amit", "dev", "ishita", "shreya", "anand", "ananya", "abhilash",
            "arjun", "renu", "vishnu"
        }
        raw_speaker = (request.speaker or self.default_speaker or "ritu").lower()
        speaker = raw_speaker if raw_speaker in valid_speakers else "ritu"

        # 1. Clean and optimize text for speakability
        spoken_text = self.clean_for_speech(request.text)

        # 2. If target language is an Indian language but input text is in English, translate spoken text
        if target_lang != LanguageType.EN and spoken_text.isascii() and len(spoken_text) > 0:
            try:
                from app.services.sarvam import get_sarvam_service
                sarvam = get_sarvam_service()
                tr_spoken = sarvam.translate_text(spoken_text, target_lang, LanguageType.EN)
                if tr_spoken and tr_spoken.strip() and not tr_spoken.isascii():
                    spoken_text = self.clean_for_speech(tr_spoken)
            except Exception as e:
                logger.debug(f"Spoken text translation bypass: {e}")

        if not self.is_configured():
            logger.info("Sarvam API key not set. Indicating browser SpeechSynthesis fallback.")
            return SpeechSynthesizeResponse(
                audio_base64=None,
                audio_format="audio/wav",
                provider="browser_fallback",
                fallback_to_browser=True,
                spoken_text=spoken_text,
                language_applied=lang_code
            )

        url = f"{self.base_url}/text-to-speech"
        headers = {
            "api-subscription-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "inputs": [spoken_text],
            "target_language_code": lang_code,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": self.tts_model
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.post(url, headers=headers, json=payload)
                latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

                if resp.status_code == 200:
                    res_json = resp.json()
                    audios = res_json.get("audios", [])
                    if audios and len(audios) > 0:
                        audio_b64 = audios[0]
                        logger.info(f"Sarvam TTS synthesized ({latency_ms}ms) for [{lang_code}]: '{spoken_text[:40]}...'")
                        return SpeechSynthesizeResponse(
                            audio_base64=audio_b64,
                            audio_format="audio/wav",
                            provider="sarvam",
                            fallback_to_browser=False,
                            spoken_text=spoken_text,
                            language_applied=lang_code
                        )

                logger.warning(f"Sarvam TTS returned HTTP {resp.status_code}: {resp.text[:120]}. Falling back to browser.")
                return SpeechSynthesizeResponse(
                    audio_base64=None,
                    audio_format="audio/wav",
                    provider="browser_fallback",
                    fallback_to_browser=True,
                    spoken_text=spoken_text,
                    language_applied=lang_code
                )

        except Exception as e:
            logger.warning(f"Sarvam TTS failed ({e}). Falling back to browser SpeechSynthesis.")
            return SpeechSynthesizeResponse(
                audio_base64=None,
                audio_format="audio/wav",
                provider="browser_fallback",
                fallback_to_browser=True,
                spoken_text=spoken_text,
                language_applied=lang_code
            )

_speech_service = None

def get_speech_service() -> SpeechService:
    global _speech_service
    if _speech_service is None:
        _speech_service = SpeechService()
    return _speech_service
