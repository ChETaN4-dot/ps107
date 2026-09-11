"""
Generate 25-30 High-Quality Golden Evaluation Questions for BIS Saathi (PS107).
Covers all core personas:
- MSME & Manufacturer (Product Certification Schemes I & II, concessions, testing)
- Jeweller (Hallmarking registration, HUID, fees)
- Consumer (Purity verification, BIS Care App, complaints, compensation)
- Testing Labs (LRS recognition, timelines under Citizen's Charter)
- Standards Q&A (Standard identification, mandatory vs voluntary)
"""

import os
import csv

GOLDEN_QUESTIONS_PATH = "data/processed/golden_questions.csv"

QUESTIONS = [
    # --- MSME / Manufacturer (Product Certification) ---
    {
        "id": "GQ-001",
        "question": "How do I apply for BIS product certification under Scheme I (ISI mark)?",
        "persona": "MSME, manufacturer",
        "expected_category": "product_certification",
        "reference_source_url": "https://www.bis.gov.in/product-certification/product-certification-process/?lang=en",
        "intent_description": "General application procedure under normal vs simplified option"
    },
    {
        "id": "GQ-002",
        "question": "What is the difference between Option 1 (Normal Procedure) and Option 2 (Simplified Procedure) for grant of licence?",
        "persona": "MSME, manufacturer",
        "expected_category": "product_certification",
        "reference_source_url": "https://www.bis.gov.in/product-certification/product-certification-process/?lang=en",
        "intent_description": "Timeline and pre-requisite differences between Option 1 and Option 2"
    },
    {
        "id": "GQ-003",
        "question": "Are there any special fee concessions or discounts available for Micro, Small and Medium Enterprises (MSMEs) or women entrepreneurs?",
        "persona": "MSME",
        "expected_category": "product_certification",
        "reference_source_url": "https://www.bis.gov.in/product-certification/product-certification-faq/?lang=en",
        "intent_description": "Incentives, rebates and fee concessions for MSME startups"
    },
    {
        "id": "GQ-004",
        "question": "How do I know if my product comes under compulsory BIS certification?",
        "persona": "manufacturer",
        "expected_category": "product_certification",
        "reference_source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
        "intent_description": "Checking Quality Control Orders (QCOs) applicability"
    },
    {
        "id": "GQ-005",
        "question": "What documents and factory testing facilities are required before a BIS inspection officer visits my manufacturing unit?",
        "persona": "MSME, manufacturer",
        "expected_category": "product_certification",
        "reference_source_url": "https://www.bis.gov.in/product-certification/product-certification-process/?lang=en",
        "intent_description": "Factory audit readiness and in-house laboratory equipment requirements"
    },
    {
        "id": "GQ-006",
        "question": "What is the Compulsory Registration Scheme (CRS) for electronic and IT goods under Scheme II?",
        "persona": "manufacturer",
        "expected_category": "product_certification",
        "reference_source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/?lang=en",
        "intent_description": "Self-declaration of conformity based on test reports from BIS recognized labs"
    },

    # --- Jeweller (Hallmarking) ---
    {
        "id": "GQ-007",
        "question": "How can a retail jeweller register with BIS for selling hallmarked gold jewellery?",
        "persona": "jeweller",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/jewellers-registration-scheme/?lang=en",
        "intent_description": "Registration scheme, online application via Manakonline, and zero registration fee policy"
    },
    {
        "id": "GQ-008",
        "question": "Is jeweller registration lifetime or does it require periodic renewal?",
        "persona": "jeweller",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-jewellers/?lang=en",
        "intent_description": "Validity period and renewal guidelines for jeweller registration"
    },
    {
        "id": "GQ-009",
        "question": "What is the fee charged by an Assaying and Hallmarking Centre (AHC) for hallmarking gold jewellery articles?",
        "persona": "jeweller",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en",
        "intent_description": "Statutory hallmarking charges per article plus GST"
    },
    {
        "id": "GQ-010",
        "question": "What happens if a jeweller sells non-hallmarked gold jewellery in mandatory hallmarking districts?",
        "persona": "jeweller",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/mandatory-hallmarking-order/?lang=en",
        "intent_description": "Penalties, search and seizure under the BIS Act 2016"
    },

    # --- Consumer (Hallmarking & ISI Verification) ---
    {
        "id": "GQ-011",
        "question": "What is HUID and how can a consumer verify the authenticity of hallmarked gold jewellery?",
        "persona": "consumer",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en",
        "intent_description": "6-digit alphanumeric Hallmarking Unique ID verification via BIS Care App"
    },
    {
        "id": "GQ-012",
        "question": "What are the three mandatory marks on a gold jewellery piece under current BIS hallmarking rules?",
        "persona": "consumer",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/consumer-protection/?lang=en",
        "intent_description": "BIS logo, purity/fineness mark (e.g. 22K916), and 6-digit HUID"
    },
    {
        "id": "GQ-013",
        "question": "Can a consumer get their old or unhallmarked gold jewellery tested at an Assaying and Hallmarking Centre?",
        "persona": "consumer",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/consumer-protection/?lang=en",
        "intent_description": "Consumer testing facility at recognized AHCs and testing fees"
    },
    {
        "id": "GQ-014",
        "question": "What compensation is a consumer entitled to if hallmarked jewellery is found to have less purity than marked?",
        "persona": "consumer",
        "expected_category": "hallmarking",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/consumer-protection/?lang=en",
        "intent_description": "Compensation formula: two times the shortfall calculated on purity and weight plus testing charges"
    },
    {
        "id": "GQ-015",
        "question": "How do I verify whether an ISI mark on a packaged drinking water bottle or helmet is genuine?",
        "persona": "consumer",
        "expected_category": "consumer",
        "reference_source_url": "https://www.bis.gov.in/consumer-overview/for-consumers-faq/?lang=en",
        "intent_description": "Verification of 7 or 8-digit CML licence number on BIS Care App or website"
    },
    {
        "id": "GQ-016",
        "question": "How can a consumer file an online complaint regarding fake ISI marks, sub-standard products, or misleading quality claims?",
        "persona": "consumer",
        "expected_category": "consumer",
        "reference_source_url": "https://www.bis.gov.in/consumer-overview/online-complaint-registration/?lang=en",
        "intent_description": "Grievance portal, BIS Care App complaint tab, and required evidence submission"
    },
    {
        "id": "GQ-017",
        "question": "What action does BIS take against unauthorized use of the Standard ISI Mark?",
        "persona": "consumer",
        "expected_category": "consumer",
        "reference_source_url": "https://www.bis.gov.in/consumer-overview/consumer-protection/?lang=en",
        "intent_description": "Enforcement raids, seizure, prosecution in court, and imprisonment/fines under BIS Act 2016"
    },

    # --- Labs & Citizen's Charter ---
    {
        "id": "GQ-018",
        "question": "How can an external testing laboratory get recognized under the BIS Laboratory Recognition Scheme (LRS)?",
        "persona": "testing_lab",
        "expected_category": "labs",
        "reference_source_url": "https://www.bis.gov.in/laboratorys/laboratory-faq/?lang=en",
        "intent_description": "LRS Scheme requirements, NABL accreditation prerequisite, and online application"
    },
    {
        "id": "GQ-019",
        "question": "What are the official timelines committed by BIS for processing a licence application under the Citizen's Charter?",
        "persona": "MSME, manufacturer",
        "expected_category": "labs",
        "reference_source_url": "https://www.bis.gov.in/consumer-overview/citizen-charter/?lang=en",
        "intent_description": "Citizen's Charter service delivery norms (e.g. 30 days under simplified procedure)"
    },
    {
        "id": "GQ-020",
        "question": "What is the expected turnaround time for testing factory and market surveillance samples at BIS laboratories?",
        "persona": "testing_lab, manufacturer",
        "expected_category": "labs",
        "reference_source_url": "https://www.bis.gov.in/laboratorys/laboratory-overview/?lang=en",
        "intent_description": "Standard testing turnaround schedules and batch test report issuance"
    },
    {
        "id": "GQ-021",
        "question": "What are the consumer rights and redressal timelines specified under the BIS Citizen's Charter?",
        "persona": "consumer",
        "expected_category": "labs",
        "reference_source_url": "https://www.bis.gov.in/consumer-overview/citizen-charter/?lang=en",
        "intent_description": "Citizen Charter grievance resolution timeline (maximum 90 days with sample testing)"
    },

    # --- Standards Metadata & Identification ---
    {
        "id": "GQ-022",
        "question": "What is Indian Standard IS 1417 and what caratages of gold are officially recognized?",
        "persona": "jeweller, consumer",
        "expected_category": "standards_metadata",
        "reference_source_url": "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en",
        "intent_description": "IS 1417 specification for gold fineness (14K, 18K, 20K, 22K, 23K, 24K)"
    },
    {
        "id": "GQ-023",
        "question": "Is BIS certification mandatory for packaged drinking water, and which Indian Standard applies to it?",
        "persona": "consumer, manufacturer",
        "expected_category": "standards_metadata",
        "reference_source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/?lang=en",
        "intent_description": "Identification of IS 14543 (Packaged Drinking Water) and IS 13428 (Packaged Natural Mineral Water)"
    },
    {
        "id": "GQ-024",
        "question": "Which Indian Standard covers safety requirements for two-wheeler protective helmets?",
        "persona": "consumer, manufacturer",
        "expected_category": "standards_metadata",
        "reference_source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/?lang=en",
        "intent_description": "IS 4151 protective helmets compulsory certification under QCO"
    },
    {
        "id": "GQ-025",
        "question": "Which standard applies to laptop and tablet safety under the Compulsory Registration Scheme (CRS)?",
        "persona": "manufacturer, student",
        "expected_category": "standards_metadata",
        "reference_source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/?lang=en",
        "intent_description": "IS/IEC 62368-1 audio/video and IT equipment safety standard"
    },
    {
        "id": "GQ-026",
        "question": "What is the difference between an Indian Standard (IS) and a Quality Control Order (QCO)?",
        "persona": "MSME, student",
        "expected_category": "standards_metadata",
        "reference_source_url": "https://www.bis.gov.in/standards-overview/?lang=en",
        "intent_description": "Distinction between voluntary technical specifications by BIS and mandatory legal enforcement by Ministries"
    }
]

def generate_golden_questions():
    os.makedirs(os.path.dirname(GOLDEN_QUESTIONS_PATH), exist_ok=True)
    with open(GOLDEN_QUESTIONS_PATH, "w", encoding="utf-8", newline="") as f:
        fieldnames = ["id", "question", "persona", "expected_category", "reference_source_url", "intent_description"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for q in QUESTIONS:
            writer.writerow(q)
    print(f"Successfully generated {len(QUESTIONS)} golden questions in {GOLDEN_QUESTIONS_PATH}")

if __name__ == "__main__":
    generate_golden_questions()
