"""
Dedicated Standard Recommendation Service for BIS Saathi (PS107).
Recommends applicable Indian Standards based on free-form product descriptions,
material attributes, and industrial sectors.
Grounded exclusively in verified Indian Standards metadata.
Provides explainable match reasons with zero hallucinated standards and high false-positive rejection.
"""

import csv
import re
import logging
from typing import List, Dict, Any, Set
from pathlib import Path

from app.config import settings
from app.models.schemas import (
    StandardRecommendation, StandardRecommendationRequest,
    StandardRecommendationResponse, ConfidenceLevel
)
from app.services.standard_lifecycle import lifecycle_service

logger = logging.getLogger(__name__)

# Common stop words and generic low-information terms with near-zero IDF value
STOP_WORDS: Set[str] = {
    "i", "me", "my", "we", "our", "you", "your", "a", "an", "the", "and", "or", "but",
    "if", "because", "as", "what", "which", "this", "that", "these", "those", "am", "is",
    "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
    "does", "did", "doing", "would", "should", "could", "ought", "im", "manufacture",
    "manufacturing", "manufacturer", "produce", "producer", "producing", "sell", "selling",
    "make", "making", "import", "importing", "for", "with", "about", "against", "between",
    "into", "through", "during", "before", "after", "above", "below", "to", "from", "up",
    "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once",
    "want", "need", "get", "know", "tell", "show", "help", "like", "look", "good", "best"
}

# Generic words that frequently cause false positive lexical overlaps in standard titles
GENERIC_LOW_IDF_TERMS: Set[str] = {
    "service", "services", "product", "products", "item", "items", "standard", "standards",
    "quality", "equipment", "type", "part", "general", "similar", "used", "requirements",
    "specification", "specifications", "scheme", "compliance", "purposes", "grade", "grades",
    "class", "application", "applications", "material", "materials", "system", "systems"
}

# Digital / Non-physical software terms that indicate out-of-scope queries for product certification
SOFTWARE_DIGITAL_KEYWORDS: Set[str] = {
    "software", "saas", "cloud", "app", "application", "computing", "website",
    "web", "portal", "platform", "ai", "algorithm", "database", "api", "microservice",
    "devops", "hosting", "data center", "mobile application", "mobile app", "source code",
    "frontend", "backend", "web app", "erp", "crm"
}

# Canonical BIS standards for essential statutory products (ensures complete coverage for national schemes)
CANONICAL_STATUTORY_STANDARDS: List[Dict[str, Any]] = [
    {
        "is_number": "IS 1417 : 2016",
        "title": "Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking - Specification",
        "year": "2016",
        "status": "Mandatory (QCO)",
        "category": "Hallmarking & Precious Metals",
        "keywords": "gold, jewellery, jewelry, ornaments, hallmarking, huid, purity, 22k, 18k, 14k, 24k, karat, fineness, bullion, artefacts",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://www.bis.gov.in/hallmarking-overview/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 2112 : 2014",
        "title": "Silver and Silver Alloys, Jewellery/Artefacts - Fineness and Marking - Specification",
        "year": "2014",
        "status": "Voluntary",
        "category": "Hallmarking & Precious Metals",
        "keywords": "silver, jewellery, jewelry, ornaments, hallmarking, purity, 999, 925, 900, 800, fineness, artefacts",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://www.bis.gov.in/hallmarking-overview/",
        "qco_mandatory": False
    },
    {
        "is_number": "IS 2347 : 2017",
        "title": "Domestic Pressure Cookers - Specification",
        "year": "2017",
        "status": "Mandatory (QCO)",
        "category": "Mechanical & Consumer Durables",
        "keywords": "pressure cooker, cookers, domestic cooker, aluminum cooker, stainless steel cooker, kitchenware",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 374 : 2019",
        "title": "Electric Ceiling Type Fans and Regulators - Specification",
        "year": "2019",
        "status": "Mandatory (QCO)",
        "category": "Electrical & Energy Efficiency",
        "keywords": "ceiling fan, electric fan, fans, table fan, pedestal fan, air circulation, household appliances",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 694 : 2010",
        "title": "PVC Insulated Cables for Working Voltages up to and Including 1100 V - Specification",
        "year": "2010",
        "status": "Mandatory (QCO)",
        "category": "Electrical & Power Cables",
        "keywords": "cables, electrical cables, pvc cables, copper wire, domestic wiring, flexible cables, power cables",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 4151 : 2015",
        "title": "Protective Helmets for Two Wheeler Riders - Specification",
        "year": "2015",
        "status": "Mandatory (QCO)",
        "category": "Personal Protective Equipment",
        "keywords": "helmet, helmets, motorcycle helmet, two wheeler helmet, safety helmet, head protection",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 15820 : 2009",
        "title": "General Requirements for Competence of Assaying and Hallmarking Centres",
        "year": "2009",
        "status": "Mandatory (QCO)",
        "category": "Hallmarking & Precious Metals",
        "keywords": "assaying centre, hallmarking centre, ahc, assaying competence, gold testing, xrf, fire assay",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://www.bis.gov.in/hallmarking-overview/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 9873 (Part 1) : 2019",
        "title": "Safety of Toys - Part 1: Safety Aspects Related to Mechanical and Physical Properties",
        "year": "2019",
        "status": "Mandatory (QCO)",
        "category": "Consumer Durables & Toys",
        "keywords": "toy, toys, children toys, mechanical toys, electric toys, plastic toys, safety of toys",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 269 : 2015",
        "title": "Ordinary Portland Cement - Specification (Sixth Revision)",
        "year": "2015",
        "status": "Mandatory (QCO)",
        "category": "Civil & Construction Materials",
        "keywords": "cement, opc, ordinary portland cement, 33 grade, 43 grade, 53 grade, concrete, construction",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 1489 (Part 1) : 2015",
        "title": "Portland Pozzolana Cement - Specification - Part 1: Fly Ash Based",
        "year": "2015",
        "status": "Mandatory (QCO)",
        "category": "Civil & Construction Materials",
        "keywords": "cement, ppc, portland pozzolana cement, fly ash cement, blended cement, construction",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 17526 : 2021",
        "title": "Domestic Stainless Steel Vacuum Flask / Insulated Flask - Specification",
        "year": "2021",
        "status": "Mandatory (QCO)",
        "category": "Cookware & Utensils",
        "keywords": "vacuum flask, vacuum bottle, stainless steel vacuum bottle, insulated bottle, thermal bottle",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://standards.bis.gov.in",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 17803 : 2022",
        "title": "Potable Water Bottles - Specification",
        "year": "2022",
        "status": "Mandatory (QCO)",
        "category": "Cookware & Utensils",
        "keywords": "potable water bottle, drinking water bottle, reusable water bottle, plastic bottle, steel bottle",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://standards.bis.gov.in",
        "qco_mandatory": True
    },
    {
        "is_number": "IS 1418 : 2004",
        "title": "Assaying of Gold in Gold Bullion, Gold Alloys and Gold Jewellery/Artefacts by Cupellation (Fire Assay) Method",
        "year": "2004",
        "status": "Current",
        "category": "Hallmarking & Precious Metals",
        "keywords": "gold assaying, fire assay, cupellation, gold purity testing, gold bullion, fineness testing, ahc testing",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://standards.bis.gov.in",
        "qco_mandatory": False
    },
    {
        "is_number": "IS 2790 : 2017",
        "title": "Manufacture of 14, 18, 20, 22, 23 and 24 Carat Gold Alloys, Jewellery/Artefacts - Fineness and Marking - Specification",
        "year": "2017",
        "status": "Current",
        "category": "Hallmarking & Precious Metals",
        "keywords": "gold alloys, carat gold, 22k manufacture, 18k manufacture, 14k manufacture, gold jewellery manufacturing, alloying",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://standards.bis.gov.in",
        "qco_mandatory": False
    },
    {
        "is_number": "IS 3095 : 1999",
        "title": "Gold Solders for Use in Manufacture of Jewellery",
        "year": "1999",
        "status": "Current",
        "category": "Hallmarking & Precious Metals",
        "keywords": "gold solder, soldering, jewellery solders, brazing gold, solder alloy, joining gold",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://standards.bis.gov.in",
        "qco_mandatory": False
    },
    {
        "is_number": "IS 2113 : 2014",
        "title": "Assaying of Silver in Silver Alloys and Jewellery/Artefacts - Method of Test",
        "year": "2014",
        "status": "Current",
        "category": "Hallmarking & Precious Metals",
        "keywords": "silver assaying, silver purity testing, silver test method, fineness of silver, volumetric method, silver alloy",
        "related_service": "Hallmarking Scheme",
        "source_url": "https://standards.bis.gov.in",
        "qco_mandatory": False
    },
    {
        "is_number": "IS 14543 : 2004",
        "title": "Packaged Drinking Water (Other than Packaged Natural Mineral Water) - Specification",
        "year": "2004",
        "status": "Mandatory (QCO)",
        "category": "Food & Agriculture",
        "keywords": "packaged drinking water, bottled drinking water, mineral water plant, purified water",
        "related_service": "Product Certification (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        "qco_mandatory": True
    }
]

# Controlled synonym mapping for precise domain routing
CONTROLLED_SYNONYMS: Dict[str, List[str]] = {
    "gold": ["gold", "jewellery", "jewelry", "is 1417", "is 1418", "is 2790", "is 3095", "hallmark", "huid", "carat", "alloy"],
    "jewellery": ["jewellery", "jewelry", "gold", "silver", "is 1417", "is 2112", "ornaments", "artefacts"],
    "jewelry": ["jewellery", "jewelry", "gold", "silver", "is 1417", "is 2112", "ornaments", "artefacts"],
    "ring": ["ring", "jewellery", "jewelry", "gold", "is 1417", "ornament", "artefact"],
    "ornament": ["ornament", "ornaments", "jewellery", "jewelry", "gold", "is 1417", "is 2112", "artefact"],
    "artefact": ["artefact", "artefacts", "jewellery", "jewelry", "gold", "is 1417", "is 2112", "ornament"],
    "solder": ["solder", "solders", "soldering", "gold solders", "is 3095", "brazing"],
    "soldering": ["solder", "solders", "soldering", "gold solders", "is 3095", "brazing"],
    "purity": ["purity", "assaying", "cupellation", "fire assay", "fineness", "is 1418", "is 1417", "is 2113"],
    "testing": ["testing", "assaying", "cupellation", "fire assay", "test method", "is 1418", "is 2113"],
    "assaying": ["assaying centre", "hallmarking centre", "ahc", "is 15820", "is 1418", "is 2113", "cupellation", "fire assay"],
    "cupellation": ["cupellation", "fire assay", "assaying", "is 1418", "gold testing", "purity testing"],
    "alloy": ["alloy", "alloys", "gold alloy", "carat", "is 2790", "is 1417"],
    "silver": ["silver", "jewellery", "jewelry", "is 2112", "is 2113", "hallmark", "purity"],
    "ahc": ["assaying centre", "hallmarking centre", "ahc", "is 15820"],
    "bottle": ["bottle", "bottles", "potable", "flask", "is 17803", "is 17526", "water"],
    "flask": ["flask", "bottle", "is 17526", "is 17803", "stainless", "vacuum"],
    "drinking": ["drinking", "potable", "water", "bottle", "is 17803", "is 14543"],
    "metal": ["metal", "stainless", "steel", "aluminum", "copper", "potable"],
    "container": ["container", "bottle", "bottles", "flask", "potable"],
    "cooker": ["cooker", "cookers", "pressure cooker", "is 2347", "is 7466"],
    "fan": ["fan", "fans", "ceiling fan", "is 374", "is 302"],
    "cable": ["cable", "cables", "pvc insulated", "wire", "wires", "is 694", "is 1554"],
    "wire": ["wire", "wires", "cable", "cables", "copper", "conductor"],
    "helmet": ["helmet", "helmets", "is 2925", "is 4151", "safety"],
    "toy": ["toy", "toys", "is 9873", "is 15644", "children"],
    "toys": ["toy", "toys", "is 9873", "is 15644", "children"],
    "cement": ["cement", "portland", "is 12330", "is 12600", "is 269", "is 1489", "opc", "ppc"],
    "opc": ["cement", "portland", "is 269", "ordinary portland cement"],
    "ppc": ["cement", "portland", "is 1489", "portland pozzolana cement"],
    "water": ["water", "drinking water", "packaged drinking", "potable", "is 14543", "is 13428", "is 17803"]
}

class StandardRecommender:
    """Ranks and recommends verified Indian Standards with high precision and false-positive filtering."""

    def __init__(self, csv_path: str = settings.STANDARDS_FILE_PATH):
        self.csv_path = csv_path
        self.standards: List[Dict[str, Any]] = []
        self._load_standards()

    def _load_standards(self):
        """Loads verified standards from CSV and merges statutory core standards."""
        path = Path(self.csv_path)
        loaded_numbers = set()

        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        is_num = row.get("is_number", "").strip()
                        title = row.get("title", "").strip()
                        if not is_num or not title:
                            continue

                        status = row.get("status", "Current").strip()
                        qco = "Mandatory" in status or "QCO" in status
                        category = row.get("category", "General").strip()
                        keywords = row.get("keywords", "").strip()
                        related_service = row.get("related_service", "Product Certification (Scheme I)").strip()
                        source_url = row.get("source_url", "https://standards.bis.gov.in").strip()
                        year = row.get("year", "").strip()

                        search_corpus = f"{is_num} {title} {keywords} {category} {related_service}".lower()
                        loaded_numbers.add(is_num)

                        self.standards.append({
                            "is_number": is_num,
                            "title": title,
                            "year": year,
                            "status": status,
                            "category": category,
                            "keywords": keywords,
                            "related_service": related_service,
                            "source_url": source_url,
                            "qco_mandatory": qco,
                            "search_corpus": search_corpus
                        })
            except Exception as e:
                logger.error(f"Error loading standards CSV: {e}", exc_info=True)

        # Add canonical statutory standards if not already present
        for canon in CANONICAL_STATUTORY_STANDARDS:
            if canon["is_number"] not in loaded_numbers:
                canon_corpus = f"{canon['is_number']} {canon['title']} {canon['keywords']} {canon['category']} {canon['related_service']}".lower()
                self.standards.append({
                    **canon,
                    "search_corpus": canon_corpus
                })

        logger.info(f"Loaded {len(self.standards)} verified Indian Standards into recommendation engine.")

    def _extract_tokens(self, text: str) -> List[str]:
        """Extracts cleaned lexical tokens excluding stop words."""
        cleaned = re.sub(r"[^\w\s-]", " ", text.lower())
        tokens = [t.strip() for t in cleaned.split() if len(t.strip()) > 2 and t.strip() not in STOP_WORDS]
        return tokens

    def _is_software_query(self, tokens: List[str], raw_text: str) -> bool:
        """Determines if query is purely digital software/SaaS with no physical product entity."""
        software_hits = [t for t in tokens if t in SOFTWARE_DIGITAL_KEYWORDS]
        # Check if hardware terms exist
        hardware_terms = {"fan", "cable", "bottle", "cement", "steel", "toy", "helmet", "cooker", "gold", "water", "wire", "meter", "transformer", "module", "handset", "device"}
        has_hardware = any(t in hardware_terms for t in tokens)
        
        if software_hits and not has_hardware:
            # Overwhelmingly software/cloud
            return True
        return False

    def _generate_match_reason(
        self,
        std: Dict[str, Any],
        matched_tokens: List[str],
        query: str
    ) -> str:
        """Constructs an explainable, factual justification for the recommendation."""
        title = std["title"]
        is_num = std["is_number"]
        qco = std["qco_mandatory"]

        reasons = []
        if matched_tokens:
            top_tokens = ", ".join(f"'{t}'" for t in matched_tokens[:3])
            reasons.append(f"Matches product description keywords: {top_tokens}.")

        if qco:
            reasons.append("Subject to mandatory Quality Control Order (QCO) requiring compulsory BIS certification/mark prior to sale.")
        else:
            reasons.append(f"Operated under BIS {std['related_service']}.")

        return f"{' '.join(reasons)} Applicable standard: {is_num} - {title}."

    def recommend(
        self,
        request: StandardRecommendationRequest,
        top_k: int = 5
    ) -> StandardRecommendationResponse:
        """
        Processes product description with precision scoring, synonym expansion, and false-positive filtering.
        """
        raw_desc = request.product_description.strip()
        tokens = self._extract_tokens(raw_desc)
        desc_lower = raw_desc.lower()

        if request.industry:
            tokens.extend(self._extract_tokens(request.industry))
        if request.product_category:
            tokens.extend(self._extract_tokens(request.product_category))
        if request.keywords:
            for kw in request.keywords:
                tokens.extend(self._extract_tokens(kw))

        tokens = list(dict.fromkeys(tokens))

        # Check for Pure Software / SaaS / Cloud Query (False Positive Rejection)
        if self._is_software_query(tokens, desc_lower):
            return StandardRecommendationResponse(
                product_description=raw_desc,
                recommendations=[],
                total_candidates=0,
                confidence_level=ConfidenceLevel.LOW,
                informational_disclaimer=(
                    f"No compulsory Indian Standard applies to pure digital software/cloud services ('{raw_desc}'). "
                    "Bureau of Indian Standards (BIS) conformity assessment and Scheme I/II certification primarily govern "
                    "physical manufactured products, raw materials, electrical equipment, and precious metal hallmarking."
                ),
                official_portal_url="https://standards.bis.gov.in"
            )

        # Expand tokens with controlled domain synonyms
        expanded_search_tokens = set(tokens)
        for t in tokens:
            if t in CONTROLLED_SYNONYMS:
                expanded_search_tokens.update(CONTROLLED_SYNONYMS[t])

        # Filter out generic low-IDF terms for core scoring
        domain_tokens = [t for t in tokens if t not in GENERIC_LOW_IDF_TERMS]
        if not domain_tokens:
            domain_tokens = tokens  # fallback if all were generic

        scored_candidates = []
        for std in self.standards:
            corpus = std["search_corpus"]
            title_lower = std["title"].lower()
            is_num_lower = std["is_number"].lower()
            std_keywords = std["keywords"].lower()

            # 1. Exact phrase match in title or keywords
            phrase_bonus = 0.0
            if len(desc_lower) > 4 and (desc_lower in title_lower or desc_lower in std_keywords):
                phrase_bonus = 0.50
            elif any(len(phrase) > 4 and (phrase in title_lower or phrase in std_keywords) for phrase in desc_lower.split(" and ")):
                phrase_bonus = 0.35

            # 2. Token match on domain tokens (non-generic)
            matched_domain_tokens = [t for t in domain_tokens if t in corpus]
            token_score = len(matched_domain_tokens) / max(1, len(domain_tokens))

            # 3. Title domain hits
            title_hits = [t for t in domain_tokens if t in title_lower or t in is_num_lower]
            title_score = len(title_hits) / max(1, len(domain_tokens))

            # 4. Synonym / Expanded match bonus
            synonym_hits = [t for t in expanded_search_tokens if t in corpus]
            synonym_bonus = min(0.30, len(synonym_hits) * 0.10)

            # 5. Mandatory QCO bonus
            qco_bonus = 0.10 if std["qco_mandatory"] else 0.0

            # 6. Negative mismatch penalty:
            # If standard is physical lighting/battery and query contains zero lighting/battery terms, penalize
            mismatch_penalty = 0.0
            if "lighting" in title_lower or "luminaires" in title_lower:
                if not any(k in desc_lower for k in ["light", "lamp", "led", "lighting", "luminaire", "bulb"]):
                    mismatch_penalty = 0.40

            total_score = (
                (0.35 * title_score) +
                (0.25 * token_score) +
                (0.20 * phrase_bonus) +
                (0.15 * synonym_bonus) +
                (0.05 * qco_bonus) -
                mismatch_penalty
            )

            # Only retain candidates with genuine domain evidence
            has_domain_evidence = bool(matched_domain_tokens or title_hits or (synonym_hits and len(synonym_hits) >= 2) or phrase_bonus > 0)
            if total_score >= 0.22 and has_domain_evidence:
                display_tokens = title_hits if title_hits else (matched_domain_tokens if matched_domain_tokens else list(synonym_hits)[:3])
                scored_candidates.append({
                    "standard": std,
                    "score": min(0.98, max(0.0, total_score)),
                    "matched_tokens": display_tokens
                })

        # Sort descending by score
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)

        # Prepare raw candidate dicts for Standard Lifecycle + Applicability Verification Layer
        raw_candidates_for_verification = []
        for item in scored_candidates:
            std = item["standard"]
            score = round(item["score"], 3)
            match_reason = self._generate_match_reason(std, item["matched_tokens"], raw_desc)
            raw_candidates_for_verification.append({
                "is_number": std["is_number"],
                "standard_number": std["is_number"],
                "title": std["title"],
                "year": std["year"] if std["year"] else None,
                "status": std["status"],
                "category": std["category"],
                "match_reason": match_reason,
                "confidence": score,
                "source_url": std["source_url"],
                "qco_mandatory": std["qco_mandatory"]
            })

        # GATING: Standard Lifecycle & Applicability Verification
        persona_str = request.persona.value if hasattr(request.persona, "value") else str(request.persona) if request.persona else None
        verified_current, historical_standards = lifecycle_service.filter_and_verify_candidates(
            raw_candidates=raw_candidates_for_verification,
            query=raw_desc,
            persona=persona_str,
            include_historical=getattr(request, "include_historical", False)
        )

        recommendations: List[StandardRecommendation] = verified_current[:top_k]

        # Confidence level assignment based on verified current top match
        if recommendations and recommendations[0].confidence >= 0.55:
            conf_level = ConfidenceLevel.HIGH
        elif recommendations and recommendations[0].confidence >= 0.30:
            conf_level = ConfidenceLevel.MEDIUM
        else:
            conf_level = ConfidenceLevel.LOW

        return StandardRecommendationResponse(
            product_description=raw_desc,
            recommendations=recommendations,
            historical_standards=historical_standards[:top_k] if getattr(request, "include_historical", False) else [],
            total_candidates=len(scored_candidates),
            confidence_level=conf_level,
            informational_disclaimer=(
                "Recommendations are verified against official BIS publications and standards metadata. "
                "Presence in the catalogue does not imply current applicability. Only standards verified as CURRENT or "
                "CURRENT_WITH_AMENDMENTS are presented as applicable recommendations. "
                "Manufacturers must confirm exact product scope on standards.bis.gov.in."
            ),
            official_portal_url="https://standards.bis.gov.in"
        )

_recommender_instance = None

def get_standard_recommender() -> StandardRecommender:
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = StandardRecommender()
    return _recommender_instance
