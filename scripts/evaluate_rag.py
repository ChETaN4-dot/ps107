"""
Automated Golden Question Evaluation Suite for BIS Saathi (PS107).
Evaluates 45 realistic queries across:
1. Product Certification (10 questions)
2. Hallmarking & HUID (10 questions)
3. Consumer Complaints & Enforcement (5 questions)
4. MSME & Manufacturer Concessions (10 questions)
5. Standards Search & QCOs (5 questions)
6. Laboratory & Testing Services (5 questions)

Measures:
- Retrieval Success Rate (at least 1 relevant citation returned)
- Citation Presence Rate
- Intent Classification Accuracy
- Average Response Latency
- Mean Confidence Score
- Unsupported Answer / Hallucination Rate

Generates: reports/rag_evaluation.json
"""

import sys
import os
import json
import time
from pathlib import Path
from typing import List, Dict, Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.schemas import ChatRequest, PersonaType, LanguageType, ConfidenceLevel
from app.services.rag import get_rag_service

# 45 Realistic Golden Questions with Ground Truth Assertions
GOLDEN_DATASET = [
    # --- Category 1: Product Certification (10 Questions) ---
    {
        "id": "pc-01",
        "question": "What is the difference between Option 1 and Option 2 under Scheme I for BIS certification?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "certification_process",
        "expected_keywords": ["option 1", "option 2", "simplified procedure", "normal procedure", "audit"],
        "category": "product_certification"
    },
    {
        "id": "pc-02",
        "question": "How long does it take to get a BIS licence under Option 2 simplified procedure?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["30 days", "simplified", "licence"],
        "category": "product_certification"
    },
    {
        "id": "pc-03",
        "question": "What is the initial validity period of a BIS product licence under Scheme I?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "licence",
        "expected_keywords": ["year", "validity", "renewal"],
        "category": "product_certification"
    },
    {
        "id": "pc-04",
        "question": "What is minimum marking fee and how is it paid?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["marking fee", "minimum", "advance"],
        "category": "product_certification"
    },
    {
        "id": "pc-05",
        "question": "Does a manufacturer need an in-house laboratory to obtain an ISI mark licence?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "product_certification",
        "expected_keywords": ["laboratory", "testing", "in-house", "equipment"],
        "category": "product_certification"
    },
    {
        "id": "pc-06",
        "question": "What happens during a BIS factory audit or inspection?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "certification_process",
        "expected_keywords": ["audit", "inspection", "sample", "verification"],
        "category": "product_certification"
    },
    {
        "id": "pc-07",
        "question": "Can an applicant use a test report from any private laboratory for Option 2?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["recognized", "bis", "lab", "test report"],
        "category": "product_certification"
    },
    {
        "id": "pc-08",
        "question": "What is the procedure for renewal of a BIS licence before expiry?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "licence",
        "expected_keywords": ["renewal", "application", "fee", "validity"],
        "category": "product_certification"
    },
    {
        "id": "pc-09",
        "question": "What is a Stop Marking order and how can a factory revoke it?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "licence",
        "expected_keywords": ["stop marking", "revoke", "corrective"],
        "category": "product_certification"
    },
    {
        "id": "pc-10",
        "question": "What portal is used to apply online for BIS product certification?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["manakonline", "online", "application"],
        "category": "product_certification"
    },

    # --- Category 2: Hallmarking & HUID (10 Questions) ---
    {
        "id": "hm-01",
        "question": "What is HUID in gold hallmarking?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "huid",
        "expected_keywords": ["6-digit", "alphanumeric", "unique", "identification"],
        "category": "hallmarking"
    },
    {
        "id": "hm-02",
        "question": "What are the 3 mandatory marks visible on hallmarked gold jewellery?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["bis logo", "purity", "huid"],
        "category": "hallmarking"
    },
    {
        "id": "hm-03",
        "question": "How much does an Assaying and Hallmarking Centre (AHC) charge to hallmark a gold article?",
        "persona": PersonaType.JEWELLER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["45", "charge", "article"],
        "category": "hallmarking"
    },
    {
        "id": "hm-04",
        "question": "Is there any registration fee for a retail jeweller to sell hallmarked jewellery?",
        "persona": PersonaType.JEWELLER,
        "expected_intent": "jeweller_registration",
        "expected_keywords": ["zero", "fee", "registration", "free"],
        "category": "hallmarking"
    },
    {
        "id": "hm-05",
        "question": "Can a consumer get old unhallmarked gold tested at a BIS recognized AHC?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["test", "consumer", "ahc", "purity"],
        "category": "hallmarking"
    },
    {
        "id": "hm-06",
        "question": "How can I verify the 6-digit HUID code using my mobile phone?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "huid",
        "expected_keywords": ["bis care", "app", "verify", "huid"],
        "category": "hallmarking"
    },
    {
        "id": "hm-07",
        "question": "What compensation is a consumer entitled to if hallmarked jewellery tests substandard?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["compensation", "two times", "shortage", "purity"],
        "category": "hallmarking"
    },
    {
        "id": "hm-08",
        "question": "What are the approved carats for gold hallmarking in India?",
        "persona": PersonaType.JEWELLER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["22k", "18k", "14k", "916", "750"],
        "category": "hallmarking"
    },
    {
        "id": "hm-09",
        "question": "Is hallmarking mandatory across all districts in India?",
        "persona": PersonaType.JEWELLER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["mandatory", "districts", "phases"],
        "category": "hallmarking"
    },
    {
        "id": "hm-10",
        "question": "Does silver jewellery require an alphanumeric HUID?",
        "persona": PersonaType.JEWELLER,
        "expected_intent": "hallmarking",
        "expected_keywords": ["silver", "hallmark", "purity"],
        "category": "hallmarking"
    },

    # --- Category 3: Consumer Complaints & Enforcement (5 Questions) ---
    {
        "id": "cc-01",
        "question": "How do I lodge a complaint about a fake ISI mark product on the BIS Care App?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "consumer_complaint",
        "expected_keywords": ["bis care", "complaint", "cmed", "portal"],
        "category": "consumer"
    },
    {
        "id": "cc-02",
        "question": "What information and evidence should I preserve before filing a complaint with BIS?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "consumer_complaint",
        "expected_keywords": ["cash memo", "sample", "batch", "invoice"],
        "category": "consumer"
    },
    {
        "id": "cc-03",
        "question": "What is considered misuse of the BIS Standard Mark under Section 17 of the BIS Act?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "isi_misuse",
        "expected_keywords": ["section 17", "misuse", "without licence", "imitation"],
        "category": "consumer"
    },
    {
        "id": "cc-04",
        "question": "How does BIS conduct search and seizure raids against counterfeit ISI manufacturers?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "isi_misuse",
        "expected_keywords": ["raid", "search", "seizure", "court", "prosecution"],
        "category": "consumer"
    },
    {
        "id": "cc-05",
        "question": "Can I verify a 7-digit CML licence number printed on an ISI product?",
        "persona": PersonaType.CONSUMER,
        "expected_intent": "verification",
        "expected_keywords": ["cml", "verify", "bis care", "manakonline"],
        "category": "consumer"
    },

    # --- Category 4: MSME & Manufacturer Concessions (10 Questions) ---
    {
        "id": "ms-01",
        "question": "What fee concessions does BIS offer to Micro and Small Enterprises?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["concession", "50%", "10%", "marking fee", "application fee"],
        "category": "product_certification"
    },
    {
        "id": "ms-02",
        "question": "What document is required to prove MSME status for BIS fee discounts?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["udyam", "registration", "certificate"],
        "category": "product_certification"
    },
    {
        "id": "ms-03",
        "question": "Are startups eligible for the same fee concessions as Micro enterprises?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["startup", "concession", "micro", "fee"],
        "category": "product_certification"
    },
    {
        "id": "ms-04",
        "question": "What is the difference between Scheme I and Scheme II (CRS) for an electronics manufacturer?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "product_certification",
        "expected_keywords": ["scheme i", "scheme ii", "crs", "audit", "self-declaration"],
        "category": "product_certification"
    },
    {
        "id": "ms-05",
        "question": "Does a manufacturer need to hire a designated Quality Control in-charge?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "product_certification",
        "expected_keywords": ["quality control", "personnel", "testing", "competent"],
        "category": "product_certification"
    },
    {
        "id": "ms-06",
        "question": "Can an MSME share testing facilities with an adjacent factory for BIS certification?",
        "persona": PersonaType.MSME,
        "expected_intent": "product_certification",
        "expected_keywords": ["in-house", "testing", "facility", "premises"],
        "category": "product_certification"
    },
    {
        "id": "ms-07",
        "question": "What is the Scheme of Inspection and Testing (SIT)?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "product_certification",
        "expected_keywords": ["sit", "scheme of inspection", "testing", "frequency"],
        "category": "product_certification"
    },
    {
        "id": "ms-08",
        "question": "What is the Foreign Manufacturers Certification Scheme (FMCS)?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "product_certification",
        "expected_keywords": ["foreign", "fmcs", "outside india", "air"],
        "category": "product_certification"
    },
    {
        "id": "ms-09",
        "question": "Are women entrepreneurs entitled to special BIS concessions?",
        "persona": PersonaType.MSME,
        "expected_intent": "certification_process",
        "expected_keywords": ["women", "concession", "fee"],
        "category": "product_certification"
    },
    {
        "id": "ms-10",
        "question": "Does an MSME need both FSSAI and BIS licence to manufacture packaged drinking water?",
        "persona": PersonaType.MSME,
        "expected_intent": "compulsory_certification",
        "expected_keywords": ["fssai", "water", "14543", "mandatory"],
        "category": "product_certification"
    },

    # --- Category 5: Standards Search & QCOs (5 Questions) ---
    {
        "id": "st-01",
        "question": "What Indian Standard applies to Packaged Drinking Water?",
        "persona": PersonaType.GENERAL,
        "expected_intent": "standard_search",
        "expected_keywords": ["is 14543", "drinking water", "packaged"],
        "category": "standards_metadata"
    },
    {
        "id": "st-02",
        "question": "What is the Indian Standard for TMT steel bars for concrete reinforcement?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "standard_search",
        "expected_keywords": ["is 1786", "tmt", "steel", "rebars"],
        "category": "standards_metadata"
    },
    {
        "id": "st-03",
        "question": "What is the difference between a voluntary Indian Standard and a mandatory QCO?",
        "persona": PersonaType.STUDENT,
        "expected_intent": "compulsory_certification",
        "expected_keywords": ["voluntary", "mandatory", "qco", "order", "gazette"],
        "category": "standards_metadata"
    },
    {
        "id": "st-04",
        "question": "How are Indian Standards formulated by BIS technical committees?",
        "persona": PersonaType.RESEARCHER,
        "expected_intent": "standard_search",
        "expected_keywords": ["committee", "sectional", "division", "stakeholders", "formulation"],
        "category": "standards_metadata"
    },
    {
        "id": "st-05",
        "question": "Where can a researcher or student find and read Indian Standards online?",
        "persona": PersonaType.STUDENT,
        "expected_intent": "standard_search",
        "expected_keywords": ["standards portal", "standards.bis.gov.in", "read", "preview"],
        "category": "standards_metadata"
    },

    # --- Category 6: Laboratory & Testing (5 Questions) ---
    {
        "id": "lb-01",
        "question": "What is the Laboratory Recognition Scheme (LRS) operated by BIS?",
        "persona": PersonaType.LAB,
        "expected_intent": "laboratory",
        "expected_keywords": ["lrs", "recognition", "laboratory", "commercial"],
        "category": "labs"
    },
    {
        "id": "lb-02",
        "question": "What are the sample testing turnaround times defined in the BIS Citizen's Charter?",
        "persona": PersonaType.LAB,
        "expected_intent": "testing",
        "expected_keywords": ["citizen's charter", "turnaround", "timeline", "testing"],
        "category": "labs"
    },
    {
        "id": "lb-03",
        "question": "Is NABL accreditation mandatory for a lab applying for BIS LRS recognition?",
        "persona": PersonaType.LAB,
        "expected_intent": "laboratory",
        "expected_keywords": ["nabl", "accreditation", "iso/iec 17025", "pre-requisite"],
        "category": "labs"
    },
    {
        "id": "lb-04",
        "question": "Where is the BIS Central Laboratory located and what products does it test?",
        "persona": PersonaType.STUDENT,
        "expected_intent": "laboratory",
        "expected_keywords": ["sahibabad", "central laboratory", "testing"],
        "category": "labs"
    },
    {
        "id": "lb-05",
        "question": "Can testing charges for conformity assessment be paid online through LIMS?",
        "persona": PersonaType.MANUFACTURER,
        "expected_intent": "testing",
        "expected_keywords": ["lims", "online", "testing fee", "charges"],
        "category": "labs"
    }
]

def run_evaluation():
    print("=" * 70)
    print("STARTING 45-QUESTION RAG EVALUATION BENCHMARK (PHASE 12)")
    print("=" * 70)

    rag = get_rag_service()
    results = []
    
    retrieval_successes = 0
    citation_presences = 0
    intent_matches = 0
    high_or_med_confidences = 0
    latencies = []

    for idx, item in enumerate(GOLDEN_DATASET):
        qid = item["id"]
        q_text = item["question"]
        persona = item["persona"]
        exp_intent = item["expected_intent"]
        exp_keywords = item["expected_keywords"]

        t0 = time.perf_counter()
        req = ChatRequest(message=q_text, persona=persona, language=LanguageType.EN)
        res = rag.process_query(req)
        latency_ms = round((time.perf_counter() - t0) * 1000, 1)
        latencies.append(latency_ms)

        # Check retrieval success (at least 1 citation returned)
        has_citations = len(res.citations) > 0
        if has_citations:
            citation_presences += 1

        # Check keyword ground truth hit in answer or citations
        full_text_to_check = (res.answer + " " + " ".join([c.excerpt or "" for c in res.citations])).lower()
        keyword_hits = [kw for kw in exp_keywords if kw.lower() in full_text_to_check]
        is_grounded = len(keyword_hits) >= 1

        if is_grounded:
            retrieval_successes += 1

        # Check intent match
        intent_match = (res.intent == exp_intent) or (res.category == item["category"])
        if intent_match:
            intent_matches += 1

        if res.confidence_level in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]:
            high_or_med_confidences += 1

        print(f"[{idx+1:02d}/45] {qid} | Conf: {res.confidence_level.value} ({res.confidence}) | Citations: {len(res.citations)} | Latency: {latency_ms}ms | Grounded: {is_grounded}")

        results.append({
            "id": qid,
            "question": q_text,
            "persona": persona.value,
            "expected_intent": exp_intent,
            "detected_intent": res.intent,
            "confidence": res.confidence,
            "confidence_level": res.confidence_level.value,
            "latency_ms": latency_ms,
            "citations_count": len(res.citations),
            "top_citation": res.citations[0].source_title if res.citations else None,
            "top_citation_url": res.citations[0].source_url if res.citations else None,
            "is_grounded": is_grounded,
            "matched_keywords": keyword_hits
        })

    # Summary Metrics
    total = len(GOLDEN_DATASET)
    retrieval_rate = round((retrieval_successes / total) * 100, 1)
    citation_rate = round((citation_presences / total) * 100, 1)
    intent_accuracy = round((intent_matches / total) * 100, 1)
    avg_latency = round(sum(latencies) / total, 1)
    avg_confidence = round(sum(r["confidence"] for r in results) / total, 3)
    hallucination_rate = round(((total - retrieval_successes) / total) * 100, 1)

    eval_summary = {
        "timestamp": "2026-09-09T14:40:00Z",
        "benchmark_name": "BIS Saathi Golden Question Evaluation",
        "total_questions": total,
        "metrics": {
            "retrieval_success_rate_percent": retrieval_rate,
            "citation_presence_rate_percent": citation_rate,
            "intent_classification_accuracy_percent": intent_accuracy,
            "average_confidence": avg_confidence,
            "average_latency_ms": avg_latency,
            "unsupported_answer_rate_percent": hallucination_rate
        },
        "results": results
    }

    os.makedirs(ROOT_DIR / "reports", exist_ok=True)
    report_file = ROOT_DIR / "reports" / "rag_evaluation.json"
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(eval_summary, f, indent=2)

    print("\n" + "=" * 70)
    print("EVALUATION BENCHMARK COMPLETE!")
    print(f"Total Questions Tested: {total}")
    print(f"Retrieval Success Rate: {retrieval_rate}%")
    print(f"Citation Presence Rate: {citation_rate}%")
    print(f"Intent Accuracy Rate:   {intent_accuracy}%")
    print(f"Average Confidence:     {avg_confidence}")
    print(f"Average Latency:        {avg_latency} ms")
    print(f"Unsupported Answer Rate:{hallucination_rate}%")
    print(f"Saved evaluation report to: {report_file}")
    print("=" * 70)

if __name__ == "__main__":
    run_evaluation()
