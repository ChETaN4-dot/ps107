"""
Automated validation test for BIS Saathi FastAPI backend.
Tests:
- Root endpoint GET /
- Health endpoint GET /health
- Conversational chat endpoint POST /api/v1/chat with citations
- PS108 Scope Guardrail
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)

    print("=" * 60)
    print("1. Testing Root Endpoint: GET /")
    res_root = client.get("/")
    assert res_root.status_code == 200, f"Expected 200, got {res_root.status_code}"
    print("GET / Response:", res_root.json())
    print("PASSED!\n")

    print("=" * 60)
    print("2. Testing Health Endpoint: GET /health")
    res_health = client.get("/health")
    assert res_health.status_code == 200, f"Expected 200, got {res_health.status_code}"
    health_data = res_health.json()
    print("GET /health Response:", health_data)
    assert health_data["status"] == "healthy"
    assert health_data["chroma_db_status"] == "connected"
    assert health_data["total_indexed_chunks"] > 0
    print(f"PASSED! (Indexed chunks: {health_data['total_indexed_chunks']})\n")

    print("=" * 60)
    print("3. Testing Chat Endpoint: POST /api/v1/chat (MSME Option 2)")
    payload = {
        "message": "How do I apply for BIS certification under Option 2 (simplified procedure)?",
        "persona": "msme",
        "language": "en",
        "include_checklist": True
    }
    res_chat = client.post("/api/v1/chat", json=payload)
    assert res_chat.status_code == 200, f"Expected 200, got {res_chat.status_code}"
    chat_data = res_chat.json()
    print("Intent Detected:", chat_data["intent"])
    print("Confidence Level:", chat_data["confidence_level"], f"({chat_data['confidence']})")
    print(f"Verified Citations Returned: {len(chat_data['citations'])}")
    for idx, c in enumerate(chat_data["citations"]):
        print(f"  [{idx+1}] {c['source_title']} -> {c['source_url']}")
    if chat_data["checklist"]:
        ch = chat_data["checklist"]
        print(f"Checklist Returned: {ch['title']} ({len(ch['steps'])} steps)")
    assert len(chat_data["citations"]) > 0
    assert chat_data["confidence"] >= 0.65
    print("PASSED!\n")

    print("=" * 60)
    print("4. Testing Tender / Procurement Scope Guardrail")
    tender_payload = {
        "message": "Please review this procurement bid for GeM portal tender",
        "persona": "general",
        "language": "en"
    }
    res_tender = client.post("/api/v1/chat", json=tender_payload)
    assert res_tender.status_code == 200
    tender_data = res_tender.json()
    print("Tender Query Intent:", tender_data["intent"])
    assert tender_data["intent"] == "out_of_scope"
    assert "Scope" in tender_data["answer"] or "procurement" in tender_data["answer"].lower()
    print("Tender Guardrail Response Confirmed:")
    print(tender_data["answer"][:180] + "...")
    print("PASSED!\n")

    print("=" * 60)
    print("5. Testing Alternative Chat Route: POST /api/chat with Suggested Actions")
    chat2_payload = {
        "message": "What is 6-digit HUID and how to verify gold jewellery?",
        "persona": "consumer",
        "language": "en"
    }
    res_chat2 = client.post("/api/chat", json=chat2_payload)
    assert res_chat2.status_code == 200, f"Expected 200, got {res_chat2.status_code}"
    chat2_data = res_chat2.json()
    print("Detected Intent:", chat2_data["intent"])
    print("Confidence Level:", chat2_data["confidence_level"], f"({chat2_data['confidence']})")
    print(f"Citations count: {len(chat2_data['citations'])}")
    if chat2_data["suggested_actions"]:
        print(f"Official Navigation Action: {chat2_data['suggested_actions'][0]['title']} -> {chat2_data['suggested_actions'][0]['url']}")
    assert len(chat2_data["citations"]) > 0
    assert "suggested_actions" in chat2_data
    print("PASSED!\n")

    print("=" * 60)
    print("6. Testing Standard Recommendation Endpoint: POST /api/v1/recommend-standard")
    std_payload = {
        "product_description": "I manufacture stainless steel water bottles and flasks",
        "persona": "msme",
        "language": "en"
    }
    res_std = client.post("/api/v1/recommend-standard", json=std_payload)
    assert res_std.status_code == 200, f"Expected 200, got {res_std.status_code}"
    std_data = res_std.json()
    print("Total Candidates Analyzed:", std_data["total_candidates"])
    print("Recommendations Returned:", len(std_data["recommendations"]))
    assert len(std_data["recommendations"]) > 0
    top_std = std_data["recommendations"][0]
    print(f"Top Recommendation: {top_std['standard_number']} - {top_std['title']}")
    print(f"Match Reason: {top_std['match_reason']}")
    assert top_std["standard_number"].startswith("IS")
    print("PASSED!\n")

    print("=" * 60)
    print("7. Testing Laboratory Discovery Endpoint: POST /api/v1/recommend-labs")
    lab_payload = {
        "product_or_material": "packaged drinking water",
        "location": "Sahibabad"
    }
    res_lab = client.post("/api/v1/recommend-labs", json=lab_payload)
    assert res_lab.status_code == 200, f"Expected 200, got {res_lab.status_code}"
    lab_data = res_lab.json()
    print("Recommended Labs Returned:", len(lab_data["recommended_labs"]))
    assert len(lab_data["recommended_labs"]) > 0
    top_lab = lab_data["recommended_labs"][0]
    print(f"Top Lab: {top_lab['lab_name']} ({top_lab['location']})")
    assert "bis.gov.in" in top_lab["official_url"]
    print("PASSED!\n")

    print("=" * 60)
    print("8. Testing Dual Mode Chat: POST /api/v1/chat with mode='find_my_standard'")
    mode_payload = {
        "message": "stainless steel water bottle",
        "persona": "msme",
        "language": "en",
        "mode": "find_my_standard"
    }
    res_mode = client.post("/api/v1/chat", json=mode_payload)
    assert res_mode.status_code == 200, f"Expected 200, got {res_mode.status_code}"
    mode_data = res_mode.json()
    print("Mode Applied:", mode_data["mode_applied"])
    assert mode_data["mode_applied"] == "find_my_standard"
    assert "standard_recommendations" in mode_data
    assert len(mode_data["standard_recommendations"]) > 0
    print("PASSED!\n")

    print("=" * 60)
    print("ALL BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
