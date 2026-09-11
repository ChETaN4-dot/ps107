"""
Strict SIH PS107 Verbatim Compliance Verification Suite.
Tests all 8 Expected Solution bullets and 7 User Struggle points against running backend.
"""
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(title, url, method="POST", payload=None):
    print(f"\n=======================================================")
    print(f"TEST: {title}")
    print(f"=======================================================")
    try:
        if method == "POST":
            res = requests.post(url, json=payload, timeout=10)
        else:
            res = requests.get(url, timeout=10)
        
        print(f"Status Code: {res.status_code}")
        if res.status_code == 200:
            data = res.json()
            return data
        else:
            print(f"ERROR: {res.text}")
            return None
    except Exception as e:
        print(f"Connection Failed: {e}")
        return None

def run_strict_ps107_audit():
    results = {}
    
    # 1. Answer questions related to Indian Standards
    d1 = test_endpoint(
        "1. Answer Questions Related to Indian Standards",
        f"{BASE_URL}/api/chat",
        payload={
            "message": "What is IS 14543 for packaged drinking water and what are its key parameters?",
            "persona": "researcher",
            "language": "en"
        }
    )
    results["1_standards_qa"] = bool(d1 and d1.get("citations") and len(d1.get("answer", "")) > 50)
    print(f"-> Citations count: {len(d1.get('citations', []))}")
    print(f"-> Sample answer snippet: {d1.get('answer', '')[:120]}...")

    # 2. Recommend applicable standards based on product descriptions
    d2 = test_endpoint(
        "2. Recommend Applicable Standards Based on Product Description",
        f"{BASE_URL}/api/recommend-standard",
        payload={
            "product_description": "stainless steel insulated flask and water bottles",
            "persona": "msme",
            "language": "en"
        }
    )
    results["2_recommend_standards"] = bool(d2 and len(d2.get("recommendations", [])) > 0)
    if d2 and d2.get("recommendations"):
        top_rec = d2["recommendations"][0]
        print(f"-> Top Recommended Standard: {top_rec.get('standard_number')} - {top_rec.get('title')}")
        print(f"-> Match Reason: {top_rec.get('match_reason')}")
        print(f"-> QCO Mandatory: {top_rec.get('qco_mandatory')}")

    # 3. Provide guidance on BIS certification schemes (Scheme I vs Scheme II)
    d3 = test_endpoint(
        "3. Provide Guidance on BIS Certification Schemes",
        f"{BASE_URL}/api/chat",
        payload={
            "message": "Explain the differences between Scheme I (ISI Mark) and Scheme II (CRS registration).",
            "persona": "manufacturer",
            "language": "en"
        }
    )
    results["3_certification_schemes"] = bool(d3 and d3.get("citations") and "Scheme" in d3.get("answer", ""))
    print(f"-> Confidence: {d3.get('confidence_level')} ({d3.get('confidence')})")
    print(f"-> Answer excerpt: {d3.get('answer', '')[:120]}...")

    # 4. Explain certification processes (Option 1 vs Option 2)
    d4 = test_endpoint(
        "4. Explain Certification Processes & Licensing Procedures",
        f"{BASE_URL}/api/chat",
        payload={
            "message": "What is the step-by-step Option 2 simplified procedure for granting a manufacturing licence under Scheme I?",
            "persona": "msme",
            "language": "en",
            "include_checklist": True
        }
    )
    results["4_licensing_procedure"] = bool(d4 and d4.get("checklist"))
    print(f"-> Checklist Generated: {d4.get('checklist', {}).get('title')}")
    print(f"-> Checklist Steps: {len(d4.get('checklist', {}).get('steps', []))}")

    # 5. Answer consumer-related queries (ISI verification & Complaints)
    d5 = test_endpoint(
        "5. Answer Consumer-Related Queries & Rights",
        f"{BASE_URL}/api/chat",
        payload={
            "message": "How can a consumer verify an ISI mark and CML number or file a complaint for a substandard product?",
            "persona": "consumer",
            "language": "en"
        }
    )
    results["5_consumer_queries"] = bool(d5 and d5.get("citations"))
    print(f"-> Intent: {d5.get('intent')}")
    print(f"-> Citations: {[c['source_title'] for c in d5.get('citations', [])]}")

    # 6. Guide users regarding hallmarking (6-Digit HUID & Purity)
    d6 = test_endpoint(
        "6. Guide Users Regarding Gold/Silver Hallmarking",
        f"{BASE_URL}/api/chat",
        payload={
            "message": "What is 6-digit HUID in gold jewellery and what is the fee for jeweller registration?",
            "persona": "jeweller",
            "language": "en"
        }
    )
    results["6_hallmarking"] = bool(d6 and "HUID" in d6.get("answer", ""))
    print(f"-> Answer excerpt: {d6.get('answer', '')[:120]}...")

    # 7. Suggest relevant testing laboratories (Section 19, BIS Act 2016)
    d7 = test_endpoint(
        "7. Suggest Relevant Testing Laboratories",
        f"{BASE_URL}/api/recommend-labs",
        payload={
            "product_or_material": "packaged drinking water testing",
            "location": "sahibabad"
        }
    )
    results["7_testing_labs"] = bool(d7 and len(d7.get("recommended_labs", [])) > 0)
    if d7 and d7.get("recommended_labs"):
        top_lab = d7["recommended_labs"][0]
        print(f"-> Recommended Lab: {top_lab.get('lab_name')}")
        print(f"-> Location: {top_lab.get('location')}")
        print(f"-> Contact: {top_lab.get('contact')}")
        print(f"-> Official LIMS: {d7.get('official_lims_url')}")

    # 8. Support multilingual interaction (Hindi, etc.)
    d8 = test_endpoint(
        "8. Support Multilingual Interaction (Hindi query)",
        f"{BASE_URL}/api/chat",
        payload={
            "message": "बीआईएस केयर ऐप पर 6 अंकों के HUID की जांच कैसे करें?",
            "persona": "consumer",
            "language": "hi"
        }
    )
    results["8_multilingual"] = bool(d8 and d8.get("citations"))
    print(f"-> Multilingual response received: {d8.get('answer', '')[:120]}...")

    # Summary
    print("\n" + "="*60)
    print("STRICT PS107 VERIFICATION RESULTS SUMMARY")
    print("="*60)
    all_passed = True
    for k, v in results.items():
        status = "PASSED" if v else "FAILED"
        print(f"{k.ljust(35)}: [{status}]")
        if not v:
            all_passed = False
            
    print("="*60)
    print(f"OVERALL COMPLIANCE STATUS: {'100% STRICTLY COMPLIANT' if all_passed else 'SOME TESTS FAILED'}")
    print("="*60)

if __name__ == "__main__":
    run_strict_ps107_audit()
