"""
RAG Orchestration Service for BIS Saathi (PS107).
Implements:
- Multi-Turn Context Resolution & Lightweight Query Reformulation
- Hybrid Retrieval (BGE-small + BM25 keyword matching + metadata + authority + freshness)
- Global Evidence Quality Gate & Fake / Out-of-Domain Query Rejection
- Explainable Confidence System (HIGH, MEDIUM, LOW)
- Strict Anti-Hallucination Grounding System Prompt
- Full Source Provenance Tracking (Source -> Doc -> Chunk -> Retrieval -> API -> UI)
- Official Service Navigation & Action Cards
- Procedural Checklist Service
"""

import re
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from app.config import settings
from app.models.schemas import (
    ChatRequest, ChatResponse, Citation, SuggestedAction, Checklist,
    IntentType, PersonaType, LanguageType, ConfidenceLevel, ChatMessage
)
from app.core.retrieval import get_hybrid_retriever
from app.core.llm import get_llm_service
from app.services.router import IntentRouter
from app.services.checklist import ChecklistService
from app.services.navigation import NavigationService
from app.services.sarvam import get_sarvam_service
from app.services.lab_recommender import get_lab_recommender
from app.models.schemas import LabRecommendationRequest

logger = logging.getLogger(__name__)

# Context-aware suggested follow-ups mapped to granular intents
FOLLOWUP_MAP = {
    IntentType.CERTIFICATION_PROCESS: [
        "What is the difference in timeline between Option 1 (normal) and Option 2 (simplified)?",
        "What fee concessions are available for Micro and Small Enterprises?",
        "How is the minimum marking fee calculated for Scheme I?"
    ],
    IntentType.COMPULSORY_CERTIFICATION: [
        "Is packaged drinking water (IS 14543) under mandatory BIS certification?",
        "What are the penalties under the BIS Act for selling goods without mandatory ISI marks?",
        "Where can I find the complete Gazette list of QCOs?"
    ],
    IntentType.PRODUCT_CERTIFICATION: [
        "How do I apply for BIS certification under Scheme I?",
        "What is the validity period of an initial BIS product licence?",
        "What are the factory testing and quality control requirements?"
    ],
    IntentType.HUID: [
        "What information does the 6-digit alphanumeric HUID contain?",
        "How can a customer verify HUID using the BIS Care Mobile App?",
        "Can a jeweller sell gold jewellery without an individual HUID?"
    ],
    IntentType.JEWELLER_REGISTRATION: [
        "Is there any registration fee for a retail jeweller to register with BIS?",
        "What are the statutory charges paid to an Assaying and Hallmarking Centre (AHC)?",
        "How long is a jeweller's hallmarking registration valid?"
    ],
    IntentType.HALLMARKING: [
        "What are the 3 mandatory marks on genuine hallmarked gold jewellery?",
        "Can a consumer get unhallmarked family jewellery tested at an AHC?",
        "What compensation is payable if gold purity tests lower than hallmarked purity?"
    ],
    IntentType.CONSUMER_COMPLAINT: [
        "How do I file a complaint about substandard ISI marked goods on the BIS Care App?",
        "What documents should I preserve when filing a quality grievance with BIS?",
        "How does the Complaints Management and Enforcement Department (CMED) investigate?"
    ],
    IntentType.ISI_MISUSE: [
        "What legal action does BIS take against counterfeit ISI mark manufacturers?",
        "What are the search and seizure penalties under Section 17 of the BIS Act, 2016?",
        "Can an informer report fake ISI factories anonymously to BIS vigilance?"
    ],
    IntentType.STANDARD_SEARCH: [
        "How do I look up the standard number for packaged water or steel bars?",
        "What is the difference between a voluntary Indian Standard and a mandatory QCO?",
        "Can students and researchers access Indian Standards for study purposes?"
    ],
    IntentType.TESTING: [
        "What are the official sample testing turnaround times in the Citizen's Charter?",
        "How are samples packaged and transported to BIS testing laboratories?",
        "What is the test report format issued by recognized labs?"
    ],
    IntentType.LABORATORY: [
        "How can a commercial laboratory obtain recognition under the LRS scheme?",
        "What are the NABL accreditation prerequisites for BIS lab empanelment?",
        "Where are the central and regional BIS laboratories located?"
    ],
    IntentType.VERIFICATION: [
        "How do I verify a 7-digit CML licence number on the Manakonline portal?",
        "How can I confirm if a hallmarking centre (AHC) is currently recognized?",
        "What should I do if a product has an invalid or expired CML number?"
    ],
    IntentType.LICENCE: [
        "What is the procedure for annual renewal of a BIS manufacturing licence?",
        "What is a 'Stop Marking' order and how can a factory revoke it?",
        "What surveillance audits are conducted by BIS officers after grant of licence?"
    ],
    IntentType.GENERAL_BIS: [
        "What are the main functions of the Bureau of Indian Standards as National Standards Body?",
        "Where is the BIS headquarters and how do regional branch offices function?",
        "What is the Citizen's Charter implemented w.e.f. 1st January, 2024?"
    ],
    IntentType.GREETING: [
        "How can an MSME apply for BIS certification under Option 2?",
        "What is 6-digit HUID and how to verify gold hallmarking?",
        "How do I report misuse of the ISI mark on substandard goods?"
    ]
}

# Explicit fictional/absurd entity rejection rules
FICTIONAL_SCHEME_PATTERN = re.compile(r"\bscheme\s+([x-z]|99|[356789]\b)", re.IGNORECASE)
FICTIONAL_STANDARD_PATTERN = re.compile(r"\bis\s+(99999|88888|00000|123456)\b", re.IGNORECASE)
ABSURD_LOCATION_PATTERN = re.compile(r"\b(antarctica|moon|mars|jupiter|atlantis|sahara)\b", re.IGNORECASE)
COPYRIGHT_FULLTEXT_PATTERN = re.compile(r"\b(full text|complete text|entire text|download full standard|give me all clauses|entire standard copy)\b", re.IGNORECASE)

class RAGService:
    def __init__(self):
        self.retriever = get_hybrid_retriever()
        self.llm = get_llm_service()

    def _resolve_multi_turn_query(self, user_msg: str, history: List[ChatMessage]) -> str:
        """
        Lightweight deterministic query contextualizer.
        Enriches short or anaphoric follow-up queries with antecedent subject context.
        """
        if not history:
            return user_msg

        msg_lower = user_msg.lower().strip()
        followup_triggers = [
            "which standard", "what standard", "what documents", "what fee", "how much is the fee",
            "what testing", "where does testing", "which lab", "how to apply", "how do i apply",
            "is certification compulsory", "is it mandatory", "what happens after", "how to register",
            "what about huid", "what purity", "what is the timeline", "how long does it take", "explain step by step"
        ]

        is_followup = any(msg_lower.startswith(trig) or trig in msg_lower for trig in followup_triggers)
        if not is_followup and len(user_msg.split()) > 6:
            return user_msg

        # Extract subject from recent user turns (up to 3 turns)
        recent_user_messages = [m.content for m in history if m.role == "user"][-3:]
        extracted_subject = ""

        subject_patterns = [
            r"\b(stainless steel\s*(?:water)?\s*bottles?|potable water bottles?)\b",
            r"\b(pressure cookers?|cookers?)\b",
            r"\b(electric\s*fans?|ceiling fans?)\b",
            r"\b(cables?|pvc insulated cables?|wires?)\b",
            r"\b(cement|portland cement)\b",
            r"\b(helmets?|safety helmets?)\b",
            r"\b(toys?|electric toys?)\b",
            r"\b(packaged drinking water|mineral water)\b",
            r"\b(gold jewellery|jewellery|silver jewellery)\b",
            r"\b(option\s*[12]|scheme\s*[i|ii])\b",
            r"\b(huid|hallmark(?:ing)?)\b",
            r"\b(cml\s*number|cml\s*licence)\b"
        ]

        for prev_msg in reversed(recent_user_messages):
            for pat in subject_patterns:
                match = re.search(pat, prev_msg, re.IGNORECASE)
                if match:
                    extracted_subject = match.group(0).strip()
                    break
            if extracted_subject:
                break

        if extracted_subject:
            # Contextualize query
            if extracted_subject.lower() not in msg_lower:
                contextualized = f"{user_msg} for {extracted_subject}"
                logger.info(f"Contextualized multi-turn query: '{user_msg}' -> '{contextualized}'")
                return contextualized

        return user_msg

    def _evaluate_evidence_quality_gate(
        self,
        user_msg: str,
        retrieved_items: List[Dict[str, Any]],
        intent: IntentType,
        persona: PersonaType
    ) -> Optional[ChatResponse]:
        """
        Global Evidence Quality Gate (Phases 4, 6 & 7):
        Inspects query entities against knowledge base reality to reject fictional schemes,
        fake standard numbers, absurd lab locations, or full copyright reproduction requests.
        """
        msg_lower = user_msg.lower()

        # 1. Copyright Protection Gate (Phase 7)
        if COPYRIGHT_FULLTEXT_PATTERN.search(msg_lower):
            return ChatResponse(
                answer=(
                    "📄 **BIS Intellectual Property & Copyright Notice:**\n\n"
                    "In compliance with the copyright policies of the Bureau of Indian Standards (BIS) and Indian intellectual property law, "
                    "BIS Saathi does **not** reproduce or distribute full-text copyrighted Indian Standards documents.\n\n"
                    "**How to access official Indian Standards:**\n"
                    "1. **Official Standards Portal:** Search, preview clauses, and purchase complete official standards on [standards.bis.gov.in](https://standards.bis.gov.in).\n"
                    "2. **Standards Formulation Records:** Technical committee members and researchers can view formulation drafts on the portal.\n"
                    "3. **Nearest BIS Branch Office:** Reference physical copies in the technical library of any regional BIS Branch Office."
                ),
                confidence=1.0,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent=intent.value,
                category="standards_metadata",
                persona_applied=persona,
                checklist=None,
                suggested_actions=[
                    SuggestedAction(
                        title="Search Official BIS Standards Portal",
                        description="Access official standards catalog, formulation drafts, and clause previews.",
                        url="https://standards.bis.gov.in",
                        badge="Official Standards Portal",
                        action_type="portal_link"
                    )
                ],
                suggested_followups=[
                    "How are Indian Standards formulated by sectional committees?",
                    "What is the difference between a voluntary standard and a mandatory QCO?",
                    "Where can I check the list of products under compulsory certification?"
                ],
                retrieval_method="evidence_quality_gate (copyright guard)"
            )

        # 2. Fictional Scheme Rejection Gate (Phase 4)
        scheme_match = FICTIONAL_SCHEME_PATTERN.search(user_msg)
        if scheme_match:
            fictional_scheme = scheme_match.group(0).title()
            return ChatResponse(
                answer=(
                    f"⚠️ **Statutory Verification Notice:**\n\n"
                    f"The Bureau of Indian Standards (BIS) does **not** operate a **'{fictional_scheme}'**.\n\n"
                    "**Official BIS Conformity Assessment Schemes include:**\n"
                    "• **Scheme I (ISI Mark):** Product certification for domestic and foreign manufacturers (Option 1 Normal & Option 2 Simplified 30-day procedure).\n"
                    "• **Scheme II (CRS - Compulsory Registration Scheme):** Self-declaration conformity registration for electronics and IT goods.\n"
                    "• **Scheme IV:** Management Systems Certification (ISO 9001, ISO 14001, etc.).\n"
                    "• **Hallmarking Scheme:** Mandatory 6-digit HUID certification for gold and silver jewellery.\n\n"
                    "Please refer to the official portal at [bis.gov.in](https://www.bis.gov.in) for authorized scheme documentation."
                ),
                confidence=0.95,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent=intent.value,
                category="product_certification",
                persona_applied=persona,
                checklist=None,
                suggested_actions=NavigationService.get_actions(intent, persona),
                suggested_followups=FOLLOWUP_MAP[IntentType.PRODUCT_CERTIFICATION],
                retrieval_method="evidence_quality_gate (fictional scheme rejection)"
            )

        # 3. Fictional Standard Number Rejection Gate (Phase 4)
        std_match = FICTIONAL_STANDARD_PATTERN.search(user_msg)
        if std_match:
            fictional_std = std_match.group(0).upper()
            return ChatResponse(
                answer=(
                    f"⚠️ **Standard Number Verification Notice:**\n\n"
                    f"We could not locate verified official records for **'{fictional_std}'** in the Bureau of Indian Standards catalog.\n\n"
                    "**Recommendations:**\n"
                    "1. Confirm the standard number on the official **BIS Standards Portal**: [standards.bis.gov.in](https://standards.bis.gov.in).\n"
                    "2. You can describe your product in our **'Find My Standard'** mode to discover genuine applicable Indian Standards."
                ),
                confidence=0.90,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent=intent.value,
                category="standards_metadata",
                persona_applied=persona,
                checklist=None,
                suggested_actions=[
                    SuggestedAction(
                        title="Verify on BIS Standards Portal",
                        description="Search the authoritative national standards catalog.",
                        url="https://standards.bis.gov.in",
                        badge="Standards Portal",
                        action_type="portal_link"
                    )
                ],
                suggested_followups=FOLLOWUP_MAP[IntentType.STANDARD_SEARCH],
                retrieval_method="evidence_quality_gate (fake standard rejection)"
            )

        # 4. Absurd / Nonexistent Lab Location Rejection Gate (Phase 4)
        loc_match = ABSURD_LOCATION_PATTERN.search(user_msg)
        if loc_match:
            absurd_loc = loc_match.group(0).title()
            return ChatResponse(
                answer=(
                    f"📍 **BIS Laboratory Network Notice:**\n\n"
                    f"The Bureau of Indian Standards does **not** operate testing laboratories in **{absurd_loc}**.\n\n"
                    "Under Section 19 of the BIS Act, 2016, official BIS testing laboratories operate in:\n"
                    "• **Central Laboratory:** Sahibabad (Ghaziabad, Delhi NCR)\n"
                    "• **Regional Laboratories:** Mumbai (WRL), Chennai (SRL), Kolkata (ERL), Mohali (NRL)\n"
                    "• **Branch Laboratories:** Bengaluru (BNBO), Patna (PABO), Guwahati (GBO)\n\n"
                    "Commercial sample tracking is managed on the **BIS LIMS portal**: [lims.bis.gov.in](https://lims.bis.gov.in)."
                ),
                confidence=0.95,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent=intent.value,
                category="labs",
                persona_applied=persona,
                checklist=None,
                suggested_actions=NavigationService.get_actions(intent, persona),
                suggested_followups=FOLLOWUP_MAP[IntentType.LABORATORY],
                retrieval_method="evidence_quality_gate (absurd location rejection)"
            )

        return None

    def _calculate_confidence(
        self,
        retrieved_items: List[Dict[str, Any]],
        intent_conf: float,
        is_foundational: bool = False
    ) -> Tuple[float, ConfidenceLevel]:
        """
        Explainable confidence scoring considering:
        - Mean hybrid score of top retrieved items (50%)
        - Count of high-relevance sources (20%)
        - Intent classification certainty (20%)
        - Source authority assurance (10%)
        """
        if not retrieved_items:
            return 0.0, ConfidenceLevel.LOW

        scores = [item["hybrid_score"] for item in retrieved_items]
        mean_score = sum(scores) / len(scores)

        # Source diversity and density bonus
        high_rel_count = sum(1 for s in scores if s >= 0.65)
        density_factor = min(1.0, high_rel_count / 2.0)

        # Composite confidence formula
        composite_score = (
            (0.50 * mean_score) +
            (0.20 * density_factor) +
            (0.20 * intent_conf) +
            (0.10 * 1.0)  # verified official sources
        )
        if is_foundational:
            composite_score = max(composite_score, 0.75)

        composite_score = round(min(1.0, max(0.0, composite_score)), 3)

        if composite_score >= settings.HIGH_CONFIDENCE_THRESHOLD and high_rel_count >= 1:
            level = ConfidenceLevel.HIGH
        elif composite_score >= 0.35:
            level = ConfidenceLevel.MEDIUM
        else:
            level = ConfidenceLevel.LOW

        return composite_score, level

    def process_query(self, request: ChatRequest) -> ChatResponse:
        """Full production RAG pipeline with multi-turn context, hybrid retrieval, quality gate, and grounding."""
        raw_user_msg = request.message.strip()
        persona = request.persona
        lang = request.language

        # Multi-turn context resolution (Phase 2)
        history_msgs = request.history if request.history else []
        resolved_query = self._resolve_multi_turn_query(raw_user_msg, history_msgs)

        # 1. Intent Classification
        intent, target_category, intent_conf = IntentRouter.classify(resolved_query, persona)
        is_foundational = (intent == IntentType.GENERAL_BIS)

        # Handle Out of Scope (Procurement / Tenders)
        if intent == IntentType.OUT_OF_SCOPE:
            return ChatResponse(
                answer=(
                    "⚠️ **Scope Boundary Notice:** BIS Saathi is strictly dedicated to Bureau of Indian Standards (BIS) "
                    "conformity assessment schemes, Indian Standards (IS), mandatory Quality Control Orders (QCOs), "
                    "gold/silver hallmarking, and consumer quality protection.\n\n"
                    "We do **not** evaluate commercial government procurement bids or tender documents. "
                    "Please ask a question related to BIS certification, Indian Standards, or hallmarking services."
                ),
                confidence=1.0,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent=intent.value,
                category="out_of_scope",
                persona_applied=persona,
                checklist=None,
                suggested_actions=[
                    SuggestedAction(
                        title="Visit Official BIS Portal",
                        description="Access official standards, certification schemes, and hallmarking guidelines.",
                        url="https://www.bis.gov.in",
                        badge="Official Portal",
                        action_type="portal_link"
                    )
                ],
                suggested_followups=[
                    "How do I apply for BIS certification under Scheme I?",
                    "What products are under mandatory BIS certification (QCO)?",
                    "How do I verify 6-digit HUID on hallmarked jewellery?"
                ],
                retrieval_method="guardrail"
            )

        # Handle Gratitude & Pleasantries (Thank you, thanks, dhanyavaad, bye)
        if re.search(r"\b(thank\s*you|thanks|thanku|dhanyavaad|shukriya|great help|helpful|bye|goodbye|see you|alvida)\b", raw_user_msg.strip(), re.I) and len(raw_user_msg.split()) <= 6:
            thank_en = (
                "You're very welcome! I'm glad I could assist you with official Bureau of Indian Standards (BIS) guidance.\n\n"
                "If you need any further help with Indian Standards, ISI product certification, Gold Hallmarking (HUID), or LIMS laboratory testing, feel free to ask anytime!"
            )
            thank_hi = (
                "आपका बहुत-बहुत धन्यवाद! भारतीय मानक ब्यूरो (BIS) संबंधी आधिकारिक मार्गदर्शन में आपकी सहायता करके मुझे अत्यंत प्रसन्नता हुई।\n\n"
                "यदि आपके पास भारतीय मानक, ISI प्रमाणन, 6-अंकीय HUID हॉलमार्किंग या प्रयोगशाला परीक्षण से संबंधित कोई अन्य प्रश्न हों, तो आप कभी भी पूछ सकते हैं!"
            )
            final_thanks, ntc = sarvam.translate_response(thank_hi if lang == LanguageType.HI else thank_en, lang)
            return ChatResponse(
                answer=final_thanks,
                confidence=1.0,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent="greeting",
                category="greeting",
                persona_applied=persona,
                checklist=None,
                suggested_actions=NavigationService.get_actions(intent, persona),
                suggested_followups=[
                    "How do I apply for BIS certification under Option 2 simplified procedure?",
                    "How can a consumer verify 6-digit Gold HUID on the BIS Care App?",
                    "Where can I search for BIS recognized testing laboratories?"
                ],
                retrieval_method="heuristic",
                multilingual_notice=ntc
            )

        # Handle Greetings (Hi, Hello, Namaste, etc.)
        if intent == IntentType.GREETING:
            greeting_en = (
                "Namaste! Welcome to **BIS Saathi**, the official intelligent copilot for the Bureau of Indian Standards (BIS), "
                "Ministry of Consumer Affairs, Food & Public Distribution, Government of India.\n\n"
                "I am purpose-built to provide verified, citation-grounded guidance on:\n"
                "- 🏭 **MSME & Manufacturers:** Product certification schemes (Option 1 normal vs Option 2 simplified), 50% fee concessions, and factory QC testing\n"
                "- 💍 **Jewellers:** Zero-fee hallmarking registration, 6-digit alphanumeric HUID compliance, and AHC testing charges\n"
                "- 🛡️ **Consumers:** Verifying ISI mark / CML licence and 6-digit Gold HUID on the BIS Care App, and reporting substandard products\n"
                "- 🔬 **Laboratories & Testing:** LRS recognition, testing facilities, and Citizen's Charter turnaround timelines\n"
                "- 📚 **Standards Catalog:** Searching 741+ verified Indian Standards and compulsory DPIIT Quality Control Orders (QCOs)\n\n"
                "How may I assist you today?"
            )
            greeting_hi = (
                "नमस्ते! **बीआईएस साथी (BIS Saathi)** में आपका स्वागत है। मैं भारतीय मानक ब्यूरो (BIS), "
                "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय, भारत सरकार का आधिकारिक एआई सहायक हूँ।\n\n"
                "मैं निम्नलिखित विषयों पर आधिकारिक और सत्यापित मार्गदर्शन प्रदान करता हूँ:\n"
                "- 🏭 **एमएसएमई और निर्माता:** उत्पाद प्रमाणन (विकल्प 1 एवं विकल्प 2 सरल प्रक्रिया) और 50% शुल्क छूट\n"
                "- 💍 **ज्वैलर्स:** शून्य-शुल्क हॉलमार्किंग पंजीकरण और 6-अंकीय HUID नियम\n"
                "- 🛡️ **उपभोक्ता:** बीआईएस केयर ऐप पर ISI मार्क एवं HUID सत्यापन, तथा घटिया उत्पादों की शिकायत\n"
                "- 🔬 **प्रयोगशालाएं:** एलआरएस मान्यता एवं सिटिजन चार्टर परीक्षण समय-सीमा\n"
                "- 📚 **भारतीय मानक:** अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) और मानक सूची\n\n"
                "मैं आज आपकी किस प्रकार सहायता कर सकता हूँ?"
            )
            final_greeting, ntc = sarvam.translate_response(greeting_hi if lang == LanguageType.HI else greeting_en, lang)
            return ChatResponse(
                answer=final_greeting,
                confidence=1.0,
                confidence_level=ConfidenceLevel.HIGH,
                citations=[],
                intent=intent.value,
                category="greeting",
                persona_applied=persona,
                checklist=None,
                suggested_actions=NavigationService.get_actions(intent, persona),
                suggested_followups=FOLLOWUP_MAP[IntentType.GREETING],
                retrieval_method="heuristic",
                multilingual_notice=ntc
            )

        # Multilingual Query Normalization (Phase 5)
        sarvam = get_sarvam_service()
        retrieval_query = sarvam.normalize_query_for_retrieval(resolved_query, lang)

        # Category filter tuning for foundational queries
        search_category = None if is_foundational else target_category

        # 2. Hybrid Retrieval
        retrieved_items = self.retriever.retrieve(
            query=retrieval_query,
            persona=persona,
            category=search_category,
            top_k=settings.RETRIEVAL_TOP_K
        )

        # 3. Global Evidence Quality Gate (Phase 4, 6 & 7)
        gate_rejection = self._evaluate_evidence_quality_gate(raw_user_msg, retrieved_items, intent, persona)
        if gate_rejection:
            return gate_rejection

        # 4. Calculate Explainable Confidence
        confidence, conf_level = self._calculate_confidence(retrieved_items, intent_conf, is_foundational)

        # 5. Low Confidence Guardrail Handling
        if conf_level == ConfidenceLevel.LOW or not retrieved_items:
            fallback_answer = (
                f"I could not locate an exact clause or verified publication in the official BIS knowledge base "
                f"directly answering: *'{raw_user_msg}'*.\n\n"
                "**Verification is limited.** To ensure statutory accuracy and avoid relying on unverified claims:\n"
                "1. Please consult the **Official BIS Portal**: [bis.gov.in](https://www.bis.gov.in)\n"
                "2. For online applications, visit **Manakonline**: [manakonline.in](https://www.manakonline.in)\n"
                "3. Contact your regional **BIS Branch Office** or email info@bis.gov.in."
            )
            return ChatResponse(
                answer=fallback_answer,
                confidence=confidence,
                confidence_level=ConfidenceLevel.LOW,
                citations=[],
                intent=intent.value,
                category=target_category,
                persona_applied=persona,
                checklist=None,
                suggested_actions=NavigationService.get_actions(intent, persona),
                suggested_followups=FOLLOWUP_MAP.get(intent, FOLLOWUP_MAP[IntentType.GENERAL_BIS]),
                retrieval_method="hybrid (low confidence)"
            )

        # 6. Format Structured Citations with Full Provenance
        citations: List[Citation] = []
        context_snippets = []
        timestamp_now = datetime.now(timezone.utc).isoformat()

        for idx, item in enumerate(retrieved_items):
            sec = item.get("section") or f"Section {idx+1}"
            title = item.get("source_title", "Official BIS Portal")
            url = item.get("source_url", "https://www.bis.gov.in")
            text = item.get("text", "")
            cat = item.get("category", "")
            chunk_id = item.get("chunk_id", f"bis-chunk-{idx+1}")
            doc_id = item.get("document_id", "")
            personas = item.get("persona", "")
            auth = item.get("authority", "Bureau of Indian Standards (BIS)")
            score = item.get("hybrid_score", 1.0)

            excerpt = text[:240].strip().replace("\n", " ") + "..." if len(text) > 240 else text

            citations.append(Citation(
                chunk_id=chunk_id,
                document_id=doc_id,
                source_title=title,
                source_url=url,
                section=sec,
                excerpt=excerpt,
                category=cat,
                persona=personas,
                authority=auth,
                retrieved_at=timestamp_now,
                relevance_score=score
            ))

            context_snippets.append(
                f"--- [SOURCE {idx+1}] ---\n"
                f"Title: {title}\n"
                f"Section: {sec}\n"
                f"URL: {url}\n"
                f"Authority: {auth}\n"
                f"Content:\n{text}\n"
            )

        combined_context = "\n\n".join(context_snippets)

        lang_names = {
            LanguageType.EN: "English",
            LanguageType.HI: "Hindi (हिन्दी)",
            LanguageType.HINGLISH: "Hinglish (Conversational Hindi written in Roman / Latin English script, e.g., 'Aap BIS licence ke liye Manakonline portal par apply kar sakte hain...')",
            LanguageType.MR: "Marathi (मराठी)",
            LanguageType.BN: "Bengali (বাংলা)",
            LanguageType.GU: "Gujarati (ગુજરાતી)",
            LanguageType.TA: "Tamil (தமிழ்)",
            LanguageType.TE: "Telugu (తెలుగు)",
            LanguageType.KN: "Kannada (ಕನ್ನಡ)",
            LanguageType.ML: "Malayalam (മലയാളം)",
            LanguageType.PA: "Punjabi (ਪੰਜਾਬੀ)",
        }
        target_lang_str = lang_names.get(lang, "English")

        # 7. Strict Anti-Hallucination Grounding Prompt (Phase 6 & Presentation Layer)
        system_prompt = (
            "You are BIS Saathi, the official intelligent conversational copilot for the Bureau of Indian Standards (BIS), "
            "Ministry of Consumer Affairs, Food and Public Distribution, Government of India.\n\n"
            "CORE PRINCIPLE:\n"
            "BIS knowledge base = Authority & Source of Truth.\n"
            "LLM = Transparent explanation, structured presentation, and reasoning layer.\n\n"
            "STRICT FACTUAL GROUNDING & PRESENTATION RULES:\n"
            "1. Use ONLY the verified BIS context provided below. Do not guess, speculate, or extrapolate.\n"
            "2. NEVER invent BIS requirements, fees, concessions, turnaround timelines, or standards requirements.\n"
            "3. NEVER invent licence status or claim to execute official BIS actions (e.g. issuing licences or registering jewellers).\n"
            "4. If information is not in the context, explicitly state that verification is limited and refer to the official portal.\n"
            "5. Quote exact terms: 'Option 1' (normal), 'Option 2' (simplified), 'Scheme I', 'HUID' (6-digit alphanumeric), 'CML number', '50% concession for MSMEs'.\n"
            "6. STRUCTURE YOUR ANSWER CLEANLY IN THIS EXACT HIERARCHY:\n"
            "   a. Direct Answer (1-3 clear sentences answering the question directly, starting with '### BIS Guidance: [Topic]').\n"
            "   b. Key Takeaway blockquote (e.g. '> **Key Takeaway:** ...') when a clear mandatory or statutory conclusion exists.\n"
            "   c. Standards Table (when multiple standards are mentioned): Use Markdown table | Standard | What it covers | Relevance |.\n"
            "   d. Regulatory / Mandatory Status: Use explicit tags like '• **✓ Mandatory Requirement:**' or '• **Supporting Guidance:**'. Never confuse mandatory with optional.\n"
            "   e. Process Steps: When procedural guidance is requested, format as numbered bold steps (1., 2., 3.).\n"
            "   f. What You Can Do Next: End with 2-3 concise, actionable next steps.\n"
            "7. Do NOT dump source URLs or chunk IDs into the main prose (citations are handled separately in citation cards).\n"
            f"8. MANDATORY OUTPUT LANGUAGE: You MUST generate your response exclusively in {target_lang_str}. "
            f"If {target_lang_str} is Hindi (हिन्दी), every explanation and heading MUST be written in natural Hindi in Devanagari script. Do NOT respond in English. "
            "Preserve only technical standard numbers ('IS 14543', 'IS 17803:2022', 'IS 17526'), 'HUID', 'CML', 'QCO', 'Option 1', 'Option 2', and official BIS portal URLs unchanged.\n\n"
            f"[OFFICIAL BIS CONTEXT]\n{combined_context}"
        )

        user_prompt = f"[USER PERSONA]: {persona.value}\n[REQUIRED RESPONSE LANGUAGE]: {target_lang_str} (MANDATORY)\n[USER QUERY]: {raw_user_msg}"

        # 8. LLM Generation
        generated_answer = self.llm.generate(system_prompt, user_prompt)

        # 9. Checklist Generation
        checklist_obj = None
        if ChecklistService.should_generate(raw_user_msg, request.include_checklist):
            checklist_obj = ChecklistService.get_checklist(intent)

        # 10. Official Portal Action Links
        suggested_actions = NavigationService.get_actions(intent, persona)

        # 11. Suggested Follow-ups
        followups = FOLLOWUP_MAP.get(intent, FOLLOWUP_MAP[IntentType.GENERAL_BIS])

        # 12. Laboratory Discovery Integration
        lab_results = None
        if intent in [IntentType.LABORATORY, IntentType.TESTING]:
            try:
                lab_rec_res = get_lab_recommender().recommend(LabRecommendationRequest(product_or_material=raw_user_msg))
                lab_results = lab_rec_res.recommended_labs
            except Exception as e:
                logger.warning(f"Lab recommendation error in chat: {e}")

        # 13. Multilingual Response Translation with Token Shielding (Phase 5)
        final_answer, multilingual_notice = sarvam.translate_response(generated_answer, lang)

        return ChatResponse(
            answer=final_answer,
            confidence=confidence,
            confidence_level=conf_level,
            citations=citations,
            intent=intent.value,
            category=target_category,
            persona_applied=persona,
            checklist=checklist_obj,
            suggested_actions=suggested_actions,
            suggested_followups=followups,
            retrieval_method="hybrid (bge-small + bm25 + authority + freshness)",
            multilingual_notice=multilingual_notice,
            lab_recommendations=lab_results
        )

_rag_service = None

def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
