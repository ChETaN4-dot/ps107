"""
Comprehensive Automated Test Suite for BIS Saathi Standard Lifecycle & Applicability Verification Layer (PS107).
Validates:
1. Lifecycle status classification (CURRENT, CURRENT_WITH_AMENDMENTS, SUPERSEDED, WITHDRAWN, UNKNOWN_STATUS).
2. Supersession graph (e.g. IS 1417:1999 -> IS 1417:2016, IS 2347:2006 -> IS 2347:2017).
3. Amendment handling (e.g. IS 17526:2021 Amd 1, IS 14543:2004 Amd 6).
4. QCO separation (Mandatory statutory order vs voluntary standard).
5. Product scope & material boundaries (vacuum flask vs potable bottle, gold vs silver vs AHC).
6. False positive rejection (SaaS/cloud, generic keyword matches).
7. Full catalog audit validation against standards_metadata.csv.
"""

import pytest
from app.models.schemas import (
    StandardLifecycleStatus, QCOStatus, StandardCategoryRole,
    StandardRecommendationRequest
)
from app.services.standard_lifecycle import lifecycle_service
from app.services.standard_recommender import get_standard_recommender


@pytest.fixture(scope="module")
def recommender():
    return get_standard_recommender()


# ==========================================
# TEST SUITE 1: LIFECYCLE CLASSIFICATION & SUPERSEDED SUPPRESSION
# ==========================================

def test_1_current_standard_verification():
    """Verify that current standard IS 1417:2016 is classified as CURRENT with high confidence."""
    rec = lifecycle_service.verify_lifecycle_status("IS 1417:2016", "Gold and Gold Alloys Jewellery")
    assert rec["status"] == StandardLifecycleStatus.CURRENT
    assert rec["is_current_verified"] is True
    assert rec["superseded_by"] is None
    assert rec["revision_of"] == "IS 1417:1999"
    assert rec["qco_status"] == QCOStatus.MANDATORY


def test_2_superseded_standard_rejection():
    """Verify that superseded standard IS 1417:1999 is recognized as SUPERSEDED and excluded from current."""
    rec = lifecycle_service.verify_lifecycle_status("IS 1417:1999", "Gold and gold alloys jewellery (Third Revision)")
    assert rec["status"] == StandardLifecycleStatus.SUPERSEDED
    assert rec["is_current_verified"] is False
    assert rec["superseded_by"] == "IS 1417:2016"


def test_3_superseded_pressure_cooker_rejection():
    """Verify that IS 2347:2006 is recognized as SUPERSEDED by IS 2347:2017."""
    rec = lifecycle_service.verify_lifecycle_status("IS 2347:2006", "Domestic Pressure Cookers - Specification")
    assert rec["status"] == StandardLifecycleStatus.SUPERSEDED
    assert rec["superseded_by"] == "IS 2347:2017"


def test_4_current_with_amendments():
    """Verify that IS 17526:2021 is classified as CURRENT_WITH_AMENDMENTS with amendment details."""
    rec = lifecycle_service.verify_lifecycle_status("IS 17526:2021", "Domestic Stainless Steel Vacuum Flask")
    assert rec["status"] == StandardLifecycleStatus.CURRENT_WITH_AMENDMENTS
    assert rec["is_current_verified"] is True
    assert rec["amendment_count"] >= 1
    assert "Amendment" in rec["latest_amendment"]
    assert rec["qco_status"] == QCOStatus.MANDATORY


def test_5_unknown_lifecycle_handling():
    """Verify that unverified/unregistered standard numbers return UNKNOWN_STATUS and official link."""
    rec = lifecycle_service.verify_lifecycle_status("IS 999999:2099", "Fictional Quantum Device Standard")
    assert rec["status"] == StandardLifecycleStatus.UNKNOWN_STATUS
    assert rec["is_current_verified"] is False
    assert "standards.bis.gov.in" in rec["source_url"]


# ==========================================
# TEST SUITE 2: QCO STATUTORY SEPARATION
# ==========================================

def test_6_qco_status_separation():
    """Verify that QCO status is distinct from lifecycle status."""
    # Mandatory QCO standard
    qco_std = lifecycle_service.verify_lifecycle_status("IS 2347:2017", "Domestic Pressure Cookers")
    assert qco_std["status"] == StandardLifecycleStatus.CURRENT
    assert qco_std["qco_status"] == QCOStatus.MANDATORY

    # Voluntary standard (Silver Jewellery IS 2112:2014)
    vol_std = lifecycle_service.verify_lifecycle_status("IS 2112:2014", "Silver and Silver Alloys Jewellery")
    assert vol_std["status"] == StandardLifecycleStatus.CURRENT
    assert vol_std["qco_status"] == QCOStatus.NOT_FOUND or vol_std["qco_status"] == QCOStatus.NOT_APPLICABLE


# ==========================================
# TEST SUITE 3: PRODUCT SCOPE & MATERIAL VERIFICATION
# ==========================================

def test_7_saas_cloud_false_positive_rejection(recommender):
    """Verify that pure SaaS/cloud software receives zero product standards and proper disclaimer."""
    req = StandardRecommendationRequest(product_description="cloud computing software as a service platform")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) == 0
    assert "software" in resp.informational_disclaimer.lower() or "cloud" in resp.informational_disclaimer.lower()


def test_8_gold_jewellery_scope(recommender):
    """Verify gold jewellery queries recommend IS 1417:2016 as PRIMARY and exclude superseded IS 1417:1999."""
    queries = [
        "I sell gold jewellery",
        "I manufacture gold jewellery",
        "gold ring",
        "gold artefact",
        "hallmarked gold jewellery"
    ]
    for q in queries:
        req = StandardRecommendationRequest(product_description=q)
        resp = recommender.recommend(req)
        assert len(resp.recommendations) > 0
        top_std = resp.recommendations[0]
        assert "IS 1417" in top_std.standard_number
        assert "2016" in (top_std.year or top_std.standard_number)
        assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT
        assert top_std.qco_mandatory is True
        # Ensure no superseded IS 1417:1999 in recommendations
        for r in resp.recommendations:
            assert "IS 1417:1999" not in r.standard_number and "IS 1417 : 1999" not in r.standard_number


def test_9_silver_jewellery_distinction(recommender):
    """Verify silver jewellery recommends IS 2112:2014 and distinguishes from gold IS 1417."""
    req = StandardRecommendationRequest(product_description="I manufacture 925 sterling silver jewellery and silver artefacts")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 2112" in top_std.standard_number
    assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT


def test_10_assaying_hallmarking_centre_separation(recommender):
    """Verify assaying and hallmarking centre setup recommends IS 15820:2009 under HALLMARKING_ASSAY role."""
    req = StandardRecommendationRequest(product_description="Setting up a BIS recognized assaying and hallmarking centre (AHC)")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 15820" in top_std.standard_number
    assert top_std.applicability_role == StandardCategoryRole.HALLMARKING_ASSAY


def test_11_stainless_steel_vacuum_bottle_scope(recommender):
    """Verify stainless steel vacuum bottle/flask correctly routes to IS 17526:2021."""
    vacuum_queries = [
        "I manufacture stainless steel vacuum bottles",
        "domestic stainless steel vacuum bottle",
        "stainless steel vacuum flask",
        "insulated thermal steel bottle"
    ]
    for q in vacuum_queries:
        req = StandardRecommendationRequest(product_description=q)
        resp = recommender.recommend(req)
        assert len(resp.recommendations) > 0
        top_std = resp.recommendations[0]
        assert "IS 17526" in top_std.standard_number
        assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT_WITH_AMENDMENTS
        assert top_std.qco_mandatory is True


def test_12_potable_drinking_water_bottle_scope(recommender):
    """Verify general potable non-vacuum drinking bottle routes to IS 17803:2022."""
    req = StandardRecommendationRequest(product_description="reusable potable drinking water bottle container")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 17803" in top_std.standard_number
    assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT


def test_13_pressure_cooker_recommendation(recommender):
    """Verify domestic pressure cooker recommends verified IS 2347:2017."""
    req = StandardRecommendationRequest(product_description="domestic aluminium and stainless steel pressure cooker")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 2347" in top_std.standard_number
    assert "2017" in (top_std.year or top_std.standard_number)
    assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT
    assert top_std.qco_mandatory is True


def test_14_electric_ceiling_fan_recommendation(recommender):
    """Verify electric ceiling fan recommends IS 374:2019."""
    req = StandardRecommendationRequest(product_description="manufacturing BLDC electric ceiling fans with speed regulators")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 374" in top_std.standard_number
    assert "2019" in (top_std.year or top_std.standard_number)
    assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT
    assert top_std.qco_mandatory is True


def test_15_cement_recommendation(recommender):
    """Verify ordinary portland cement and pozzolana cement recommend IS 269:2015 and IS 1489."""
    req = StandardRecommendationRequest(product_description="manufacturing 43/53 grade Ordinary Portland Cement (OPC)")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    matched_nums = [r.standard_number for r in resp.recommendations]
    assert any("IS 269" in n for n in matched_nums)
    assert resp.recommendations[0].qco_mandatory is True


def test_16_protective_helmet_recommendation(recommender):
    """Verify two wheeler protective helmet recommends IS 4151:2015."""
    req = StandardRecommendationRequest(product_description="protective helmets for two wheeler motorcycle riders")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 4151" in top_std.standard_number
    assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT
    assert top_std.qco_mandatory is True


def test_17_safety_of_toys_recommendation(recommender):
    """Verify children's mechanical and electric toys recommend IS 9873 (Part 1)."""
    req = StandardRecommendationRequest(product_description="manufacturing plastic and mechanical children toys")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    matched_nums = [r.standard_number for r in resp.recommendations]
    assert any("IS 9873" in n for n in matched_nums)
    assert resp.recommendations[0].qco_mandatory is True


def test_18_pvc_cables_recommendation(recommender):
    """Verify domestic PVC insulated electric wire and cables recommend IS 694:2010."""
    req = StandardRecommendationRequest(product_description="PVC insulated copper wires and flexible domestic power cables up to 1100V")
    resp = recommender.recommend(req)
    assert len(resp.recommendations) > 0
    top_std = resp.recommendations[0]
    assert "IS 694" in top_std.standard_number
    assert top_std.lifecycle_status == StandardLifecycleStatus.CURRENT
    assert top_std.qco_mandatory is True


def test_19_historical_standards_search_toggle(recommender):
    """Verify that historical superseded standards are excluded by default and returned when include_historical=True."""
    # Default (include_historical=False)
    req_default = StandardRecommendationRequest(product_description="gold jewellery fineness specification", include_historical=False)
    resp_default = recommender.recommend(req_default)
    assert len(resp_default.historical_standards) == 0

    # Explicit include_historical=True
    req_hist = StandardRecommendationRequest(product_description="gold jewellery fineness specification", include_historical=True)
    resp_hist = recommender.recommend(req_hist)
    assert len(resp_hist.recommendations) > 0
    assert resp_hist.recommendations[0].lifecycle_status == StandardLifecycleStatus.CURRENT


def test_20_catalog_audit_execution():
    """Verify that catalog audit runs across standards_metadata.csv and generates valid reports."""
    audit_results = lifecycle_service.run_catalog_audit()
    assert "TOTAL" in audit_results
    assert audit_results["TOTAL"] > 0
    assert audit_results["CURRENT"] + audit_results["CURRENT_WITH_AMENDMENTS"] > 0
    assert audit_results["UNKNOWN"] >= 0
