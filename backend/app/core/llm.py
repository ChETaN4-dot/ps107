"""
LLM Client Integration for BIS Saathi (PS107).
Supports local Ollama with Qwen2.5 (3B / 7B).
Optimized for high-speed response generation, persistent HTTP connection pooling,
and strict, beautifully structured factual synthesis.
"""

import re
import time
import json
import logging
from typing import Optional, List, Dict, Any
import httpx

from app.config import settings
from app.models.schemas import LanguageType, TranslateMessageItem

logger = logging.getLogger(__name__)

class GroqLLMService:
    """High-speed cloud LLM integration using Groq API (Qwen / Llama)."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY.strip()
        self.base_url = settings.GROQ_BASE_URL.rstrip("/")
        self.model_name = settings.GROQ_MODEL
        self._client = httpx.Client(
            timeout=10.0,
            limits=httpx.Limits(max_keepalive_connections=10, max_connections=20)
        )

    def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 8)

    def generate(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if not self.is_available():
            return None
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 1024,
            "top_p": 0.95
        }
        try:
            resp = self._client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                if content:
                    logger.info(f"Groq LLM generated response ({len(content)} chars)")
                    return content
            logger.warning(f"Groq generation returned HTTP {resp.status_code}: {resp.text[:120]}")
            return None
        except Exception as e:
            logger.warning(f"Groq generation error: {e}")
            return None

    def translate_messages_fast(
        self,
        messages: List[TranslateMessageItem],
        target_lang: LanguageType,
        source_lang: Optional[LanguageType] = None
    ) -> Optional[List[TranslateMessageItem]]:
        if not self.is_available() or not messages:
            return None

        target_name = "Hindi (हिन्दी) in Devanagari script" if target_lang in [LanguageType.HI, LanguageType.HINGLISH] else target_lang.value
        input_list = [{"id": m.id, "role": m.role, "content": m.content} for m in messages]
        prompt = (
            f"You are a statutory translator for the Bureau of Indian Standards (BIS).\n"
            f"Translate the 'content' of each conversation message into natural, fluent {target_name}.\n"
            "STRICT RULES:\n"
            "1. Preserve standard numbers (e.g., 'IS 14543', 'IS 17803:2022', 'IS 17526'), 'HUID', 'CML', 'QCO', and official URLs unchanged.\n"
            "2. Keep the exact same 'id' and 'role' for each message.\n"
            "3. Respond ONLY with a valid JSON array of objects with keys 'id', 'role', and 'content'.\n\n"
            f"Messages to translate:\n{json.dumps(input_list, ensure_ascii=False)}"
        )
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.05,
            "max_tokens": 1500
        }
        try:
            resp = self._client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                # Robust extraction of JSON array [ ... ]
                array_match = re.search(r"\[\s*\{[\s\S]*\}\s*\]", raw_text)
                json_str = array_match.group(0) if array_match else raw_text
                parsed = json.loads(json_str)

                if isinstance(parsed, list) and len(parsed) > 0:
                    results = []
                    for item in parsed:
                        results.append(TranslateMessageItem(
                            id=str(item.get("id", "")),
                            role=item.get("role", "user"),
                            content=item.get("content", "")
                        ))
                    logger.info(f"Groq fast translation succeeded for {len(results)} messages to [{target_lang.value}]")
                    return results
        except Exception as e:
            logger.warning(f"Groq fast translation error: {e}")
        return None

class OllamaLLMService:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        self.model_name = settings.OLLAMA_MODEL
        self.timeout = settings.OLLAMA_TIMEOUT
        self._model_available: Optional[bool] = None
        self._last_availability_check: float = 0.0
        self._check_ttl: float = 60.0  # Cache availability for 60 seconds
        
        # Persistent HTTP client with connection pooling for ultra-low latency
        self._client = httpx.Client(
            timeout=min(self.timeout, 4.0),
            limits=httpx.Limits(max_keepalive_connections=10, max_connections=20)
        )

    def is_available(self) -> bool:
        """Check if local Ollama daemon is reachable and responding (cached with TTL)."""
        now = time.time()
        if self._model_available is not None and (now - self._last_availability_check) < self._check_ttl:
            return self._model_available

        self._last_availability_check = now
        try:
            resp = self._client.get(f"{self.base_url}/api/tags", timeout=0.8)
            if resp.status_code == 200:
                models = [m.get("name") for m in resp.json().get("models", [])]
                if self.model_name in models or any(self.model_name.split(":")[0] in m for m in models):
                    self._model_available = True
                    return True
                else:
                    self._model_available = False
                    logger.info(f"Ollama running but model '{self.model_name}' not downloaded yet. Fallback synthesis active.")
                    return False
            self._model_available = False
            return False
        except Exception:
            self._model_available = False
            return False

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """
        Invoke Ollama chat endpoint with system and user prompts.
        Falls back gracefully and immediately if Ollama or model is unreachable.
        """
        if not self.is_available():
            return self._fallback_synthesis(system_prompt, user_prompt)

        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False,
            "options": {
                "temperature": 0.05,  # Strict factual determinism
                "top_p": 0.9,
                "num_predict": 512   # Optimized for fast, concise responses
            }
        }

        try:
            response = self._client.post(
                f"{self.base_url}/api/chat",
                json=payload
            )
            if response.status_code == 200:
                data = response.json()
                self._model_available = True
                content = data.get("message", {}).get("content", "").strip()
                if content:
                    return content
                return self._fallback_synthesis(system_prompt, user_prompt)
            else:
                self._model_available = False
                logger.warning(f"Ollama returned status {response.status_code}. Using deterministic grounding fallback.")
                return self._fallback_synthesis(system_prompt, user_prompt)
        except Exception as e:
            self._model_available = False
            logger.warning(f"Ollama local connection failed ({e}). Utilizing deterministic grounding fallback.")
            return self._fallback_synthesis(system_prompt, user_prompt)

    def _fallback_synthesis(self, system_prompt: str, user_prompt: str) -> str:
        """
        Deterministic, zero-hallucination, 6-tier structured factual synthesis
        from verified official BIS context snippets.
        """
        context_block = ""
        if "[OFFICIAL BIS CONTEXT]" in system_prompt:
            context_block = system_prompt.split("[OFFICIAL BIS CONTEXT]")[1].strip()
        elif "[OFFICIAL BIS CONTEXT]" in user_prompt:
            context_block = user_prompt.split("[OFFICIAL BIS CONTEXT]")[1].strip()

        if not context_block:
            return (
                "### BIS Guidance: Conformity Assessment & Certification\n\n"
                "Based on verified publications from the **Bureau of Indian Standards (BIS)**, conformity assessment "
                "and certification require compliance with notified Indian Standards and statutory schemes.\n\n"
                "### What You Can Do Next\n"
                "1. Search the official standards catalogue on [standards.bis.gov.in](https://standards.bis.gov.in).\n"
                "2. Apply for online product certification via [manakonline.in](https://www.manakonline.in)."
            )

        # 1. Parse and clean source blocks
        sources = context_block.split("--- [SOURCE ")
        valid_sections = []
        all_standards_found = {}

        # Extract user query topic if available
        user_query_match = re.search(r"\[USER QUERY\]:\s*(.*)", user_prompt)
        user_query = user_query_match.group(1).strip() if user_query_match else "Regulatory Overview"
        topic_title = re.sub(r"[?!.]+$", "", user_query).strip()

        for src in sources:
            if not src.strip():
                continue
            lines = src.strip().split("\n")
            title = ""
            section = ""
            content_lines = []
            is_content = False

            for line in lines:
                if line.startswith("Title:"):
                    title = line.replace("Title:", "").strip()
                elif line.startswith("Section:"):
                    section = line.replace("Section:", "").strip()
                elif line.startswith("Content:"):
                    is_content = True
                elif is_content:
                    if line.strip():
                        content_lines.append(line.strip())

            content_text = " ".join(content_lines).strip()
            # Clean noise, pagination, breadcrumbs, markdown headers, and FAQ prefixes
            content_text = re.sub(r"\*\s*Home\s+.*", "", content_text).strip()
            content_text = re.sub(r"--- PAGE \d+ --- Ref: [^\n\.]*", "", content_text).strip()
            content_text = re.sub(r"\d+\s*\|\s*P\s*a\s*g\s*e", "", content_text).strip()
            content_text = re.sub(r"#{1,6}\s*", "", content_text).strip()
            content_text = re.sub(r"Frequently Asked Questions\s*Q\s*\d+[\.:]?", "", content_text, flags=re.IGNORECASE).strip()
            content_text = re.sub(r"\bQ\s*\d+[\.:]\s*", "", content_text, flags=re.IGNORECASE).strip()
            # Normalize smart quotes and weird punctuation
            content_text = content_text.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
            content_text = re.sub(r"\s+", " ", content_text).strip()

            # Find IS standards mentioned in this section
            standard_matches = re.findall(r"\b(IS\s+\d+(?:\s*(?:Part\s*\d+|:\d{4}))?)\b", content_text, re.IGNORECASE)
            for std in standard_matches:
                clean_std = std.strip().upper()
                if clean_std not in all_standards_found:
                    all_standards_found[clean_std] = title or "Relevant Indian Standard"

            if content_text and len(content_text) > 30:
                header = section if section and not section.startswith("Section") else title
                valid_sections.append({
                    "header": header,
                    "title": title,
                    "content": content_text
                })

        if not valid_sections:
            return (
                "### BIS Guidance: Conformity Assessment & Certification\n\n"
                "Based on verified **Bureau of Indian Standards (BIS)** publications, conformity assessment and certification "
                "require compliance with notified Indian Standards. Please refer to the official citations below for details."
            )

        response_parts = []
        top_item = valid_sections[0]
        
        # Split into distinct clean sentences
        raw_sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", top_item["content"]) if len(s.strip()) > 15]
        
        # Filter out question sentences and question premises (e.g. "I have already got licence...")
        declarative_sentences = []
        for s in raw_sentences:
            if s.endswith("?"):
                continue
            if s.lower().startswith("i have already") or s.lower().startswith("i am a manufacturer"):
                continue
            declarative_sentences.append(s)

        sentences = declarative_sentences if declarative_sentences else raw_sentences

        # 1. Direct Answer (1–2 concise declarative sentences)
        lead_sentences = sentences[:2] if len(sentences) >= 2 else sentences[:1]
        lead_answer = " ".join(lead_sentences) if lead_sentences else "BIS guidelines specify standard requirements and certification provisions."
        response_parts.append(f"### BIS Guidance: {topic_title.title()}\n\n{lead_answer}\n")

        # 2. Key Takeaway Card (if regulatory / mandatory / statutory conclusion present)
        key_takeaway_sentence = None
        for s in sentences:
            if any(k in s.lower() for k in ["mandatory", "compulsory", "qco", "scope of licence", "cannot be used", "one licence is granted", "must comply"]):
                key_takeaway_sentence = s
                break
        
        if key_takeaway_sentence and key_takeaway_sentence != lead_answer:
            response_parts.append(f"> **Key Takeaway:** {key_takeaway_sentence}\n")

        # 3. Standards Table (if standards identified in evidence)
        if all_standards_found:
            table_lines = [
                "#### Applicable Standards",
                "| Standard | What it covers | Relevance |",
                "| :--- | :--- | :--- |"
            ]
            for std_num, std_desc in list(all_standards_found.items())[:4]:
                table_lines.append(f"| **{std_num}** | {std_desc} | Primary / Applicable |")
            response_parts.append("\n".join(table_lines) + "\n")

        # 4. Regulatory Status / Key Provisions
        remaining_sentences = [s for s in sentences if s not in lead_sentences and s != key_takeaway_sentence]
        if remaining_sentences:
            response_parts.append("#### Regulatory Provisions & Requirements")
            for s in remaining_sentences[:4]:
                if any(m in s.lower() for m in ["mandatory", "compulsory", "order", "qco", "scope of licence", "cannot be used"]):
                    response_parts.append(f"- **Mandatory Requirement:** {s}")
                elif any(g in s.lower() for g in ["test", "inspect", "audit", "sample", "record", "guideline"]):
                    response_parts.append(f"- **Supporting Guidance:** {s}")
                else:
                    response_parts.append(f"- {s}")
            response_parts.append("")

        # 5. Additional Verified Evidence Context (from secondary sources if available)
        if len(valid_sections) > 1 and len(response_parts) < 12:
            second_item = valid_sections[1]
            s2_sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", second_item["content"]) if len(s.strip()) > 20 and not s.endswith("?")]
            if s2_sentences:
                clean_header = re.sub(r"[^\w\s-]", "", second_item["header"]).strip()
                if clean_header and clean_header.lower() not in topic_title.lower():
                    response_parts.append(f"#### Additional Reference: {clean_header}")
                    for s in s2_sentences[:2]:
                        response_parts.append(f"- {s}")
                    response_parts.append("")

        # 6. Action-Oriented Next Steps
        response_parts.append("### What You Can Do Next")
        response_parts.append("1. Verify the exact scope and product grade against the notified Indian Standard.")
        response_parts.append("2. Check the relevant BIS Scheme I certification or registration route on Manakonline.")
        response_parts.append("3. Locate a BIS-recognized laboratory for pre-audit conformity testing if required.")

        return "\n".join(response_parts).strip()

class UnifiedLLMService:
    """Unified LLM router prioritizing high-speed Groq cloud with Ollama and deterministic grounding fallbacks."""

    def __init__(self):
        self.groq = GroqLLMService()
        self.ollama = OllamaLLMService()

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        # 1. High-speed Groq Cloud LLM
        if self.groq.is_available():
            ans = self.groq.generate(system_prompt, user_prompt)
            if ans:
                return ans

        # 2. Local Ollama LLM
        if self.ollama.is_available():
            ans = self.ollama.generate(system_prompt, user_prompt)
            if ans:
                return ans

        # 3. Deterministic verified statutory synthesis
        return self.ollama._fallback_synthesis(system_prompt, user_prompt)

    def translate_messages_fast(
        self,
        messages: List[TranslateMessageItem],
        target_lang: LanguageType,
        source_lang: Optional[LanguageType] = None
    ) -> Optional[List[TranslateMessageItem]]:
        if self.groq.is_available():
            return self.groq.translate_messages_fast(messages, target_lang, source_lang)
        return None

_llm_service = None

def get_llm_service() -> UnifiedLLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = UnifiedLLMService()
    return _llm_service

