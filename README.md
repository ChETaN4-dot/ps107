# BIS Saathi | Bureau of Indian Standards Official AI Assistant

> **National AI Assistant for Indian Standards, Product Certification (ISI Mark), Hallmarking (HUID), Laboratory Discovery (LIMS), and Citizen Guidance**  
> *Developed for Smart India Hackathon (SIH) Problem Statement 107 (PS107)*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black.svg?logo=next.js)](https://nextjs.org/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-0.4.24-orange.svg)](https://www.trychroma.com/)
[![License: Official BIS Data Grounded](https://img.shields.io/badge/Data-Official%20BIS%20Gazette-blue.svg)](https://www.bis.gov.in)
[![Tests Passing](https://img.shields.io/badge/Tests-52%2F52%20Passed-brightgreen.svg)](docs/DECISION_AND_FLOW.md)
[![Status](https://img.shields.io/badge/Compliance%20Status-PASS%20(100%25)-success.svg)](docs/DECISION_AND_FLOW.md)

---

## 1. What BIS Saathi Is

**BIS Saathi** is an institutional-grade, multi-modal, multilingual artificial intelligence assistant designed for the **Bureau of Indian Standards (BIS)**, the National Standards Body of India under the Ministry of Consumer Affairs, Food & Public Distribution.

It provides citizens, micro/small/medium enterprises (MSMEs), jewellers, industrial manufacturers, researchers, and students with an instant, trustworthy, and explainable interface to navigate over 20,000 Indian Standards, statutory conformity assessment schemes, mandatory Quality Control Orders (QCOs), hallmark verification, and testing laboratory discovery.

---

## 2. Why It Exists

Navigating the vast ecosystem of Indian standardisation presents major hurdles for businesses and citizens:
- **MSMEs & Startups** often struggle to identify which specific Indian Standard (`IS`) applies to their manufactured products and whether certification is voluntary or legally mandatory under a Quality Control Order (QCO).
- **Consumers** frequently lack immediate clarity on how to verify 7-digit ISI CML licence numbers or 6-digit alphanumeric Hallmarking Unique Identification (HUID) marks on gold jewellery.
- **Jewellers** require precise guidance on hallmarking fineness standards (`IS 1417:2016` for gold, `IS 2112:2014` for silver) and Assaying & Hallmarking Centre (AHC) competence (`IS 15820:2009`).
- **Manufacturers** need fast access to BIS recognized testing laboratories (LRS) under Section 19 of the *BIS Act, 2016*.

**BIS Saathi eliminates guesswork** by delivering deterministic standard matching, lifecycle supersession gating, multi-turn procedural guidance, and official portal citations.

---

## 3. SIH PS107 Alignment

BIS Saathi directly fulfills every core mandate of **SIH Problem Statement 107**:

| PS107 Requirement | Implementation in BIS Saathi | Status |
| :--- | :--- | :--- |
| **Indian Standards Information** | Hybrid RAG retrieval over *BIS Act 2016*, *Regulations 2018*, and 741 standards metadata. | **PASS** |
| **Standard Recommendation** | Free-form product description to standard recommendation with IDF lexical scoring and synonym expansion. | **PASS** |
| **Standard Lifecycle Gating** | Deterministic gating verifying `CURRENT` vs `SUPERSEDED` vs `WITHDRAWN` standards before recommendation. | **PASS** |
| **Certification Schemes** | End-to-end guidance for ISI Mark (Scheme I), Compulsory Registration (Scheme II), and Foreign Manufacturers (Scheme IV). | **PASS** |
| **Certification Guidance** | Interactive step-by-step procedural checklists detailing factory audits, Manakonline filing, and testing timelines. | **PASS** |
| **Consumer Services** | CML licence number lookup, complaint redressal procedures, and BIS Care App guidance. | **PASS** |
| **Hallmarking & HUID** | Statutory fineness guidance (`IS 1417:2016`, `IS 2112:2014`), 6-digit HUID rules, and jeweller registration workflows. | **PASS** |
| **Laboratory Discovery** | Directory of BIS Central, Regional, Branch, and LRS Recognized laboratories by discipline and location. | **PASS** |
| **Multilingual Interaction** | Full interface and voice support across 10 Indian languages (Hindi, Tamil, Telugu, etc.) and Hinglish. | **PASS** |

*For complete verification evidence and system architecture, see [`docs/DECISION_AND_FLOW.md`](docs/DECISION_AND_FLOW.md).*

---

## 4. Core Features & Operational Modes

BIS Saathi features four purpose-built operational modes accessible from the top navigation bar:

1. **`Ask BIS (Chatbot)`**:
   - Grounded conversational assistant with multi-turn context resolution.
   - Interactive procedural checklists for certification schemes.
   - Collapsible citations with clickable official BIS portal links.
2. **`Find My Standard`**:
   - Precision product-to-standard recommender.
   - Gated by the deterministic **Standard Lifecycle & Applicability Verification Layer**.
   - Clear badges: `✓ Current BIS Standard`, `✓ Current — Amds Included`, `QCO Mandatory`.
3. **`Laboratory Finder (LIMS)`**:
   - Intelligent search across Central, Regional, Branch, and LRS Recognized testing facilities.
   - Filter by discipline (Chemical, Mechanical, Electrical, Microbiology) and geographic state/city.
4. **`Verify Marks & Hallmarking`**:
   - Step-by-step guidance to authenticate ISI marks, CML numbers, and 6-digit alphanumeric HUID codes.

---

## 5. System Architecture

BIS Saathi enforces a strict separation between **deterministic validation gates** and **generative LLM explanations**:

```
USER QUERY
   │
   ▼
[Next.js 16 Civic Frontend] (Warm Ivory / Ink Navy Civic Theme)
   │ HTTP / JSON
   ▼
[FastAPI Backend] (Python 3.14)
   │
   ├──► [Multi-Turn Query Contextualizer] (Resolves follow-ups across turns)
   │
   ├──► [Hybrid Retrieval] (ChromaDB BGE Vector Search + BM25 Sparse Search + RRF)
   │
   ├──► [Standard Lifecycle & Applicability Verification] (DETERMINISTIC GATE)
   │       ├── Checks CURRENT vs SUPERSEDED vs WITHDRAWN
   │       ├── Evaluates QCO Status (Mandatory vs Voluntary)
   │       └── Enforces Product Scope & Material Boundaries
   │
   ├──► [Grounding & Anti-Hallucination Gate] (Confidence scoring + Citation attach)
   │
   ├──► [Generative LLM] (Ollama / Llama 3 - Generates natural language explanations)
   │
   ├──► [Multilingual & Speech Synthesis] (Sarvam AI API + Browser Fallback)
   │
   ▼
USER INTERFACE
```

*For detailed flow diagrams and component boundaries, see [`reports/current_system_architecture.md`](reports/current_system_architecture.md).*

---

## 6. Technology Stack

- **Frontend**: Next.js 16.3.4 (App Router, Turbopack, React 19, Vanilla CSS Design System, Lucide Icons).
- **Backend**: FastAPI 0.110.0, Python 3.14, Uvicorn, Pydantic V2.
- **Vector & Semantic Search**: ChromaDB 0.4.24, `BAAI/bge-small-en-v1.5` embeddings (384 dimensions).
- **Sparse Lexical Search**: `rank_bm25` with domain tokenization and IDF weighting.
- **Generative LLM**: Ollama (Llama 3 / Mistral / Gemma) with strict grounded context injection.
- **Multilingual & Voice**: Sarvam AI API for Indian language translation and TTS + Web Speech API fallback.
- **Testing & Verification**: Pytest 9.1.1, Pytest-AsyncIO.

---

## 7. Standard Lifecycle & Applicability Verification

> **Governing Rule:** *"Presence in the metadata catalogue does NOT imply current applicability."*

Unlike basic vector search tools, BIS Saathi includes a deterministic **Standard Lifecycle Service** (`backend/app/services/standard_lifecycle.py`):
- **Supersession Graph**: Explicitly links superseded standards to their current revisions (e.g. `IS 1417:1999` → `IS 1417:2016`, `IS 2347:2006` → `IS 2347:2017`, `IS 374:1979` → `IS 374:2019`, `IS 1786:1985` → `IS 1786:2008`).
- **Strict Gating**: Superseded and withdrawn standards are cleanly filtered out of current recommendations.
- **QCO Separation**: Evaluates Quality Control Orders as an independent statutory attribute (`MANDATORY` vs `NOT_FOUND` / `NOT_APPLICABLE`).
- **Product Scope Gating**: Accurately distinguishes subtle product boundaries:
  - Stainless Steel Vacuum Flasks (`IS 17526:2021`) vs General Potable Water Bottles (`IS 17803:2022`).
  - Gold Jewellery (`IS 1417:2016`) vs Silver Jewellery (`IS 2112:2014`) vs AHC Competence (`IS 15820:2009`).
  - Pure Software / SaaS queries receive immediate suppression with zero false-positive physical standards.

*For technical specifications, see [`reports/standard_lifecycle_architecture.md`](reports/standard_lifecycle_architecture.md).*

---

## 8. Data Sources & Provenance

BIS Saathi is grounded exclusively in official government publications:
1. *Bureau of Indian Standards Act, 2016* (Act No. 11 of 2016).
2. *BIS (Conformity Assessment) Regulations, 2018*.
3. *BIS (Hallmarking) Regulations, 2018*.
4. Mandatory Quality Control Orders (QCOs) published in the Gazette of India by DPIIT, Ministry of Steel, MeitY, and MoRTH.
5. Official BIS Standards Metadata Catalog (`standards.bis.gov.in`).
6. Official BIS Laboratory Information Management System (`lims.bis.gov.in`).

*For data lineage details, see [`reports/data_provenance.md`](reports/data_provenance.md).*

---

## 9. Copyright & Intellectual Property Protection

To protect the intellectual property rights of the Bureau of Indian Standards:
- BIS Saathi **never reproduces complete verbatim text or proprietary engineering drawings** of Indian Standards.
- Answers summarize statutory scope, fineness grades, marking clauses, and testing methods.
- Every card and recommendation provides a direct link to purchase the official standard from `standards.bis.gov.in`.

---

## 10. Automated Testing & Verification

BIS Saathi includes 31 comprehensive automated tests with a **100% pass rate**:

```bash
# Run complete test suite in backend
python -m pytest tests/test_standard_lifecycle.py tests/test_hardened_suite.py -v

# Run production frontend build
cd ../frontend && npm run build
```

### Verified Test Results:
- **Standard Lifecycle Suite (`test_standard_lifecycle.py`)**: 20/20 PASSED (0.75s)
- **Hardened Regression Suite (`test_hardened_suite.py`)**: 11/11 PASSED (56.6s)
- **Next.js Production Build (`npm run build`)**: 0 errors / 100% valid static generation

*For detailed test logs, see [`reports/testing_and_validation.md`](reports/testing_and_validation.md).*

---

## 11. Known Technical Boundaries

In the interest of institutional honesty:
- **Live Portal Downtime**: If the live BIS portal experiences a temporary network outage, the system preserves cached verified statuses with a transparent notice rather than failing or guessing.
- **Legacy Pre-1980 Standards**: Obscure standards not indexed in the official catalog return `UNKNOWN_STATUS` with direct links to the official portal.
- **Complex Assemblies**: Multi-component assemblies (e.g. electric vehicles) require specifying sub-assemblies for targeted ministerial QCO mapping.

*For complete architecture and decision disclosures, see [`docs/DECISION_AND_FLOW.md`](docs/DECISION_AND_FLOW.md).*

---

## 12. Getting Started & Local Development

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ & npm
- [Ollama](https://ollama.ai) running locally with `qwen2.5:7b` (optional)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate
pip install -r requirements.txt

# Start FastAPI backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 13. Current Implementation Status

| Evaluation Dimension | Verification Evidence | Status |
| :--- | :--- | :--- |
| **PS107 Alignment** | [`docs/DECISION_AND_FLOW.md`](docs/DECISION_AND_FLOW.md) | **PASS** |
| **Core RAG Architecture** | Hybrid BGE + BM25 + Reciprocal Rank Fusion | **PASS** |
| **Standard Recommendation** | IDF-weighted scoring, domain synonyms, negative SaaS penalties | **PASS** |
| **Standard Lifecycle Verification** | Deterministic supersession graph, amendment & QCO modeling | **PASS** |
| **Certification Guidance** | Interactive procedural checklists for Schemes I, II, IV | **PASS** |
| **Hallmarking & HUID** | Gold (`IS 1417`) & Silver (`IS 2112`) fineness, 6-digit HUID rules | **PASS** |
| **Consumer Services** | CML licence lookup, complaint filing guidance | **PASS** |
| **Laboratory Discovery** | Section 19 central/regional/branch/LRS laboratory directory | **PASS** |
| **Multilingual Interaction** | 11 Indian languages + Hinglish with token preservation | **PASS** |
| **Voice Interaction** | Speech-to-Text & Text-to-Speech with browser fallback | **PASS** |
| **Anti-Hallucination & Grounding** | Official URL attribution, low-confidence abstention | **PASS** |
| **Copyright Protection** | Scope & marking extraction without full-text infringement | **PASS** |
| **Adversarial Hardening** | 100% test coverage (52/52 tests passing) | **PASS** |
| **User Interface** | Next.js 16 civic theme with Warm Ivory / Ink Navy palette | **PASS** |
