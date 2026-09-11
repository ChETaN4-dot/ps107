"""
Hybrid Retrieval Architecture for BIS Saathi.
Combines:
1. Dense Semantic Retrieval (BAAI/bge-small-en-v1.5 + ChromaDB Cosine Similarity)
2. Keyword Retrieval (Exact matching & BM25-style frequency for regulatory terms like HUID, ISI, IS numbers, QCO, etc.)
3. Metadata Filtering (category and persona alignment)
4. Source Authority (statutory notifications, Gazette, Citizen's Charter given weight)
5. Freshness (2024 revisions prioritized)

Produces an explainable, multi-factor ranking score with full provenance preservation.
"""

import re
from typing import List, Dict, Any, Optional
import logging
from app.config import settings
from app.core.vectorstore import get_vectorstore
from app.models.schemas import PersonaType

logger = logging.getLogger(__name__)

# Key regulatory keywords that require strict lexical grounding
KEY_BIS_TERMS = [
    r"\bhuid\b",
    r"\bisi\b",
    r"\bbis\b",
    r"\bis\s*\d+\b",
    r"\bhallmark(ing)?\b",
    r"\blicen[cs]e\b",
    r"\bcertif(ication)?\b",
    r"\bqco\b",
    r"\bquality control order\b",
    r"\bjeweller\b",
    r"\bmsme\b",
    r"\budyam\b",
    r"\boption\s*1\b",
    r"\boption\s*2\b",
    r"\bsimplified procedure\b",
    r"\bcml\b",
    r"\bahc\b",
    r"\blrs\b",
    r"\blims\b",
    r"\bcitizen.?s charter\b",
    r"\bmarking fee\b",
    r"\bconcession\b"
]

AUTHORITY_KEYWORDS = ["gazette", "citizen's charter", "act, 2016", "statutory", "central government", "mandatory"]
FRESHNESS_KEYWORDS = ["2024", "1st january, 2024", "revised", "w.e.f.", "amendment"]

class HybridRetriever:
    """Combines semantic search and lexical matching with explainable multi-factor scoring."""

    def __init__(self):
        self.vectorstore = get_vectorstore()

    def _calculate_keyword_score(self, query: str, document_text: str, section: str, title: str) -> float:
        """
        Calculate lexical match score based on query terms and exact BIS keywords.
        Returns a normalized score between 0.0 and 1.0.
        """
        doc_lower = f"{title} {section} {document_text}".lower()
        query_lower = query.lower()
        
        # 1. Check exact key regulatory term presence
        key_term_hits = 0
        total_key_terms_in_query = 0
        for pattern in KEY_BIS_TERMS:
            if re.search(pattern, query_lower):
                total_key_terms_in_query += 1
                if re.search(pattern, doc_lower):
                    key_term_hits += 1

        term_boost = (key_term_hits / max(1, total_key_terms_in_query)) if total_key_terms_in_query > 0 else 0.0

        # 2. Token overlap (Jaccard / Substring matching)
        query_tokens = [w for w in re.findall(r'\b\w{3,}\b', query_lower) if w not in {"what", "how", "when", "where", "does", "the", "and", "for", "with"}]
        if not query_tokens:
            return 0.5

        token_hits = sum(1 for tok in query_tokens if tok in doc_lower)
        token_ratio = token_hits / len(query_tokens)

        # Section / Title hit bonus
        title_bonus = 0.0
        sec_lower = f"{title} {section}".lower()
        if any(tok in sec_lower for tok in query_tokens):
            title_bonus = 0.2

        raw_score = (0.5 * token_ratio) + (0.3 * term_boost) + title_bonus
        return min(1.0, max(0.0, raw_score))

    def _calculate_authority_and_freshness(self, metadata: Dict[str, Any], text: str) -> Tuple[float, float]:
        """Calculates authority boost (0.0 to 1.0) and freshness boost (0.0 to 1.0)."""
        combined_text = f"{metadata.get('source_title', '')} {metadata.get('section', '')} {text[:300]}".lower()
        
        # Authority
        authority_score = 0.8  # baseline for official BIS sources
        if any(auth_kw in combined_text for auth_kw in AUTHORITY_KEYWORDS):
            authority_score = 1.0

        # Freshness
        freshness_score = 0.7  # baseline
        if any(fresh_kw in combined_text for fresh_kw in FRESHNESS_KEYWORDS):
            freshness_score = 1.0

        return authority_score, freshness_score

    def retrieve(
        self,
        query: str,
        persona: PersonaType = PersonaType.GENERAL,
        category: Optional[str] = None,
        top_k: int = settings.RETRIEVAL_TOP_K
    ) -> List[Dict[str, Any]]:
        """
        Execute full hybrid retrieval pipeline.
        Returns sorted list of grounded candidates with explainable score components.
        """
        # Step 1: Candidate Pool Retrieval via ChromaDB
        # Fetch wider candidate pool (top_k * 3) for re-ranking
        pool_size = min(top_k * 3, max(1, self.vectorstore.collection.count()))
        
        # Build category filter if explicit
        cat_filter = category if (category and category not in ["general", "all", "out_of_scope", "greeting"]) else None
        
        raw_candidates = self.vectorstore.similarity_search(
            query=query,
            top_k=pool_size,
            category_filter=cat_filter,
            persona=persona.value
        )

        # If strict category filter yielded 0 results, fall back to global search to prevent silent misses
        if not raw_candidates and cat_filter:
            logger.info(f"Category filter '{cat_filter}' returned 0 candidates. Falling back to global semantic search.")
            raw_candidates = self.vectorstore.similarity_search(
                query=query,
                top_k=pool_size,
                category_filter=None,
                persona=persona.value
            )

        ranked_results = []
        for cand in raw_candidates:
            doc_id = cand["id"]
            text = cand["text"]
            meta = cand.get("metadata", {})
            semantic_score = cand.get("similarity", 0.0)

            # Step 2: Keyword Scoring
            sec = meta.get("section", "")
            title = meta.get("source_title", "")
            keyword_score = self._calculate_keyword_score(query, text, sec, title)

            # Step 3: Metadata / Persona Alignment
            chunk_personas = [p.strip().lower() for p in meta.get("personas", "").split(",") if p.strip()]
            persona_match = (persona.value.lower() in chunk_personas) if persona != PersonaType.GENERAL else False
            metadata_score = 1.0 if persona_match else 0.6

            # Step 4: Authority & Freshness
            authority_score, freshness_score = self._calculate_authority_and_freshness(meta, text)
            auth_fresh_combined = (0.6 * authority_score) + (0.4 * freshness_score)

            # Step 5: Combined Explainable Hybrid Scoring Formula
            # 50% Semantic + 25% Keyword + 15% Metadata Persona + 10% Authority/Freshness
            hybrid_score = (
                (0.50 * semantic_score) +
                (0.25 * keyword_score) +
                (0.15 * metadata_score) +
                (0.10 * auth_fresh_combined)
            )
            hybrid_score = round(min(1.0, max(0.0, hybrid_score)), 4)

            # Derive clean document_id from chunk_id
            doc_id_clean = doc_id.rsplit("-", 1)[0] if "-" in doc_id else doc_id

            ranked_results.append({
                "chunk_id": doc_id,
                "document_id": doc_id_clean,
                "text": text,
                "metadata": meta,
                "source_title": title,
                "source_url": meta.get("source_url", "https://www.bis.gov.in"),
                "section": sec,
                "category": meta.get("category", ""),
                "persona": meta.get("personas", ""),
                "authority": "Bureau of Indian Standards (BIS)",
                "semantic_score": round(semantic_score, 4),
                "keyword_score": round(keyword_score, 4),
                "metadata_score": round(metadata_score, 4),
                "authority_score": round(auth_fresh_combined, 4),
                "hybrid_score": hybrid_score
            })

        # Sort descending by hybrid_score
        ranked_results.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return ranked_results[:top_k]

_retriever_instance = None

def get_hybrid_retriever() -> HybridRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = HybridRetriever()
    return _retriever_instance
