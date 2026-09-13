import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def audit():
    print("=================================================================")
    print("STARTING STRICT ADVERSARIAL AUDIT FOR BIS SAATHI (PS107)")
    print("=================================================================")
    
    # 1. Health check & inventory
    r_health = requests.get(f"{BASE_URL}/health").json()
    print("\n[INVENTORY - HEALTH]")
    print(json.dumps(r_health, indent=2))
    
    # 2. Requirement 1 - Indian Standards QA & Adversarial Queries
    req1_tests = [
        ("Basic QA", "What is an Indian Standard?", "student", "en"),
        ("Specific IS", "What is IS 17803:2022?", "researcher", "en"),
        ("Technical", "What requirements apply to this standard?", "researcher", "en"),
        ("Natural language", "What standard should I look at for a reusable drinking water bottle?", "consumer", "en"),
        ("Nonexistent IS", "Tell me the requirements in IS 99999.", "general", "en"),
        ("Fake Scheme", "What is BIS Scheme X?", "general", "en"),
        ("Unavailable Clause", "Give me clause 7.3 of IS 17803.", "general", "en"),
        ("Absurd Query", "Is there a BIS laboratory in Antarctica?", "general", "en"),
        ("Copyright Request", "I need the full text of this Indian Standard.", "general", "en"),
    ]
    
    print("\n[REQUIREMENT 1 - STANDARDS QA & ADVERSARIAL]")
    for title, msg, p, lang in req1_tests:
        t0 = time.time()
        res = requests.post(f"{BASE_URL}/api/chat", json={"message": msg, "persona": p, "language": lang}, timeout=10).json()
        dt = round((time.time() - t0)*1000, 1)
        print(f"\n--- {title}: '{msg}' [{p}] --- (Latency: {dt}ms)")
        print(f"Intent: {res.get('intent')} | Confidence: {res.get('confidence')} ({res.get('confidence_level')})")
        print(f"Citations: {len(res.get('citations', []))}")
        if res.get('citations'):
            print(f"Top citation: {res['citations'][0].get('source_title')} -> {res['citations'][0].get('source_url')}")
        print(f"Answer snippet: {res.get('answer', '')[:250]}...")

    # 3. Requirement 2 - Recommend standards (10 diverse products + semantic variations + negative cases)
    req2_tests = [
        "I manufacture reusable stainless steel water bottles.",
        "We make household electric fans.",
        "I manufacture cement.",
        "We make packaged drinking water.",
        "I sell gold jewellery.",
        "We manufacture helmets.",
        "I manufacture pressure cookers.",
        "We make electrical cables.",
        "I manufacture toys.",
        "deliberately vague metal item",
        "steel bottle",
        "metal drinking bottle",
        "reusable water container made from stainless steel",
        "mobile phone application for college students",  # negative
        "cloud computing software as a service"           # negative
    ]
    
    print("\n[REQUIREMENT 2 - RECOMMEND APPLICABLE STANDARDS]")
    for prod in req2_tests:
        t0 = time.time()
        res = requests.post(f"{BASE_URL}/api/recommend-standard", json={"product_description": prod, "persona": "manufacturer", "language": "en"}, timeout=10).json()
        dt = round((time.time() - t0)*1000, 1)
        recs = res.get("recommendations", [])
        print(f"\nQuery: '{prod}' -> Found {len(recs)} recs (Total Candidates: {res.get('total_candidates')}) in {dt}ms")
        if recs:
            for r in recs[:2]:
                print(f"  * {r.get('standard_number')}: {r.get('title')} [Score: {r.get('confidence')}, QCO: {r.get('qco_mandatory')}]")
                print(f"    Reason: {r.get('match_reason')}")
        else:
            print(f"  * No recommendations found.")

    # 4. Requirement 7 - Laboratory recommendation
    print("\n[REQUIREMENT 7 - TESTING LABORATORIES]")
    lab_queries = [
        ("packaged drinking water", "sahibabad"),
        ("cement", "mumbai"),
        ("structural steel", "kolkata"),
        ("electronics", "bengaluru"),
        ("pressure cooker", "mohali"),
        ("submersible pump", "chennai"),
        ("food grains", "patna"),
        ("chemical testing", "guwahati"),
        ("nonexistent product xyz", "antarctica")
    ]
    for prod, loc in lab_queries:
        res = requests.post(f"{BASE_URL}/api/recommend-labs", json={"product_or_material": prod, "location": loc}, timeout=10).json()
        labs = res.get("recommended_labs", [])
        print(f"Product: '{prod}' | Loc: '{loc}' -> {len(labs)} labs returned")
        if labs:
            print(f"  Top Lab: {labs[0].get('lab_name')} ({labs[0].get('location')}) - Type: {labs[0].get('lab_type')}")

    # 5. Requirement 8 - Multilingual Tests across 10 languages
    print("\n[REQUIREMENT 8 - MULTILINGUAL AUDIT (10 LANGUAGES)]")
    langs = ["en", "hi", "mr", "bn", "gu", "ta", "te", "kn", "ml", "pa"]
    test_msg = "What is the procedure for jeweller hallmarking registration?"
    for l in langs:
        res = requests.post(f"{BASE_URL}/api/chat", json={"message": test_msg, "persona": "jeweller", "language": l}, timeout=10).json()
        print(f"Lang: {l.upper()} -> Intent: {res.get('intent')} | Notice: {res.get('multilingual_notice')}")
        print(f"  Answer start: {res.get('answer', '')[:100]}...")

    # 6. Conversational Context Multi-turn test
    print("\n[PHASE 5 - MULTI-TURN CONVERSATION TEST]")
    # We will test whether the API preserves session or if it is stateless
    t1 = requests.post(f"{BASE_URL}/api/chat", json={"message": "I manufacture stainless steel bottles.", "persona": "manufacturer", "language": "en"}).json()
    print("Turn 1:", t1.get("answer")[:100])
    t2 = requests.post(f"{BASE_URL}/api/chat", json={"message": "Which standard applies?", "persona": "manufacturer", "language": "en"}).json()
    print("Turn 2:", t2.get("answer")[:100])

if __name__ == "__main__":
    audit()
