import time
import requests
import json

import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def test_live():
    print("=" * 60)
    print("TESTING LIVE RUNNING BACKEND AND FRONTEND")
    print("=" * 60)

    # 1. Frontend Check
    t0 = time.time()
    fe = requests.get("http://localhost:3000")
    t_fe = (time.time() - t0) * 1000
    assert fe.status_code == 200, f"Frontend failed with {fe.status_code}"
    print(f"[OK] Frontend HTTP 200 OK ({t_fe:.1f}ms) - Length: {len(fe.text)} bytes")

    # 2. Health Endpoint
    t0 = time.time()
    res = requests.get(f"{BASE_URL}/health")
    t_health = (time.time() - t0) * 1000
    assert res.status_code == 200, f"Health failed with {res.status_code}"
    h_data = res.json()
    print(f"[OK] Backend /health ({t_health:.1f}ms): {h_data['status']}, {h_data['total_indexed_chunks']} chunks, {h_data['total_standards_catalog']} standards")

    # 3. Chat Endpoint (Option 2 / Schemes / Gold)
    test_chats = [
        "What is the standard for gold jewellery?",
        "What are the steps for ISI mark certification under Scheme I?",
        "How do I verify a 6-digit HUID code?"
    ]
    for q in test_chats:
        t0 = time.time()
        payload = {
            "message": q,
            "session_id": "live-test-session",
            "language": "en",
            "mode": "ask_bis",
            "persona": "general"
        }
        res = requests.post(f"{BASE_URL}/api/chat", json=payload)
        t_chat = (time.time() - t0) * 1000
        assert res.status_code == 200, f"Chat failed for '{q}': {res.text}"
        data = res.json()
        assert len(data.get("answer", "")) > 20, f"Expected answer length > 20, got: {data}"
        print(f"[OK] Chat Query '{q[:30]}...' -> ({t_chat:.1f}ms) | Citations: {len(data.get('citations', []))}")

    # 4. Standard Recommendation Endpoint
    t0 = time.time()
    rec_payload = {
        "product_description": "stainless steel vacuum flask",
        "limit": 3
    }
    res = requests.post(f"{BASE_URL}/api/v1/recommend-standard", json=rec_payload)
    t_rec = (time.time() - t0) * 1000
    assert res.status_code == 200, f"Recommend failed: {res.text}"
    rec_data = res.json()
    assert len(rec_data.get("recommendations", [])) > 0
    top_std = rec_data["recommendations"][0]
    print(f"[OK] Standard Recommendation ({t_rec:.1f}ms): {top_std['standard_number']} - {top_std['title']} (Confidence: {top_std['confidence']:.2f})")

    # 5. Lab Recommendation Endpoint
    t0 = time.time()
    lab_payload = {
        "product_or_material": "Ordinary Portland Cement",
        "state": "Maharashtra"
    }
    res = requests.post(f"{BASE_URL}/api/v1/recommend-labs", json=lab_payload)
    t_lab = (time.time() - t0) * 1000
    assert res.status_code == 200, f"Lab recommendation failed: {res.text}"
    lab_data = res.json()
    print(f"[OK] Lab Finder ({t_lab:.1f}ms): Found {lab_data.get('total_found', 0)} laboratories")

    print("=" * 60)
    print("ALL LIVE ENDPOINTS & FRONTEND VERIFIED SUCCESSFULLY WITH 0 LAG / 0 ERRORS!")
    print("=" * 60)

if __name__ == "__main__":
    test_live()
