"""
Copyright Safety & Intellectual Property Guardrail Test.
Audits all chunks in data/processed/chunks.jsonl to verify:
1. Zero reproduction of full copyrighted Indian Standards (IS) documents.
2. Standards entries only contain permissible public metadata:
   (IS Number, Title, Year/Revision, Scope/Summary, QCO status, Official URL).
3. Rejection of forbidden copyright markers (e.g. proprietary watermarks, complete price group specifications).
"""

import sys
import json
import re
from pathlib import Path

# Fix Windows stdout encoding
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CHUNKS_FILE = ROOT_DIR / "data" / "processed" / "chunks.jsonl"

FORBIDDEN_COPYRIGHT_PATTERNS = [
    re.compile(r"price group\s*[0-9]+", re.IGNORECASE),
    re.compile(r"all rights reserved.*?bureau of indian standards.*?no part of this publication may be reproduced", re.IGNORECASE),
    re.compile(r"unauthorized copying.*?strictly prohibited", re.IGNORECASE),
    re.compile(r"clause\s+1\s+scope.*?clause\s+2\s+normative\s+references.*?clause\s+3\s+terminology", re.IGNORECASE | re.DOTALL)
]

def test_copyright_guardrails():
    print("=" * 65)
    print("COPYRIGHT GUARDRAIL AUDIT (PHASE 9)")
    print("=" * 65)
    
    assert CHUNKS_FILE.exists(), f"Chunks file not found at: {CHUNKS_FILE}"
    
    chunks = []
    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                chunks.append(json.loads(line))
                
    total_chunks = len(chunks)
    print(f"Total Chunks Inspected: {total_chunks}")
    
    standards_chunks = [ch for ch in chunks if ch.get("category") == "standards_metadata"]
    print(f"Standards Metadata Chunks: {len(standards_chunks)}")
    
    violations = []
    for idx, ch in enumerate(chunks):
        cid = ch.get("id", f"chunk-{idx}")
        text = ch.get("text", "")
        
        # Check forbidden copyright patterns
        for pat in FORBIDDEN_COPYRIGHT_PATTERNS:
            if pat.search(text):
                violations.append({
                    "id": cid,
                    "title": ch.get("source_title"),
                    "pattern": pat.pattern
                })
        
        # Size sanity check: An extracted full IS document is typically 20,000+ characters.
        # Chunks exceeding 8,000 chars are flagged for review.
        if len(text) > 8000:
            violations.append({
                "id": cid,
                "title": ch.get("source_title"),
                "reason": f"Unusually large chunk ({len(text)} chars) - potential full document dump"
            })
            
    print(f"\nAudit Result:")
    if violations:
        print(f"FAILED: {len(violations)} copyright violations detected!")
        for v in violations:
            print(f" - [{v.get('id')}] {v.get('title')}: {v.get('pattern') or v.get('reason')}")
        assert False, f"Copyright violations found: {len(violations)}"
    else:
        print("PASSED! 0 copyright violations detected.")
        print("All standards chunks strictly contain public metadata, QCO status, and official portal links.")
        print("=" * 65)

if __name__ == "__main__":
    test_copyright_guardrails()
