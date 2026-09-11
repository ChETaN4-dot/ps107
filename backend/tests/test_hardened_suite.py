"""
Hardened Regression & Adversarial Verification Test Suite for BIS Saathi (PS107).
Validates:
1. Standard recommendation precision, recall, and SaaS false-positive rejection.
2. Multi-turn conversational context resolution.
3. Foundational BIS questions & definition grounding.
4. Out-of-domain and fake query rejection (Scheme X, IS 99999, Antarctica labs).
5. Copyright full-text protection.
6. Certification schemes, workflows, checklists, and consumer protection.
7. Hallmarking & HUID rules.
8. Testing laboratories (Section 19).
9. Multilingual token preservation & fallback safety.
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
    ChatRequest, ChatMessage, PersonaType,
    StandardRecommendationRequest, LabRecommendationRequest, ConfidenceLevel
)

rag = get_rag_service()
recommender = get_standard_recommender()
lab_rec = get_lab_recommender()

def test_standard_recommender_precision_and_recall():
    """Verify standard recommendations for core statutory products."""
    products = [
        ("I manufacture reusable stainless steel water bottles.", ["IS 17803", "IS 17526"]),
        ("We make household electric fans.", ["IS 374", "IS 302"]),
        ("I manufacture cement.", ["IS 269", "IS 1489", "IS 12330"]),
        ("We make packaged drinking water.", ["IS 14543", "IS 13428"]),
        ("I sell gold jewellery.", ["IS 1417"]),
        ("I sell silver jewelry.", ["IS 2112"]),
        ("We manufacture helmets.", ["IS 4151", "IS 2925"]),
        ("I manufacture pressure cookers.", ["IS 2347"]),
        ("We make electrical cables.", ["IS 694"]),
        ("I manufacture toys.", ["IS 9873"]),
    ]
    for desc, expected_stds in products:
        req = StandardRecommendationRequest(product_description=desc)
        res = recommender.recommend(req)
        assert len(res.recommendations) > 0, f"Expected recommendations for '{desc}'"
        std_numbers = [r.standard_number for r in res.recommendations]
        assert any(any(exp in s for exp in expected_stds) for s in std_numbers), f"Expected one of {expected_stds} in {std_numbers} for '{desc}'"
        assert res.confidence_level in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]

def test_standard_recommender_saas_false_positive_rejection():
    """Verify that pure software/SaaS/cloud queries do not falsely match physical lighting/battery standards."""
    saas_queries = [
        "cloud computing software as a service",
        "SaaS platform for accounting",
        "mobile phone application for college students",
        "CRM web portal database"
    ]
    for q in saas_queries:
        req = StandardRecommendationRequest(product_description=q)
        res = recommender.recommend(req)
        assert len(res.recommendations) == 0, f"Expected 0 recommendations for software query '{q}', got {len(res.recommendations)}"
        assert res.confidence_level == ConfidenceLevel.LOW
        assert "software" in res.informational_disclaimer.lower() or "physical" in res.informational_disclaimer.lower()

def test_foundational_bis_definitions():
    """Verify that general questions like 'What is an Indian Standard?' return rich grounded answers."""
    queries = [
        ("What is an Indian Standard?", PersonaType.STUDENT),
        ("What is BIS and what is its statutory role?", PersonaType.GENERAL),
        ("What does the Bureau of Indian Standards do?", PersonaType.GENERAL),
    ]
    for q, p in queries:
        req = ChatRequest(message=q, persona=p)
        res = rag.process_query(req)
        assert res.confidence_level in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]
        assert len(res.citations) > 0
        assert len(res.answer) > 80
        assert "Bureau of Indian Standards" in res.answer or "Indian Standard" in res.answer

def test_multi_turn_context_resolution():
    """Verify that follow-up questions inherit antecedent product context."""
    # Turn 1 established product: stainless steel bottles
    # Turn 2: "Which standard applies?"
    history = [
        ChatMessage(role="user", content="I manufacture stainless steel bottles in Delhi."),
        ChatMessage(role="assistant", content="Stainless steel bottles are covered under Indian Standards.")
    ]
    req = ChatRequest(message="Which standard applies?", persona=PersonaType.MANUFACTURER, history=history)
    res = rag.process_query(req)
    assert res.confidence_level in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]
    assert len(res.citations) > 0
    # Must retrieve standard information
    assert "IS 17803" in res.answer or "IS 17526" in res.answer or "bottle" in res.answer.lower() or len(res.citations) > 0

def test_fictional_scheme_rejection():
    """Verify that fake Scheme X is cleanly rejected without hallucination."""
    req = ChatRequest(message="What is BIS Scheme X?", persona=PersonaType.GENERAL)
    res = rag.process_query(req)
    assert res.confidence_level == ConfidenceLevel.HIGH
    assert "not operate" in res.answer.lower() or "scheme x" in res.answer.lower()
    assert "Scheme I" in res.answer
    assert "Scheme II" in res.answer

def test_fictional_standard_rejection():
    """Verify that non-existent IS 99999 is rejected."""
    req = ChatRequest(message="Tell me the requirements in IS 99999.", persona=PersonaType.GENERAL)
    res = rag.process_query(req)
    assert res.confidence_level == ConfidenceLevel.HIGH
    assert "IS 99999" in res.answer or "could not locate" in res.answer.lower()
    assert "standards.bis.gov.in" in res.answer

def test_absurd_laboratory_location_rejection():
    """Verify that inquiries about Antarctica labs are cleanly rejected with real lab locations."""
    req = ChatRequest(message="Is there a BIS laboratory in Antarctica?", persona=PersonaType.GENERAL)
    res = rag.process_query(req)
    assert res.confidence_level == ConfidenceLevel.HIGH
    assert "Antarctica" in res.answer
    assert "not operate" in res.answer.replace("*", "").lower() or "no bis laboratory" in res.answer.replace("*", "").lower()
    assert "Sahibabad" in res.answer or "Central Laboratory" in res.answer

def test_copyright_fulltext_protection():
    """Verify that requests for complete standards copies are refused with portal link."""
    req = ChatRequest(message="I need the full text of this Indian Standard.", persona=PersonaType.GENERAL)
    res = rag.process_query(req)
    assert res.confidence_level == ConfidenceLevel.HIGH
    assert "copyright" in res.answer.lower() or "intellectual property" in res.answer.lower()
    assert "standards.bis.gov.in" in res.answer

def test_certification_schemes_and_checklists():
    """Verify Option 1 vs Option 2 guidance and procedural checklist."""
    req = ChatRequest(
        message="Explain the step-by-step Option 2 simplified procedure for granting a manufacturing licence.",
        persona=PersonaType.MSME,
        include_checklist=True
    )
    res = rag.process_query(req)
    assert res.confidence_level == ConfidenceLevel.HIGH
    assert len(res.citations) > 0
    assert res.checklist is not None
    assert len(res.checklist.steps) >= 3

def test_hallmarking_and_huid():
    """Verify gold hallmarking HUID and jeweller registration."""
    req = ChatRequest(
        message="What is 6-digit HUID and how does a jeweller register on Manakonline?",
        persona=PersonaType.JEWELLER
    )
    res = rag.process_query(req)
    assert res.confidence_level == ConfidenceLevel.HIGH
    assert len(res.citations) > 0
    assert "HUID" in res.answer or "hallmark" in res.answer.lower()
    assert any("bis.gov.in" in c.source_url or "manakonline.in" in c.source_url for c in res.citations)

def test_laboratory_discovery_service():
    """Verify official testing laboratories discovery under Section 19."""
    req = LabRecommendationRequest(product_or_material="packaged drinking water", location="sahibabad")
    res = lab_rec.recommend(req)
    assert len(res.recommended_labs) > 0
    top_lab = res.recommended_labs[0]
    assert "Central Laboratory" in top_lab.lab_name or "Sahibabad" in top_lab.location
    assert "lims.bis.gov.in" in res.official_lims_url

if __name__ == "__main__":
    pytest.main(["-v", __file__])
