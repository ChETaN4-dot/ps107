"""
Pydantic v2 data schemas for request validation and response serialization.
Strict, fully-typed models ensuring robust API contracts.
Supports multi-persona routing, official service navigation, standard recommendations,
laboratory guidance, and 10 Indian languages.
"""

from __future__ import annotations
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict

class PersonaType(str, Enum):
    MSME = "msme"
    MANUFACTURER = "manufacturer"
    JEWELLER = "jeweller"
    CONSUMER = "consumer"
    STUDENT = "student"
    RESEARCHER = "researcher"
    LAB = "lab"
    GENERAL = "general"

class LanguageType(str, Enum):
    EN = "en"  # English
    HI = "hi"  # हिन्दी (Hindi)
    HINGLISH = "hinglish"  # Hinglish (Hindi + English)
    MR = "mr"  # मराठी (Marathi)
    BN = "bn"  # বাংলা (Bengali)
    GU = "gu"  # ગુજરાતી (Gujarati)
    TA = "ta"  # தமிழ் (Tamil)
    TE = "te"  # తెలుగు (Telugu)
    KN = "kn"  # ಕನ್ನಡ (Kannada)
    ML = "ml"  # മലയാളം (Malayalam)
    PA = "pa"  # ਪੰਜਾਬੀ (Punjabi)

class ModeType(str, Enum):
    ASK_BIS = "ask_bis"
    FIND_MY_STANDARD = "find_my_standard"

class IntentType(str, Enum):
    PRODUCT_CERTIFICATION = "product_certification"
    CERTIFICATION_PROCESS = "certification_process"
    COMPULSORY_CERTIFICATION = "compulsory_certification"
    HALLMARKING = "hallmarking"
    HUID = "huid"
    JEWELLER_REGISTRATION = "jeweller_registration"
    CONSUMER_COMPLAINT = "consumer_complaint"
    ISI_MISUSE = "isi_misuse"
    STANDARD_SEARCH = "standard_search"
    LABORATORY = "laboratory"
    TESTING = "testing"
    LICENCE = "licence"
    VERIFICATION = "verification"
    GENERAL_BIS = "general_bis"
    GREETING = "greeting"
    OUT_OF_SCOPE = "out_of_scope"

    # Backward compatibility aliases
    CERTIFICATION = "product_certification"
    CONSUMER = "consumer_complaint"
    LABS = "laboratory"
    STANDARDS_QA = "standard_search"

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ChatMessage(BaseModel):
    role: str = Field(description="Role of the speaker: 'user', 'assistant', or 'system'")
    content: str = Field(description="Message text")

class Citation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    chunk_id: Optional[str] = Field(default=None, description="Unique chunk identifier from knowledge base")
    document_id: Optional[str] = Field(default=None, description="Originating document identifier or slug")
    source_title: str = Field(description="Official publication or document title")
    source_url: str = Field(description="Canonical bis.gov.in official URL")
    section: str = Field(description="Heading or FAQ question title")
    excerpt: Optional[str] = Field(default=None, description="Direct relevant text excerpt from official text")
    category: Optional[str] = Field(default=None, description="Regulatory category")
    persona: Optional[str] = Field(default=None, description="Target persona classification")
    authority: str = Field(default="Bureau of Indian Standards (BIS)", description="Governing statutory authority")
    retrieved_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="UTC timestamp of retrieval")
    relevance_score: float = Field(default=1.0, description="Hybrid relevance score (0.0 to 1.0)")

class SuggestedAction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    title: str = Field(description="Action title (e.g. 'Continue on Official BIS Portal')")
    description: str = Field(description="Purpose or instruction for the official portal action")
    url: str = Field(description="Official portal hyperlink")
    badge: str = Field(default="Official BIS Portal", description="Visual badge label")
    action_type: str = Field(default="portal_link", description="Action type: 'portal_link', 'checklist', 'verification'")

class ChecklistItem(BaseModel):
    id: str = Field(description="Unique step/item identifier")
    title: str = Field(description="Title of the checklist item")
    description: str = Field(description="Detailed regulatory instruction or requirement")
    mandatory: bool = Field(default=True, description="Whether this item is statutory / mandatory")
    reference_clause: Optional[str] = Field(default=None, description="Relevant Indian Standard or scheme clause")

class Checklist(BaseModel):
    title: str = Field(description="Title of the checklist")
    category: str = Field(description="Target regulatory scheme (e.g. Scheme I, Hallmarking)")
    steps: List[ChecklistItem] = Field(default_factory=list, description="Ordered checklist items")

# --- Chat Models ---
class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    message: str = Field(min_length=1, max_length=2000, description="User input message or question")
    persona: PersonaType = Field(default=PersonaType.GENERAL, description="User persona for context conditioning")
    language: LanguageType = Field(default=LanguageType.EN, description="Language preference (10 Indian languages)")
    mode: ModeType = Field(default=ModeType.ASK_BIS, description="Interaction mode ('ask_bis' or 'find_my_standard')")
    history: List[ChatMessage] = Field(default_factory=list, description="Conversation history for multi-turn context")
    conversation_history: Optional[List[ChatMessage]] = Field(default=None, description="Alias for conversation history")
    include_checklist: bool = Field(default=False, description="Explicit request to generate procedural checklist")

    def model_post_init(self, __context: Any) -> None:
        if self.conversation_history and not self.history:
            self.history = self.conversation_history

class ChatResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    answer: str = Field(description="Generated grounded response from verified BIS sources")
    confidence: float = Field(description="Confidence/grounding score from 0.0 to 1.0")
    confidence_level: ConfidenceLevel = Field(description="'HIGH', 'MEDIUM', or 'LOW'")
    citations: List[Citation] = Field(default_factory=list, description="Verified citations linking to official pages")
    intent: str = Field(description="Detected user regulatory intent")
    category: Optional[str] = Field(default=None, description="Detected or matched BIS regulatory category")
    persona_applied: PersonaType = Field(description="Persona applied to condition retrieval and tone")
    mode_applied: ModeType = Field(default=ModeType.ASK_BIS, description="Mode applied")
    checklist: Optional[Checklist] = Field(default=None, description="Actionable checklist if applicable")
    suggested_actions: List[SuggestedAction] = Field(default_factory=list, description="Official portal navigation links")
    suggested_followups: List[str] = Field(default_factory=list, description="Curated context-aware follow-up queries")
    retrieval_method: Optional[str] = Field(default="hybrid (semantic + bm25 + authority)", description="Retrieval mechanism utilized")
    multilingual_notice: Optional[str] = Field(default=None, description="Notice if language fallback was triggered")
    standard_recommendations: Optional[List[StandardRecommendation]] = Field(default=None, description="Structured standard recommendations if mode is find_my_standard")
    lab_recommendations: Optional[List[LabRecommendation]] = Field(default=None, description="Structured lab recommendations if query is laboratory related")

class StandardLifecycleStatus(str, Enum):
    CURRENT = "CURRENT"
    CURRENT_WITH_AMENDMENTS = "CURRENT_WITH_AMENDMENTS"
    SUPERSEDED = "SUPERSEDED"
    WITHDRAWN = "WITHDRAWN"
    REVISED = "REVISED"
    OBSOLETE = "OBSOLETE"
    UNKNOWN_STATUS = "UNKNOWN_STATUS"

class QCOStatus(str, Enum):
    MANDATORY = "MANDATORY"
    NOT_FOUND = "NOT_FOUND"
    NOT_APPLICABLE = "NOT_APPLICABLE"
    UNKNOWN = "UNKNOWN"

class StandardCategoryRole(str, Enum):
    PRIMARY_APPLICABLE = "PRIMARY_APPLICABLE"
    ADDITIONAL_APPLICABLE = "ADDITIONAL_APPLICABLE"
    RELATED_STANDARD = "RELATED_STANDARD"
    TEST_METHOD = "TEST_METHOD"
    HALLMARKING_ASSAY = "HALLMARKING_ASSAY"
    QCO_RELATED = "QCO_RELATED"
    HISTORICAL_SUPERSEDED = "HISTORICAL_SUPERSEDED"

# --- Standard Recommendation Models (Phase 9 & Lifecycle Layer) ---
class StandardRecommendation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    standard_number: str = Field(description="Official Indian Standard designation (e.g. IS 17803:2022)")
    title: str = Field(description="Official title of the standard")
    year: Optional[str] = Field(default=None, description="Year or edition")
    status: str = Field(default="Current", description="Regulatory status (e.g. Mandatory QCO or Voluntary)")
    category: str = Field(description="Industrial or product category")
    match_reason: str = Field(description="Explainable rationale for why this standard was recommended")
    confidence: float = Field(description="Relevance confidence score (0.0 to 1.0)")
    source_url: str = Field(default="https://standards.bis.gov.in", description="Official BIS standards portal URL")
    qco_mandatory: bool = Field(default=False, description="Whether product is under mandatory Quality Control Order")
    
    # Standard Lifecycle & Applicability Verification Fields
    lifecycle_status: StandardLifecycleStatus = Field(default=StandardLifecycleStatus.CURRENT, description="Authoritatively verified lifecycle state")
    superseded_by: Optional[str] = Field(default=None, description="Standard designation that supersedes this version")
    revision_of: Optional[str] = Field(default=None, description="Earlier historical standard this version replaced")
    amendment_count: int = Field(default=0, description="Count of official amendments in force")
    latest_amendment: Optional[str] = Field(default=None, description="Identifier of latest published amendment")
    qco_status: QCOStatus = Field(default=QCOStatus.NOT_FOUND, description="Compulsory Quality Control Order applicability")
    qco_reference: Optional[str] = Field(default=None, description="Gazette notification reference for QCO")
    applicability_role: StandardCategoryRole = Field(default=StandardCategoryRole.PRIMARY_APPLICABLE, description="Categorized standard role")
    verification_timestamp: Optional[str] = Field(default=None, description="ISO timestamp of official BIS verification")
    verification_source: Optional[str] = Field(default="BIS Official Standards Registry", description="Authoritative BIS source")
    verification_confidence: str = Field(default="HIGH", description="Verification confidence level")
    is_current_verified: bool = Field(default=True, description="Whether standard is strictly verified as current")
    live_verification_available: bool = Field(default=True, description="Whether live verification endpoint was reachable")

class StandardRecommendationRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    product_description: str = Field(min_length=2, max_length=1500, description="Description of product manufactured or imported")
    industry: Optional[str] = Field(default=None, description="Industry sector (e.g. Metallurgy, Electronics, Food)")
    product_category: Optional[str] = Field(default=None, description="Product category")
    keywords: Optional[List[str]] = Field(default=None, description="Specific material or operational keywords")
    persona: PersonaType = Field(default=PersonaType.MSME, description="Requesting persona")
    language: LanguageType = Field(default=LanguageType.EN, description="Language preference")
    include_historical: bool = Field(default=False, description="Whether to include historical/superseded standards")

class StandardRecommendationResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    product_description: str = Field(description="Original user product description")
    recommendations: List[StandardRecommendation] = Field(default_factory=list, description="Ranked recommended standards")
    historical_standards: List[StandardRecommendation] = Field(default_factory=list, description="Superseded or historical standards")
    total_candidates: int = Field(default=0, description="Total potential standards analyzed")
    confidence_level: ConfidenceLevel = Field(default=ConfidenceLevel.HIGH, description="Overall recommendation confidence")
    informational_disclaimer: str = Field(
        default="Recommendations are verified against official BIS publications and standards metadata. Presence in the catalogue does not imply current applicability. Only standards verified as CURRENT or CURRENT_WITH_AMENDMENTS are presented as applicable.",
        description="Statutory disclaimer"
    )
    official_portal_url: str = Field(default="https://standards.bis.gov.in", description="BIS Standards Portal link")

# --- Laboratory Recommendation Models (Phase 8) ---
class LabRecommendation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    lab_name: str = Field(description="Official laboratory name")
    location: str = Field(description="City and state")
    lab_type: str = Field(description="Facility type (Central Laboratory, Regional Lab, Branch Lab, or LRS Recognized)")
    discipline: Optional[str] = Field(default=None, description="Primary testing discipline domain")
    scope_highlights: str = Field(description="Testing disciplines (Chemical, Mechanical, Electrical, Microbiology)")
    address: str = Field(description="Complete official address")
    contact: str = Field(description="Official email or phone")
    tat_days: Optional[str] = Field(default=None, description="Turnaround time under Citizen's Charter")
    official_url: str = Field(default="https://www.bis.gov.in/laboratory-overview/", description="Official BIS laboratory link")

class LabRecommendationRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    product_or_material: str = Field(description="Product, standard, or material to be tested")
    location: Optional[str] = Field(default=None, description="Preferred city or state")
    testing_requirement: Optional[str] = Field(default=None, description="Specific test parameter if known")

class LabRecommendationResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    query: str = Field(description="User laboratory query")
    recommended_labs: List[LabRecommendation] = Field(default_factory=list, description="Verified BIS laboratories")
    official_lims_url: str = Field(default="https://www.bis.gov.in/laboratory-overview/lims/", description="LIMS Portal link")
    citizens_charter_url: str = Field(default="https://www.bis.gov.in/the-bureau/citizens-charter/", description="Citizen's Charter testing turnaround timelines")

# --- Health Check ---
class HealthResponse(BaseModel):
    status: str
    version: str
    chroma_db_status: str
    total_indexed_chunks: int
    total_standards_catalog: int = 741
    ollama_status: str
    embedding_model: str
    sarvam_multilingual_status: str = Field(default="standby", description="Sarvam multilingual API integration status")

# --- Speech-to-Text & Text-to-Speech Models ---
class SpeechTranscribeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    transcript: str = Field(description="Transcribed user speech text")
    detected_language: Optional[str] = Field(default=None, description="BCP-47 detected language code (e.g. hi-IN)")
    language_confidence: Optional[float] = Field(default=None, description="Confidence of language detection (0.0 to 1.0)")
    provider: str = Field(default="sarvam", description="STT provider used: 'sarvam' or 'browser'")

class SpeechSynthesizeRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    text: str = Field(min_length=1, max_length=4000, description="Text to synthesize into natural speech")
    language: LanguageType = Field(default=LanguageType.EN, description="Language for speech synthesis (10 Indian languages)")
    persona: Optional[PersonaType] = Field(default=PersonaType.GENERAL, description="Persona context for voice pacing and tone")
    speaker: Optional[str] = Field(default="meera", description="Sarvam voice speaker identity (e.g. meera, arvind)")

class SpeechSynthesizeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    audio_base64: Optional[str] = Field(default=None, description="Base64-encoded audio WAV buffer")
    audio_format: str = Field(default="audio/wav", description="MIME format of audio")
    provider: str = Field(default="sarvam", description="Speech provider: 'sarvam' or 'browser_fallback'")
    fallback_to_browser: bool = Field(default=False, description="True if frontend should use window.speechSynthesis fallback")
    spoken_text: str = Field(description="Cleaned, speakable prose text without markdown symbols or raw URLs")
    language_applied: str = Field(default="en-IN", description="BCP-47 language applied to audio synthesis")

# --- Dynamic Chat Translation Models ---
class TranslateMessageItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(description="Message unique identifier")
    role: str = Field(description="Message role ('user' or 'assistant')")
    content: str = Field(description="Message text content")

class TranslateMessagesRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    messages: List[TranslateMessageItem] = Field(description="List of messages to translate")
    target_language: LanguageType = Field(description="Target Indian language code")
    source_language: Optional[LanguageType] = Field(default=LanguageType.EN, description="Source language code if known")

class TranslateMessagesResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    messages: List[TranslateMessageItem] = Field(description="List of translated messages")
    target_language: LanguageType = Field(description="Target language applied")
    translated_count: int = Field(description="Total number of messages translated")
