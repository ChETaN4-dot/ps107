"""
Intent Router & Query Classifier for BIS Saathi.
Classifies user queries into 14+ granular regulatory intents and 7 personas.
Enforces statutory scope boundaries (rejecting non-BIS procurement/tender queries).
Provides explainable intent classification with category mapping and confidence scoring.
"""

import re
from typing import Tuple
from app.models.schemas import IntentType, PersonaType

# Keyword patterns for rule-based heuristics

GREETING_PATTERN = re.compile(
    r"^(hi|hello|hey|namaste|pranam|good morning|good afternoon|good evening|who are you|what can you do|what is bis saathi)\b",
    re.IGNORECASE
)

OUT_OF_SCOPE_PATTERN = re.compile(
    r"\b(tender|procurement|bidding|bidder|gem portal|cppp|financial turnover|earnest money|emd|rfp|bid document|boq|eprocure|l1 bidder)\b",
    re.IGNORECASE
)

# 1. Product Certification & Process
CERTIFICATION_PROCESS_PATTERN = re.compile(
    r"\b(option\s*1|option\s*2|simplified procedure|normal procedure|grant of licence|factory audit|factory inspection|pre-grant|application process|how to apply|apply for bis|apply for isi|marking fee|minimum marking fee|concession|50% concession|application fee)\b",
    re.IGNORECASE
)

COMPULSORY_CERTIFICATION_PATTERN = re.compile(
    r"\b(compulsory|mandatory|qco|quality control order|gazette notification|prohibited without isi|mandatory list|crs|compulsory registration scheme|schedule.?ii|notified products)\b",
    re.IGNORECASE
)

PRODUCT_CERTIFICATION_PATTERN = re.compile(
    r"\b(isi mark|product certif|scheme.?i|scheme.?ii|conformity assessment|isi licence|isi license|product licence|eco mark)\b",
    re.IGNORECASE
)

# 2. Hallmarking, HUID & Jewellers
HUID_PATTERN = re.compile(
    r"\b(huid|hallmark unique identification|6-digit|six digit|alphanumeric|laser mark|verify huid|traceability|huid verification)\b",
    re.IGNORECASE
)

JEWELLER_REGISTRATION_PATTERN = re.compile(
    r"\b(jeweller reg|jeweler reg|zero fee|registration fee for jeweller|portal for jeweller|annual turnover|selling hallmarked|manakonline jeweller)\b",
    re.IGNORECASE
)

HALLMARKING_PATTERN = re.compile(
    r"\b(hallmark|hallmarking|gold jewellery|silver jewellery|carat|karat|22k|18k|14k|916|750|585|ahc|assaying|hallmarking centre|hallmarking charge|rs\.?\s*45|rs\.?\s*35)\b",
    re.IGNORECASE
)

# 3. Consumer Protection & Misuse
ISI_MISUSE_PATTERN = re.compile(
    r"\b(fake isi|misuse|spurious|counterfeit|imitation|raid|search and seizure|section 17|punishment|penalty for fake|illegal isi|unauthorized isi)\b",
    re.IGNORECASE
)

CONSUMER_COMPLAINT_PATTERN = re.compile(
    r"\b(consumer|complaint|grievance|bis care app|compensation|substandard|cheated|file a complaint|lodg(e|ing) complaint|cmed|consumer affairs)\b",
    re.IGNORECASE
)

# 4. Foundational BIS & Definitions
FOUNDATIONAL_BIS_PATTERN = re.compile(
    r"\b(what is an? indian standard|what are indian standards|what is bis\b|what does bis do|role of bis|about bis|what is an? is number|what is standardisation|history of bis|bis act|national standards body|what is standard)\b",
    re.IGNORECASE
)

# 5. Standards Search
STANDARD_SEARCH_PATTERN = re.compile(
    r"\b(is\s*\d+|indian standard|find standard|standards formulation|technical committee|sectional committee|buy standard|download standard|standards portal|know your standard|is 14543|is 10500|is 15820|is 1786|is 694)\b",
    re.IGNORECASE
)

# 6. Laboratory & Testing
TESTING_PATTERN = re.compile(
    r"\b(testing turnaround|turnaround time|sample test|test report|testing fee|testing charges|sample testing|test parameters|testing method)\b",
    re.IGNORECASE
)

LABORATORY_PATTERN = re.compile(
    r"\b(laboratory|labs|cl|central laboratory|lrs|lims|laboratory recognition|nabl|testing infrastructure|citizen.?s charter|charter timeline)\b",
    re.IGNORECASE
)

# 6. Licence & Verification
VERIFICATION_PATTERN = re.compile(
    r"\b(verify|verification|check licence|check license|validity|cml number|cml search|how to verify|is this genuine|authentic)\b",
    re.IGNORECASE
)

LICENCE_PATTERN = re.compile(
    r"\b(licence|license|renewal|validity of licence|cml|surveillance|stop marking|cancellation)\b",
    re.IGNORECASE
)

class IntentRouter:
    """Classifies user queries into 14+ regulatory domains and maps appropriate metadata filters."""

    @staticmethod
    def classify(message: str, persona: PersonaType = PersonaType.GENERAL) -> Tuple[IntentType, str, float]:
        """
        Classify query and return:
        (IntentType, target_category_filter, confidence_score)
        """
        text = message.strip()

        # 1. Out of Scope Check (Commercial Procurement / Tenders)
        if OUT_OF_SCOPE_PATTERN.search(text):
            return IntentType.OUT_OF_SCOPE, "out_of_scope", 1.0

        # 2. Greetings & Introductions
        if GREETING_PATTERN.search(text) and len(text.split()) <= 7:
            return IntentType.GREETING, "greeting", 1.0

        # 3. Fine-Grained Domain Intent Heuristics
        # HUID
        if HUID_PATTERN.search(text):
            return IntentType.HUID, "hallmarking", 0.95

        # Jeweller Registration
        if JEWELLER_REGISTRATION_PATTERN.search(text):
            return IntentType.JEWELLER_REGISTRATION, "hallmarking", 0.95

        # General Hallmarking
        if HALLMARKING_PATTERN.search(text):
            return IntentType.HALLMARKING, "hallmarking", 0.90

        # ISI Misuse & Raids
        if ISI_MISUSE_PATTERN.search(text):
            return IntentType.ISI_MISUSE, "consumer", 0.95

        # Consumer Complaints
        if CONSUMER_COMPLAINT_PATTERN.search(text):
            return IntentType.CONSUMER_COMPLAINT, "consumer", 0.90

        # Option 1 / Option 2 / Certification Process
        if CERTIFICATION_PROCESS_PATTERN.search(text):
            return IntentType.CERTIFICATION_PROCESS, "product_certification", 0.95

        # Compulsory / QCO
        if COMPULSORY_CERTIFICATION_PATTERN.search(text):
            return IntentType.COMPULSORY_CERTIFICATION, "product_certification", 0.90

        # Testing & Turnaround
        if TESTING_PATTERN.search(text):
            return IntentType.TESTING, "labs", 0.90

        # Laboratory
        if LABORATORY_PATTERN.search(text):
            return IntentType.LABORATORY, "labs", 0.90

        # Verification
        if VERIFICATION_PATTERN.search(text):
            return IntentType.VERIFICATION, "product_certification", 0.85

        # Licence Management
        if LICENCE_PATTERN.search(text):
            return IntentType.LICENCE, "product_certification", 0.85

        # Foundational BIS Definitions
        if FOUNDATIONAL_BIS_PATTERN.search(text):
            return IntentType.GENERAL_BIS, "general", 0.95

        # Standards Search
        if STANDARD_SEARCH_PATTERN.search(text):
            return IntentType.STANDARD_SEARCH, "standards_metadata", 0.90

        # Product Certification
        if PRODUCT_CERTIFICATION_PATTERN.search(text):
            return IntentType.PRODUCT_CERTIFICATION, "product_certification", 0.85

        # 4. Persona-Conditioned Fallbacks
        if persona in [PersonaType.JEWELLER]:
            return IntentType.HALLMARKING, "hallmarking", 0.70
        elif persona in [PersonaType.CONSUMER]:
            return IntentType.CONSUMER_COMPLAINT, "consumer", 0.70
        elif persona in [PersonaType.MSME, PersonaType.MANUFACTURER]:
            return IntentType.PRODUCT_CERTIFICATION, "product_certification", 0.70
        elif persona in [PersonaType.LAB]:
            return IntentType.LABORATORY, "labs", 0.70
        elif persona in [PersonaType.STUDENT, PersonaType.RESEARCHER]:
            return IntentType.STANDARD_SEARCH, "standards_metadata", 0.70

        # 5. General Fallback
        return IntentType.GENERAL_BIS, "general", 0.60
