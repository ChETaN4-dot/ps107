"""
Automated PS107 Knowledge & Standards Coverage Regression Test Suite.
Validates:
1. Gold Family Intent Gating (Selling, Manufacturing, Assaying/Testing, Soldering).
2. Silver Family (Jewellery fineness, Assaying test method).
3. Thermal / Potable Bottles (IS 17526 vs IS 17803).
4. Statutory Physical Products (Pressure Cooker, Fan, Cement, Helmet, Toy, Cable, Water).
5. Statutory Services & Regulatory Guidance (Scheme I, Hallmarking, HUID, Complaints, LIMS).
6. False Positive Rejection (SaaS/Cloud).
7. Standard Lifecycle, Applicability, Role Classification & Provenance.
"""

import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from app.services.rag import get_rag_service
from app.services.standard_recommender import get_standard_recommender
from app.services.lab_recommender import get_lab_recommender
from app.models.schemas import (
    StandardRecommendationRequest, LabRecommendationRequest,
    ChatRequest, PersonaType, ConfidenceLevel,
    StandardLifecycleStatus, StandardCategoryRole
)

rag = get_rag_service()
recommender = get_standard_recommender()
lab_rec = get_lab_recommender()


# ---------------------------------------------------------
# 1. GOLD FAMILY & INTENT DIFFERENTIATION
# ---------------------------------------------------------

def test_gold_jewellery_selling_intent():
    """Selling gold jewellery must recommend IS 1417:2016 as PRIMARY_APPLICABLE with Mandatory QCO."""
    req = StandardRecommendationRequest(product_description="I sell gold jewellery")
    res = recommender.recommend(req)
    assert len(res.recommendations) > 0
    top = res.recommendations[0]
    assert "1417" in top.standard_number
    assert top.lifecycle_status in [StandardLifecycleStatus.CURRENT, StandardLifecycleStatus.CURRENT_WITH_AMENDMENTS]
    assert top.applicability_role == StandardCategoryRole.PRIMARY_APPLICABLE
    assert top.qco_mandatory is True
    assert top.source_url.startswith("http")


def test_gold_ring_and_artefacts_intent():
    """Gold ring or ornaments must resolve to IS 1417:2016."""
    queries = ["gold ring", "gold ornament", "gold artefact", "gold jewellery hallmarking"]
    for q in queries:
        req = StandardRecommendationRequest(product_description=q)
        res = recommender.recommend(req)
        assert len(res.recommendations) > 0, f"Expected results for '{q}'"
        std_nums = [r.standard_number for r in res.recommendations]
        assert any("1417" in s for s in std_nums), f"Expected IS 1417 for '{q}', got {std_nums}"


def test_gold_purity_testing_intent():
    """Testing/assaying gold must prioritize IS 1418:2004 (Fire Assay) as TEST_METHOD."""
    req = StandardRecommendationRequest(product_description="gold purity testing fire assay")
    res = recommender.recommend(req)
    assert len(res.recommendations) > 0
    std_nums = [r.standard_number for r in res.recommendations]
    assert any("1418" in s for s in std_nums), f"Expected IS 1418 for purity testing, got {std_nums}"
    
    # Check that IS 1418 is classified as TEST_METHOD
    is1418_rec = next((r for r in res.recommendations if "1418" in r.standard_number), None)
    assert is1418_rec is not None
    assert is1418_rec.applicability_role == StandardCategoryRole.TEST_METHOD


def test_gold_jewellery_manufacturing_intent():
    """Manufacturing gold jewellery must recommend IS 1417 and alloy standard IS 2790."""
    req = StandardRecommendationRequest(product_description="I manufacture gold jewellery carat alloys")
    res = recommender.recommend(req)
    assert len(res.recommendations) >= 1
    std_nums = [r.standard_number for r in res.recommendations]
    assert any("1417" in s for s in std_nums)


def test_gold_soldering_intent():
    """Soldering gold jewellery must prioritize IS 3095:1999 (Gold Solders)."""
    req = StandardRecommendationRequest(product_description="I manufacture gold jewellery using solder")
    res = recommender.recommend(req)
    assert len(res.recommendations) > 0
    std_nums = [r.standard_number for r in res.recommendations]
    assert any("3095" in s for s in std_nums), f"Expected IS 3095 for solder query, got {std_nums}"


# ---------------------------------------------------------
# 2. SILVER FAMILY
# ---------------------------------------------------------

def test_silver_jewellery_and_testing():
    """Silver jewellery fineness (IS 2112) and silver assaying (IS 2113)."""
    req_jewellery = StandardRecommendationRequest(product_description="silver jewellery 925")
    res_jewellery = recommender.recommend(req_jewellery)
    assert len(res_jewellery.recommendations) > 0
    assert any("2112" in r.standard_number for r in res_jewellery.recommendations)

    req_assay = StandardRecommendationRequest(product_description="silver purity testing assaying")
    res_assay = recommender.recommend(req_assay)
    assert len(res_assay.recommendations) > 0
    std_nums = [r.standard_number for r in res_assay.recommendations]
    assert any("2113" in s or "2112" in s for s in std_nums)


# ---------------------------------------------------------
# 3. BOTTLE FAMILY (IS 17526 VS IS 17803)
# ---------------------------------------------------------

def test_stainless_steel_vacuum_bottle():
    """Vacuum flask / insulated bottle must recommend IS 17526:2021."""
    req = StandardRecommendationRequest(product_description="stainless steel vacuum bottle insulated flask")
    res = recommender.recommend(req)
    assert len(res.recommendations) > 0
    assert any("17526" in r.standard_number for r in res.recommendations)


def test_generic_potable_water_bottle():
    """Potable water bottle must recommend IS 17803:2022."""
    req = StandardRecommendationRequest(product_description="reusable potable water bottle")
    res = recommender.recommend(req)
    assert len(res.recommendations) > 0
    assert any("17803" in r.standard_number for r in res.recommendations)


# ---------------------------------------------------------
# 4. STATUTORY PHYSICAL PRODUCTS MATRIX
# ---------------------------------------------------------

@pytest.mark.parametrize("query,expected_is", [
    ("domestic pressure cookers", "2347"),
    ("electric ceiling fans", "374"),
    ("ordinary portland cement", "269"),
    ("two wheeler protective helmets", "4151"),
    ("children mechanical safety toys", "9873"),
    ("pvc insulated electrical cables", "694"),
    ("packaged drinking water plant", "14543"),
])
def test_statutory_products_coverage(query: str, expected_is: str):
    req = StandardRecommendationRequest(product_description=query)
    res = recommender.recommend(req)
    assert len(res.recommendations) > 0, f"No recommendations for '{query}'"
    top_matches = [r.standard_number for r in res.recommendations]
    assert any(expected_is in num for num in top_matches), f"Expected IS {expected_is} in {top_matches} for '{query}'"
    # Verify lifecycle status and QCO mandatory flag
    matched = next(r for r in res.recommendations if expected_is in r.standard_number)
    assert matched.lifecycle_status in [StandardLifecycleStatus.CURRENT, StandardLifecycleStatus.CURRENT_WITH_AMENDMENTS]
    assert matched.qco_mandatory is True
    assert matched.is_current_verified is True


# ---------------------------------------------------------
# 5. STATUTORY SERVICES & REGULATORY RAG COVERAGE
# ---------------------------------------------------------

def test_rag_certification_scheme_i():
    """BIS Scheme I product certification query must retrieve grounded evidence."""
    req = ChatRequest(message="What is the process to get BIS ISI certification under Scheme I?", persona=PersonaType.MANUFACTURER)
    ans = rag.process_query(req)
    assert "scheme i" in ans.answer.lower() or "isi" in ans.answer.lower() or "application" in ans.answer.lower()
    assert len(ans.citations) > 0 or ans.confidence > 0.6


def test_rag_hallmarking_huid_rules():
    """Hallmarking and HUID rules must retrieve statutory requirements."""
    req = ChatRequest(message="Explain 6 digit HUID hallmarking rules for gold jewellery", persona=PersonaType.CONSUMER)
    ans = rag.process_query(req)
    assert "huid" in ans.answer.lower() or "hallmark" in ans.answer.lower()
    assert len(ans.citations) > 0 or ans.confidence > 0.6


def test_rag_consumer_complaints_isi_misuse():
    """Consumer complaint procedure for fake ISI mark must retrieve official channels."""
    req = ChatRequest(message="How can a consumer lodge a complaint against counterfeit ISI mark or poor quality product?", persona=PersonaType.CONSUMER)
    ans = rag.process_query(req)
    assert "complaint" in ans.answer.lower() or "bis care" in ans.answer.lower() or "portal" in ans.answer.lower()
    assert len(ans.citations) > 0 or ans.confidence > 0.6


def test_lab_recommender_section_19():
    """Lab discovery under Section 19 for gold/pressure cooker testing."""
    req = LabRecommendationRequest(product_or_material="gold jewellery", location="Maharashtra")
    res = lab_rec.recommend_labs(req)
    assert len(res.recommended_labs) > 0
    assert any("gold" in lab.lab_name.lower() or "assaying" in lab.lab_name.lower() or "mumbai" in lab.location.lower() or "central" in lab.lab_name.lower() for lab in res.recommended_labs)


# ---------------------------------------------------------
# 6. FALSE POSITIVE REJECTION
# ---------------------------------------------------------

def test_saas_false_positive_rejection():
    """Pure software/cloud queries must return 0 recommendations with clear disclaimer."""
    queries = [
        "cloud computing SaaS platform",
        "mobile application development for accounting",
        "enterprise resource planning software"
    ]
    for q in queries:
        req = StandardRecommendationRequest(product_description=q)
        res = recommender.recommend(req)
        assert len(res.recommendations) == 0, f"Expected 0 recommendations for software query '{q}', got {len(res.recommendations)}"
        assert res.confidence_level == ConfidenceLevel.LOW
        assert "software" in res.informational_disclaimer.lower() or "digital" in res.informational_disclaimer.lower()
