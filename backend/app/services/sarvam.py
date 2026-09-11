"""
Multilingual Translation & Normalization Layer for BIS Saathi (PS107).
Powered by Sarvam AI API for 10 Indian Languages.

Supported Languages:
1. English (en)
2. Hindi (hi) — हिन्दी
3. Marathi (mr) — मराठी
4. Bengali (bn) — বাংলা
5. Gujarati (gu) — ગુજરાતી
6. Tamil (ta) — தமிழ்
7. Telugu (te) — తెలుగు
8. Kannada (kn) — ಕನ್ನಡ
9. Malayalam (ml) — മലയാളം
10. Punjabi (pa) — ਪੰਜਾਬੀ

Core Architecture & Safety Principles:
1. Grounded Source of Truth: The knowledge base remains the official BIS corpus in English.
2. Token Preservation: Standard designations (e.g., 'IS 14543', 'IS 17803:2022'), 'HUID',
   'CML' numbers, 'QCO', scheme identifiers, and official BIS URLs are shielded from
   translation corruption via reversible token masking.
3. Graceful Fallback: If Sarvam API key is unset or external connection times out,
   the system seamlessly falls back to English without throwing errors or breaking the chat.
"""

import re
import logging
from typing import Dict, Optional, List, Tuple
import httpx

from app.config import settings
from app.models.schemas import LanguageType, TranslateMessageItem

logger = logging.getLogger(__name__)

# Mapping from internal LanguageType to Sarvam API BCP-47 language codes
SARVAM_LANGUAGE_MAP: Dict[LanguageType, str] = {
    LanguageType.EN: "en-IN",
    LanguageType.HI: "hi-IN",
    LanguageType.HINGLISH: "hi-IN",
    LanguageType.MR: "mr-IN",
    LanguageType.BN: "bn-IN",
    LanguageType.GU: "gu-IN",
    LanguageType.TA: "ta-IN",
    LanguageType.TE: "te-IN",
    LanguageType.KN: "kn-IN",
    LanguageType.ML: "ml-IN",
    LanguageType.PA: "pa-IN",
}

# Regex patterns for critical regulatory tokens that must NEVER be altered during translation
PROTECTED_PATTERNS = [
    re.compile(r"https?://[^\s)\]]+", re.IGNORECASE),                         # Canonical URLs
    re.compile(r"\bIS(?:/ISO)?\s*\d+(?::\d+)?\b", re.IGNORECASE),              # IS 14543, IS 17803:2022
    re.compile(r"\bCM/L[-\s]*\d{7,10}\b", re.IGNORECASE),                     # CML licence numbers
    re.compile(r"\bHUID\b", re.IGNORECASE),                                   # Hallmarking Unique ID
    re.compile(r"\bQCO\b", re.IGNORECASE),                                    # Quality Control Order
    re.compile(r"\bNABL\b", re.IGNORECASE),                                   # NABL accreditation
    re.compile(r"\bLIMS\b", re.IGNORECASE),                                   # Laboratory Info Management System
    re.compile(r"\bLRS\b", re.IGNORECASE),                                    # Laboratory Recognition Scheme
    re.compile(r"\bAHC\b", re.IGNORECASE),                                    # Assaying & Hallmarking Centre
    re.compile(r"\bScheme\s+[I|II|IV]\b", re.IGNORECASE),                     # Scheme I / II
    re.compile(r"\bOption\s+[1|2]\b", re.IGNORECASE),                         # Option 1 / Option 2
    re.compile(r"\bBIS\s+Care\b", re.IGNORECASE),                             # BIS Care App
    re.compile(r"\bManakonline\b", re.IGNORECASE),                            # Manakonline portal
]

class SarvamMultilingualService:
    """Multilingual interface layer integrating Sarvam AI."""

    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY.strip()
        self.base_url = settings.SARVAM_BASE_URL.rstrip("/")
        self.model = settings.SARVAM_MODEL
        self.timeout = 15.0  # Allow adequate time for multi-paragraph translation

    def is_configured(self) -> bool:
        """Returns True if Sarvam API key is supplied in environment."""
        return bool(self.api_key and len(self.api_key) > 5)

    def _mask_protected_entities(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Replaces protected statutory identifiers with placeholder tokens.
        Example: 'IS 14543' -> '__BISTOK0__'
        """
        replacements: Dict[str, str] = {}
        token_counter = 0

        def replace_fn(match):
            nonlocal token_counter
            original_val = match.group(0)
            token_placeholder = f"__BISTOK{token_counter}__"
            replacements[token_placeholder] = original_val
            token_counter += 1
            return token_placeholder

        masked_text = text
        for pat in PROTECTED_PATTERNS:
            masked_text = pat.sub(replace_fn, masked_text)

        return masked_text, replacements

    def _unmask_protected_entities(self, text: str, replacements: Dict[str, str]) -> str:
        """Restores exact original statutory identifiers after translation."""
        unmasked = text
        for placeholder, original in replacements.items():
            # Match placeholder allowing for potential minor space additions
            escaped_ph = re.escape(placeholder)
            unmasked = re.sub(escaped_ph, original, unmasked, flags=re.IGNORECASE)
            # Handle spaced variation like '__ BISTOK0 __'
            spaced_ph = r"__\s*" + re.escape(placeholder.replace("__", "")) + r"\s*__"
            unmasked = re.sub(spaced_ph, original, unmasked, flags=re.IGNORECASE)
        return unmasked

    def normalize_query_for_retrieval(self, query: str, user_lang: LanguageType) -> str:
        """
        Translates non-English user queries into English for hybrid retrieval against
        the verified BIS knowledge base, while preserving product codes and standard numbers.
        """
        if user_lang == LanguageType.EN or not self.is_configured():
            return query

        src_code = SARVAM_LANGUAGE_MAP.get(user_lang, "hi-IN")
        
        try:
            masked_query, replacements = self._mask_protected_entities(query)
            translated_en = self._call_sarvam_translate(
                text=masked_query,
                source_code=src_code,
                target_code="en-IN"
            )
            if translated_en:
                normalized = self._unmask_protected_entities(translated_en, replacements)
                logger.info(f"Normalized query from [{user_lang.value}] to [en]: '{normalized[:60]}...'")
                return normalized
        except Exception as e:
            logger.warning(f"Query normalization error (using original query): {e}")

        return query

    def translate_response(
        self,
        text: str,
        target_lang: LanguageType
    ) -> Tuple[str, Optional[str]]:
        """
        Translates grounded English response into user-selected Indian language.
        Returns (translated_text, multilingual_notice).
        """
        if target_lang == LanguageType.EN:
            return text, None

        if not self.is_configured():
            lang_display = target_lang.value.upper()
            notice = f"Sarvam API key not configured in backend/.env. Displaying verified BIS response in English (selected: {lang_display})."
            return text, notice

        target_code = SARVAM_LANGUAGE_MAP.get(target_lang)
        if not target_code:
            return text, f"Language '{target_lang.value}' is not supported by the translation layer."

        try:
            # 1. Mask statutory tokens to protect standards, URLs, and HUID
            masked_text, replacements = self._mask_protected_entities(text)

            # 2. Split large text into small chunks (< 800 chars) preserving sentence boundaries
            paragraphs = masked_text.split("\n\n")
            translated_paragraphs = []

            for p in paragraphs:
                trimmed = p.strip()
                if not trimmed:
                    translated_paragraphs.append("")
                    continue

                if len(trimmed) <= 800:
                    translated_p = self._call_sarvam_translate(
                        text=trimmed,
                        source_code="en-IN",
                        target_code=target_code
                    )
                    translated_paragraphs.append(translated_p if translated_p else trimmed)
                else:
                    # Split into sentences for safe translation
                    sentences = re.split(r"(?<=[.!?\n])\s+", trimmed)
                    sub_chunks = []
                    cur_chunk = ""
                    for s in sentences:
                        if len(cur_chunk) + len(s) + 1 < 750:
                            cur_chunk = (cur_chunk + " " + s).strip()
                        else:
                            if cur_chunk:
                                sub_chunks.append(cur_chunk)
                            cur_chunk = s
                    if cur_chunk:
                        sub_chunks.append(cur_chunk)

                    translated_subs = []
                    for chunk in sub_chunks:
                        tr_chunk = self._call_sarvam_translate(
                            text=chunk,
                            source_code="en-IN",
                            target_code=target_code
                        )
                        translated_subs.append(tr_chunk if tr_chunk else chunk)

                    translated_paragraphs.append(" ".join(translated_subs))

            translated_combined = "\n\n".join(translated_paragraphs)

            if translated_combined:
                # 3. Restore protected tokens
                final_text = self._unmask_protected_entities(translated_combined, replacements)
                return final_text, None
            else:
                notice = "Multilingual service is temporarily unavailable. Showing the answer in English."
                return text, notice

        except Exception as e:
            logger.warning(f"Sarvam translation failed ({e}). Falling back to English.")
            notice = "Multilingual service is temporarily unavailable. Showing the answer in English."
            return text, notice

    def _call_sarvam_translate(self, text: str, source_code: str, target_code: str) -> Optional[str]:
        """Direct HTTP invocation to Sarvam API translation endpoint."""
        url = f"{self.base_url}/translate"
        headers = {
            "api-subscription-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "input": text,
            "source_language_code": source_code,
            "target_language_code": target_code,
            "speaker_gender": "Female",
            "mode": "formal",
            "model": self.model,
            "enable_preprocessing": True
        }

        with httpx.Client(timeout=self.timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("translated_text", "")
            else:
                logger.warning(f"Sarvam API returned HTTP {resp.status_code}: {resp.text[:120]}")
                return None

    def translate_text(self, text: str, target_lang: LanguageType, source_lang: Optional[LanguageType] = None) -> str:
        """Translates a single block of text into the target language."""
        if not text:
            return ""
        if target_lang == (source_lang or LanguageType.EN) and target_lang == LanguageType.EN:
            return text
        
        translated, _ = self.translate_response(text, target_lang)
        return translated

    def translate_messages(
        self,
        messages: List[TranslateMessageItem],
        target_lang: LanguageType,
        source_lang: Optional[LanguageType] = None
    ) -> List[TranslateMessageItem]:
        """Translates an entire list of chat conversation messages into the target language."""
        if not messages:
            return []
        
        translated_list: List[TranslateMessageItem] = []
        for msg in messages:
            tr_content = self.translate_text(msg.content, target_lang, source_lang)
            translated_list.append(TranslateMessageItem(
                id=msg.id,
                role=msg.role,
                content=tr_content or msg.content
            ))
        return translated_list

_sarvam_service = None

def get_sarvam_service() -> SarvamMultilingualService:
    global _sarvam_service
    if _sarvam_service is None:
        _sarvam_service = SarvamMultilingualService()
    return _sarvam_service
