# BIS Saathi — Decision & System Flow

## 1. Project

**BIS Saathi** is the AI Assistant and Standard Discovery Engine for the **Bureau of Indian Standards (BIS)**, developed for **Smart India Hackathon (SIH PS107)**. It provides conversational compliance guidance, dynamic standard recommendation, standard lifecycle verification, laboratory discovery, and multilingual voice interaction grounded in official BIS records.

---

## 2. Core Decisions

- **Frontend (`Next.js 16 + React 19 + TypeScript + Tailwind CSS`)**: Responsive civic interface adhering to the Indian National Portal and Bureau of Indian Standards design language, featuring dark mode, dynamic typography scaling, custom tabs, and 11 Indian language localizations.
- **Backend (`FastAPI + Python 3.11+ + Uvicorn`)**: High-throughput async REST API orchestrating query classification, hybrid retrieval, standard lifecycle audits, laboratory recommendations, and multilingual voice pipelines.
- **Hybrid RAG (`ChromaDB + BM25 + Reciprocal Rank Fusion`)**: Combines dense semantic vector search with exact keyword matching over BIS statutory records, gazettes, QCO schedules, and laboratory rosters.
- **Embeddings (`BAAI/bge-small-en-v1.5`)**: High-precision 384-dimensional dense semantic embeddings run locally via HuggingFace SentenceTransformers on CPU/CUDA.
- **Verified BIS Knowledge Grounding**: 741+ verified Indian Standards, Gazette Notifications, Quality Control Orders (QCOs), and Scheme I–IV certification guidelines. Full-text copyrighted standard PDFs are protected and never extracted into uncurated dumps.
- **Standard Lifecycle Verification**: Automatic verification of whether a standard is `CURRENT`, `CURRENT_WITH_AMENDMENTS`, `SUPERSEDED`, or `WITHDRAWN`, with mandatory rejection of obsolete standards unless historical toggle is explicitly requested.
- **Standard Recommendation Engine**: Multi-stage classification that filters candidate standards by product scope, separates primary product standards from raw material specifications, rejects SaaS/non-physical false positives, and ranks by verified relevance.
- **Statutory Certification Guidance**: Precise mapping for Scheme I (ISI Mark), Scheme II (Compulsory Registration Scheme / CRS), Scheme IV (Foreign Manufacturers Certification Scheme / FMCS), Hallmarking (IS 1417 & 6-digit alphanumeric HUID), and Management Systems.
- **Laboratory Discovery (LIMS / Section 19)**: Location- and discipline-aware discovery across Central, Regional, Branch, and Government-recognized testing laboratories.
- **Multilingual Support (11 Languages)**: Full conversational localization across English, Hindi, Hinglish, Marathi, Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam, and Punjabi, preserving statutory designations (`IS XXXX:YYYY`, HUID, CML numbers, Gazette dates).
- **Voice Pipeline (TTS & STT)**: Real-time browser speech recognition (STT) and neural voice synthesis (TTS) with chunked sentence playback ensuring complete readouts without audio cutoff.
- **Confidence Scoring & Safe Abstention**: Automatic thresholding (`HIGH`, `MEDIUM`, `LOW`) with strict abstention when query falls outside BIS jurisdiction or lacks statutory grounding.

---

## 3. Main System Flow

```
User Query / Voice
        ↓
Next.js Civic Web UI
        ↓
FastAPI Backend (/api/chat, /api/v1/recommend-standard)
        ↓
Persona & Intent Classification (MSME, Consumer, Manufacturer, Jeweller, Student)
        ↓
Query Contextualization & Multi-Turn History
        ↓
Hybrid Retrieval (Dense ChromaDB Vector Search + Sparse BM25)
        ↓
Evidence Quality Assessment & Reciprocal Rank Fusion
        ↓
Standard Lifecycle Verification (Current vs. Superseded vs. Withdrawn)
        ↓
Product Scope & Role Applicability Verification
        ↓
Grounded Answer Generation with Structured Format
        ↓
Confidence Scoring & Factuality Audit
        ↓
Verified Official BIS Citations & Statutory Action Links
        ↓
User (Rendered Answer Card with TTS Voice Readout)
```

---

## 4. Find My Standard Flow

```
User Product / Service Description
        ↓
Candidate Retrieval (Semantic Match + IS Catalog Index)
        ↓
Lifecycle Status Verification (Verify CURRENT / Reject Outdated)
        ↓
Product Scope Filter (Distinguish Finished Product vs. Raw Material vs. Testing Method)
        ↓
SaaS & Non-Physical Entity Rejection
        ↓
Role Classification (Primary Mandatory Standard vs. Supporting Standard vs. Testing Method)
        ↓
QCO Status Verification (Mandatory Gazette Order vs. Voluntary Indian Standard)
        ↓
Ranked Presentation (Title, Scope, Mandatory Status, Verification Confidence, Lab Availability)
```

---

## 5. Ask BIS Flow

```
User Question (Text or Voice)
        ↓
Regulatory Intent Recognition (Certification, Marking, HUID, Grievance, Fee, Testing)
        ↓
Hybrid RAG Retrieval against Verified BIS Knowledge Base
        ↓
Evidence Assembly & Grounding Guardrails
        ↓
LLM Structured Response Generation:
  • What Does This Mean? (Plain language interpretation)
  • Applicable Indian Standard(s) (Exact IS numbers and titles)
  • Mandatory vs. Voluntary Requirements (QCO status and statutory deadlines)
  • Step-by-Step Procedure & Checklist
  • Official Next Actions & Portals
        ↓
Confidence Level Calculation (HIGH / MEDIUM / LOW)
        ↓
Clickable Official BIS Citations & Source Excerpts
```

---

## 6. Voice Flow

```
User Microphone Click (Input)
        ↓
Web Speech API / SpeechRecognition (Configured with BCP-47 Language Tag)
        ↓
Speech-to-Text Transcription
        ↓
Standard BIS Saathi Processing Pipeline
        ↓
Grounded Regulatory Response
        ↓
Sentence-Chunked Speech Synthesis (Sequential queue preventing browser cutoff)
        ↓
Native Accent Locale Audio Playback (Play / Pause / Resume / Stop)
```

---

## 7. Multilingual Flow

```
User Selected Language (11 Supported Indian Languages)
        ↓
Language Preference Header & Target BCP-47 Tag
        ↓
Dynamic Chat History Translation (POST /api/v1/translate-messages)
        ↓
Token-Preserving Translation Engine:
  • Preserves IS Standard Numbers (e.g., IS 15820, IS 2347)
  • Preserves 6-digit Alphanumeric HUID Tokens
  • Preserves Official URLs and Licence CML Formats
        ↓
Localized Response with Native UI Terminology & Native Speech Output
```

---

## 8. Trust Rules

1. **Zero Standard Hallucination**: The system never invents or synthesizes non-existent Indian Standard numbers or years.
2. **Strict Lifecycle Enforcement**: Outdated or superseded standards (e.g., IS 2347:2006) are never recommended as current compliance targets over active revisions (IS 2347:2017).
3. **Strict QCO Verification**: A standard is classified as mandatory *only* when backed by a gazetted Quality Control Order (QCO) issued by the relevant Ministry.
4. **Mandatory Citation Provenance**: Every response must ground its factual assertions in verified BIS portals (`bis.gov.in`, `manakonline.in`, `e-bis.gov.in`, `manaksarovar.bis.gov.in`).
5. **Safe Abstention**: Queries outside the regulatory purview of BIS or without sufficient evidentiary backing trigger safe fallback and redirection rather than fabricated advice.
6. **Copyright Compliance**: Standard summaries and scopes are provided for guidance; raw full-text protected standard documents are never reproduced or leaked in violation of statutory copyright.

---

## 9. Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- (Optional) Ollama with `qwen2.5:7b` for local offline inference
- (Optional) Sarvam AI API key for enhanced neural multilingual voice

### Backend Setup
```bash
cd backend
cp .env.example .env
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Vector Store Indexing
```bash
python scripts/chunk_and_index.py
```

### Automated Verification & Tests
```bash
python -m pytest backend/tests/ -v
```
