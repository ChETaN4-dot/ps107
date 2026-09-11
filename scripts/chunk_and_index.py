"""
BIS Saathi Knowledge Base Chunking and Indexing Pipeline.
Produces:
- data/processed/chunks.jsonl (RAG-ready semantic chunks with persona and citations)
- data/processed/documents.json (Inventory of all ingested documents)
- data/processed/standards_metadata.csv (Catalog of Indian Standards metadata)
"""

import os
import re
import json
import csv
import hashlib

DATA_RAW_DIR = "data/raw"
CHUNKS_JSONL_PATH = "data/processed/chunks.jsonl"
DOCUMENTS_JSON_PATH = "data/processed/documents.json"
STANDARDS_CSV_PATH = "data/processed/standards_metadata.csv"

CATEGORY_PERSONA_MAP = {
    "product_certification": ["MSME", "manufacturer"],
    "hallmarking": ["consumer", "jeweller"],
    "consumer": ["consumer"],
    "labs": ["testing_lab", "MSME", "manufacturer"],
    "standards_metadata": ["MSME", "manufacturer", "student"]
}

def parse_markdown_metadata(content):
    """Extract YAML-style frontmatter from raw markdown."""
    metadata = {}
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            header = parts[1]
            body = parts[2]
            for line in header.strip().splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    metadata[k.strip()] = v.strip()
    return metadata, body.strip()

def split_into_sections(text, default_section="General"):
    """Splits markdown into logical sections based on headings and FAQ patterns."""
    lines = text.splitlines()
    sections = []
    current_heading = default_section
    current_lines = []

    # Regex for heading or FAQ question
    heading_re = re.compile(r"^(#{1,4}\s+.*|(?:\d+[\.:]\s+|Q(?:uestion)?\s*\d+[\.:]\s*).*\?)$", re.IGNORECASE)

    for line in lines:
        stripped = line.strip()
        if heading_re.match(stripped):
            if current_lines:
                sec_text = "\n".join(current_lines).strip()
                if sec_text:
                    sections.append((current_heading, sec_text))
            current_heading = re.sub(r"^#{1,4}\s+", "", stripped).strip()
            current_lines = [line]
        else:
            current_lines.append(line)

    if current_lines:
        sec_text = "\n".join(current_lines).strip()
        if sec_text:
            sections.append((current_heading, sec_text))

    return sections

def create_subchunks(section_title, section_text, max_chars=1600, overlap=150):
    """Splits long sections into readable subchunks preserving paragraph integrity."""
    if len(section_text) <= max_chars:
        return [(section_title, section_text)]

    paragraphs = section_text.split("\n\n")
    chunks = []
    current_chunk = []
    current_len = 0
    sub_idx = 1

    for p in paragraphs:
        p_len = len(p)
        if current_len + p_len > max_chars and current_chunk:
            combined = "\n\n".join(current_chunk).strip()
            chunks.append((f"{section_title} (Part {sub_idx})", combined))
            sub_idx += 1
            # retain last paragraph for context overlap if appropriate
            if current_chunk and len(current_chunk[-1]) < overlap:
                current_chunk = [current_chunk[-1], p]
                current_len = len(current_chunk[0]) + p_len
            else:
                current_chunk = [p]
                current_len = p_len
        else:
            current_chunk.append(p)
            current_len += p_len

    if current_chunk:
        combined = "\n\n".join(current_chunk).strip()
        chunks.append((f"{section_title} (Part {sub_idx})" if sub_idx > 1 else section_title, combined))

    return chunks

def extract_standards_from_markdown(file_path, default_service, source_url):
    """Extracts IS number, title, category, and QCO order from markdown tables."""
    standards = []
    if not os.path.exists(file_path):
        return standards

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find table lines
    lines = content.splitlines()
    for line in lines:
        if line.startswith("|") and not "---" in line and not "Sr No." in line and not "Sl. No." in line:
            parts = [c.strip() for c in line.split("|")[1:-1]]
            if len(parts) >= 3:
                # Typically: [Sr, IS No, Title, Notification...] or [IS No, Title, Category...]
                col1, col2 = parts[0], parts[1]
                is_num = ""
                title = ""
                notification = ""

                if "IS" in col1:
                    is_num = col1
                    title = col2
                    if len(parts) > 2:
                        notification = parts[2]
                elif "IS" in col2:
                    is_num = col2
                    title = parts[2]
                    if len(parts) > 3:
                        notification = parts[3]

                if is_num and title and "IS" in is_num:
                    # Clean IS No
                    is_clean = re.sub(r"\s+", " ", is_num).strip()
                    title_clean = re.sub(r"\s+", " ", title).strip()
                    if len(title_clean) > 3 and not title_clean.lower().startswith("is "):
                        # Extract year
                        year_match = re.search(r"\b(19\d\d|20\d\d)\b", is_clean + " " + notification)
                        year = year_match.group(1) if year_match else "Current"

                        # Extract keywords
                        words = re.findall(r"\b[A-Za-z]{4,}\b", title_clean)
                        keywords = ", ".join(list(dict.fromkeys(words))[:6])

                        standards.append({
                            "is_number": is_clean,
                            "title": title_clean,
                            "year": year,
                            "status": "Mandatory (QCO)",
                            "category": "Compulsory Certification",
                            "keywords": keywords,
                            "related_service": default_service,
                            "source_url": source_url
                        })
    return standards

def run_indexing():
    print("Starting BIS Saathi Chunking & Indexing Pipeline...")

    all_chunks = []
    documents_manifest = []
    standards_list = []
    chunk_counter = 0

    # Walk through data/raw/
    for root, dirs, files in os.walk(DATA_RAW_DIR):
        for fname in files:
            if not fname.endswith(".md"):
                continue
            file_path = os.path.join(root, fname)
            rel_dir = os.path.relpath(root, DATA_RAW_DIR)
            category = rel_dir.replace("\\", "/").split("/")[0]

            with open(file_path, "r", encoding="utf-8") as f:
                raw_content = f.read()

            meta, body = parse_markdown_metadata(raw_content)
            source_title = meta.get("title", fname.replace(".md", "").replace("_", " ").title())
            source_url = meta.get("source_url", "https://www.bis.gov.in")
            cat = meta.get("category", category)

            # Determine persona
            persona = CATEGORY_PERSONA_MAP.get(cat, ["consumer"])
            if "jeweller" in fname.lower():
                persona = ["jeweller"]
            elif "consumer" in fname.lower() and cat == "hallmarking":
                persona = ["consumer"]
            elif "faq_mandatory" in fname.lower():
                persona = ["consumer", "jeweller"]

            # Split into sections
            sections = split_into_sections(body, default_section="Overview")
            doc_chunks = 0

            for sec_title, sec_text in sections:
                # Clean up sec_text
                sec_text = sec_text.strip()
                if len(sec_text) < 40:
                    continue  # skip empty or noise sections

                subchunks = create_subchunks(sec_title, sec_text)
                for s_title, s_text in subchunks:
                    chunk_counter += 1
                    chunk_id = f"bis-{cat[:4]}-{hashlib.md5((fname + s_title + str(chunk_counter)).encode()).hexdigest()[:8]}"
                    
                    chunk_obj = {
                        "id": chunk_id,
                        "source_title": source_title,
                        "source_url": source_url,
                        "section": s_title,
                        "text": s_text,
                        "category": cat,
                        "persona": persona
                    }
                    all_chunks.append(chunk_obj)
                    doc_chunks += 1

            documents_manifest.append({
                "title": source_title,
                "filename": fname,
                "category": cat,
                "source_url": source_url,
                "chunk_count": doc_chunks
            })

            # Check for standards metadata tables
            if "scheme_i" in fname.lower():
                std_items = extract_standards_from_markdown(file_path, "Product Certification (Scheme I)", source_url)
                standards_list.extend(std_items)
            elif "scheme_ii" in fname.lower():
                std_items = extract_standards_from_markdown(file_path, "Compulsory Registration Scheme (CRS Scheme II)", source_url)
                standards_list.extend(std_items)

    # Write chunks.jsonl
    os.makedirs(os.path.dirname(CHUNKS_JSONL_PATH), exist_ok=True)
    with open(CHUNKS_JSONL_PATH, "w", encoding="utf-8") as f:
        for ch in all_chunks:
            f.write(json.dumps(ch, ensure_ascii=False) + "\n")
    print(f"Generated {len(all_chunks)} RAG chunks in {CHUNKS_JSONL_PATH}")

    # Write documents.json
    with open(DOCUMENTS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(documents_manifest, f, indent=2, ensure_ascii=False)
    print(f"Generated documents manifest ({len(documents_manifest)} documents) in {DOCUMENTS_JSON_PATH}")

    # Deduplicate and write standards_metadata.csv
    seen_is = set()
    deduped_standards = []
    for s in standards_list:
        if s["is_number"] not in seen_is:
            seen_is.add(s["is_number"])
            deduped_standards.append(s)

    with open(STANDARDS_CSV_PATH, "w", encoding="utf-8", newline="") as f:
        fieldnames = ["is_number", "title", "year", "status", "category", "keywords", "related_service", "source_url"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for s in deduped_standards:
            writer.writerow(s)
    print(f"Generated {len(deduped_standards)} Indian Standards records in {STANDARDS_CSV_PATH}")

if __name__ == "__main__":
    run_indexing()
