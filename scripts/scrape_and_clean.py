"""
BIS Saathi Knowledge Base Scraper and Cleaner.
Adheres to:
- Official public BIS domains only.
- Strict copyright safety: No full text of copyrighted Indian Standards (IS) PDFs. Only public metadata.
- Polite crawling: 1-3s delays, respectful user agent, retry backoff.
- Structured output in data/raw/<category>/.
- Operational logging to data/logs/scrape_log.txt and data/logs/skipped_urls.txt.
"""

import os
import sys
import time
import random
import re
import urllib.request
import urllib.error
from bs4 import BeautifulSoup, Tag
from pypdf import PdfReader
from io import BytesIO

# Set console encoding
sys.stdout.reconfigure(encoding='utf-8')

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (BIS-Saathi-KnowledgeBase-Bot)"
TIMEOUT = 35
MAX_RETRIES = 3

SCRAPE_LOG_PATH = "data/logs/scrape_log.txt"
SKIPPED_URLS_PATH = "data/logs/skipped_urls.txt"

def log_event(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(SCRAPE_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def log_skipped(url, reason):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] SKIPPED: {url} | Reason: {reason}"
    print(line)
    with open(SKIPPED_URLS_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def fetch_url(url):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        }
    )
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            time.sleep(random.uniform(1.2, 2.5))  # Polite delay
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                status = resp.status
                content_type = resp.headers.get("Content-Type", "")
                data = resp.read()
                log_event(f"SUCCESS: {status} ({len(data)} bytes) <- {url}")
                return data, content_type
        except urllib.error.HTTPError as e:
            log_event(f"HTTPError {e.code} on attempt {attempt} for {url}: {e.reason}")
            if e.code in [401, 403, 404]:
                log_skipped(url, f"HTTP {e.code} {e.reason}")
                return None, None
            time.sleep(attempt * 3)
        except urllib.error.URLError as e:
            if hasattr(e, 'reason') and isinstance(e.reason, Exception) and "IncompleteRead" in str(e.reason):
                log_event(f"IncompleteRead handled for {url}")
            else:
                log_event(f"URLError on attempt {attempt} for {url}: {e}")
            time.sleep(attempt * 3)
        except Exception as e:
            import http.client
            if isinstance(e, http.client.IncompleteRead):
                log_event(f"IncompleteRead captured {len(e.partial)} bytes for {url}")
                return e.partial, "text/html"
            log_event(f"Error on attempt {attempt} for {url}: {e}")
            time.sleep(attempt * 3)
    log_skipped(url, f"Exceeded {MAX_RETRIES} retries / timeout")
    return None, None

def clean_html_to_markdown(html_content, title, url, category):
    soup = BeautifulSoup(html_content, "html.parser")
    
    # 1. Target the main content area first before decomposing
    content_root = soup.find("div", class_="who_we_area")
    if not content_root:
        subtittle = soup.find("div", class_="subtittle")
        if subtittle and subtittle.parent:
            content_root = subtittle.parent
    if not content_root:
        content_root = soup.find("main") or soup.find("article") or soup.find("div", id="content") or soup.find("body") or soup

    # 2. Inside content_root, decompose only unwanted noise
    for tag in content_root(["script", "style", "iframe", "noscript", "form"]):
        tag.decompose()
        
    for tag in content_root.find_all(class_=re.compile(r"breadcrumb|post-modified-info|share|social|feedback", re.I)):
        tag.decompose()

    # 3. Format tables nicely into markdown
    for table in content_root.find_all("table"):
        rows = table.find_all("tr")
        if not rows:
            continue
        md_table_lines = []
        is_first_row = True
        num_cols = 0
        for r in rows:
            cells = r.find_all(["th", "td"])
            cols = [re.sub(r"\s+", " ", cell.get_text(strip=True)).replace("|", "\\|") for cell in cells]
            if not cols or all(len(c) == 0 for c in cols):
                continue
            if is_first_row:
                num_cols = len(cols)
                md_table_lines.append("| " + " | ".join(cols) + " |")
                md_table_lines.append("| " + " | ".join(["---"] * num_cols) + " |")
                is_first_row = False
            else:
                if len(cols) < num_cols:
                    cols.extend([""] * (num_cols - len(cols)))
                else:
                    cols = cols[:num_cols]
                md_table_lines.append("| " + " | ".join(cols) + " |")
        
        md_table_text = "\n\n" + "\n".join(md_table_lines) + "\n\n"
        table.replace_with(soup.new_string(md_table_text))

    # 4. Process headings
    for h in content_root.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        level = int(h.name[1])
        prefix = "#" * level + " "
        h_text = "\n\n" + prefix + re.sub(r"\s+", " ", h.get_text(strip=True)) + "\n\n"
        h.replace_with(soup.new_string(h_text))

    # 5. Process lists
    for li in content_root.find_all("li"):
        li_text = "* " + re.sub(r"\s+", " ", li.get_text(strip=True)) + "\n"
        li.replace_with(soup.new_string(li_text))

    # 6. Process paragraphs
    for p in content_root.find_all("p"):
        p_text = re.sub(r"\s+", " ", p.get_text(strip=True))
        if p_text:
            p.replace_with(soup.new_string(p_text + "\n\n"))

    raw_text = content_root.get_text()
    lines = [line.strip() for line in raw_text.splitlines()]
    clean_text = "\n".join([line for line in lines if line])
    clean_text = re.sub(r"\n{3,}", "\n\n", clean_text).strip()

    header_block = f"""---
title: {title}
source_url: {url}
category: {category}
scraped_at: {time.strftime('%Y-%m-%d %H:%M:%S')}
---

# {title}

**Official Source URL:** {url}

{clean_text}
"""
    return header_block

def extract_citizens_charter_pdf(pdf_bytes, url):
    """Extracts public sections from Citizen's Charter PDF (Lab services, timelines, consumer rights)."""
    log_event("Parsing Citizen's Charter PDF with pypdf...")
    reader = PdfReader(BytesIO(pdf_bytes))
    total_pages = len(reader.pages)
    log_event(f"Citizen's Charter PDF has {total_pages} pages.")

    full_pdf_text = []
    for idx, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        full_pdf_text.append(f"--- PAGE {idx+1} ---\n{page_text}")
    
    combined = "\n\n".join(full_pdf_text)
    
    # Save clean summary markdown focusing on Lab Services, Timelines, and Consumer Rights
    doc_text = f"""---
title: BIS Citizen's Charter (Lab Services, Timelines & Consumer Rights)
source_url: {url}
category: labs
document_type: official_citizens_charter
scraped_at: {time.strftime('%Y-%m-%d %H:%M:%S')}
---

# BIS Citizen's Charter - Service Delivery Timelines, Laboratory Services & Consumer Rights

**Official Source Document:** {url}
**Total Pages in Official Document:** {total_pages}

## Overview & Mandate
The Bureau of Indian Standards (BIS) Citizen's Charter outlines the commitments, service delivery standards, timelines, laboratory testing norms, and grievance redressal mechanisms for citizens, MSME manufacturers, jewellers, and consumer organizations.

## Extracted Official Service Delivery Standards & Timelines

{combined}
"""
    return doc_text

def run_scraper():
    log_event("Starting BIS Saathi MVP Knowledge Base scrape run...")

    # Clear or initialize logs
    with open(SCRAPE_LOG_PATH, "w", encoding="utf-8") as f:
        f.write(f"BIS Saathi Knowledge Base Scrape Log - {time.strftime('%Y-%m-%d %H:%M:%S')}\n" + "="*80 + "\n")
    with open(SKIPPED_URLS_PATH, "w", encoding="utf-8") as f:
        f.write(f"BIS Saathi Skipped / Unreachable URLs - {time.strftime('%Y-%m-%d %H:%M:%S')}\n" + "="*80 + "\n")

    # Priority Targets
    sources = [
        # 1. Product Certification (MSME / Manufacturer)
        {
            "category": "product_certification",
            "filename": "product_certification_overview.md",
            "title": "Product Certification Overview",
            "url": "https://www.bis.gov.in/product-certification/product-certification-overview/?lang=en"
        },
        {
            "category": "product_certification",
            "filename": "product_certification_process.md",
            "title": "Product Certification Process (Option 1 & 2)",
            "url": "https://www.bis.gov.in/product-certification/product-certification-process/?lang=en"
        },
        {
            "category": "product_certification",
            "filename": "product_certification_faq.md",
            "title": "Product Certification FAQs",
            "url": "https://www.bis.gov.in/product-certification/product-certification-faq/?lang=en"
        },
        {
            "category": "product_certification",
            "filename": "products_under_compulsory_certification.md",
            "title": "Products Under Compulsory Certification Overview",
            "url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en"
        },
        {
            "category": "standards_metadata",
            "filename": "compulsory_standards_scheme_i_metadata.md",
            "title": "Compulsory Certification Standards Metadata - Scheme I (Mark Scheme)",
            "url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/?lang=en"
        },
        {
            "category": "standards_metadata",
            "filename": "compulsory_standards_scheme_ii_metadata.md",
            "title": "Compulsory Registration Standards Metadata - Scheme II (CRS Electronics & IT)",
            "url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/?lang=en"
        },

        # 2. Hallmarking (Consumer + Jeweller)
        {
            "category": "hallmarking",
            "filename": "hallmarking_overview.md",
            "title": "Hallmarking Overview and Regulation",
            "url": "https://www.bis.gov.in/hallmarking-overview/?lang=en"
        },
        {
            "category": "hallmarking",
            "filename": "hallmarking_faq_general.md",
            "title": "Hallmarking FAQs - General & Fundamentals",
            "url": "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en"
        },
        {
            "category": "hallmarking",
            "filename": "hallmarking_faq_mandatory_consumer.md",
            "title": "Hallmarking FAQs - Mandatory Hallmarking & Consumers",
            "url": "https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/mandatory/?lang=en"
        },
        {
            "category": "hallmarking",
            "filename": "hallmarking_faq_jewellers.md",
            "title": "Hallmarking Guidance for Jewellers",
            "url": "https://www.bis.gov.in/hallmarking-jewellers/?lang=en"
        },
        {
            "category": "hallmarking",
            "filename": "jewellers_registration_scheme.md",
            "title": "Jewellers Registration Scheme for Hallmarking",
            "url": "https://www.bis.gov.in/hallmarking-overview/jewellers-registration-scheme/?lang=en"
        },
        {
            "category": "hallmarking",
            "filename": "consumer_protection_hallmarking.md",
            "title": "Consumer Protection and Verification in Hallmarking",
            "url": "https://www.bis.gov.in/hallmarking-overview/consumer-protection/?lang=en"
        },

        # 3. Consumer Help
        {
            "category": "consumer",
            "filename": "consumer_overview.md",
            "title": "Consumer Overview & Engagement",
            "url": "https://www.bis.gov.in/consumer-overview/?lang=en"
        },
        {
            "category": "consumer",
            "filename": "consumer_faq.md",
            "title": "Consumer FAQs - Quality, ISI Mark & Grievances",
            "url": "https://www.bis.gov.in/consumer-overview/for-consumers-faq/?lang=en"
        },
        {
            "category": "consumer",
            "filename": "consumer_protection.md",
            "title": "Consumer Protection Guidelines",
            "url": "https://www.bis.gov.in/consumer-overview/consumer-protection/?lang=en"
        },
        {
            "category": "consumer",
            "filename": "online_complaint_registration.md",
            "title": "Online Complaint Registration Guidance",
            "url": "https://www.bis.gov.in/consumer-overview/online-complaint-registration/?lang=en"
        },

        # 4. Labs / Testing + Citizen's Charter
        {
            "category": "labs",
            "filename": "laboratory_overview.md",
            "title": "BIS Laboratory Services Overview",
            "url": "https://www.bis.gov.in/laboratorys/laboratory-services-overview/?lang=en"
        },
        {
            "category": "labs",
            "filename": "laboratory_faq.md",
            "title": "Laboratory Recognition Scheme (LRS) FAQs",
            "url": "https://www.bis.gov.in/laboratorys/laboratory-faq/?lang=en"
        }
    ]

    # Process web pages
    for s in sources:
        cat = s["category"]
        fname = s["filename"]
        title = s["title"]
        url = s["url"]
        out_path = os.path.join("data", "raw", cat, fname)

        log_event(f"Fetching [{cat}] {title} from {url}")
        content, ctype = fetch_url(url)
        if content:
            md_doc = clean_html_to_markdown(content, title, url, cat)
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(md_doc)
            log_event(f"Saved cleaned raw markdown to {out_path} ({len(md_doc)} chars)")
        else:
            log_skipped(url, "Failed to download during crawl")

    # Process Citizen's Charter PDF
    charter_pdf_url = "https://www.bis.gov.in/wp-content/uploads/2024/01/Citizens-Charter-Version-January-2024.pdf"
    log_event(f"Fetching official Citizen's Charter PDF: {charter_pdf_url}")
    pdf_bytes, ctype = fetch_url(charter_pdf_url)
    if pdf_bytes:
        charter_md = extract_citizens_charter_pdf(pdf_bytes, charter_pdf_url)
        charter_out_path = os.path.join("data", "raw", "labs", "citizens_charter_lab_services_and_timelines.md")
        with open(charter_out_path, "w", encoding="utf-8") as f:
            f.write(charter_md)
        log_event(f"Saved Citizen's Charter extracted text to {charter_out_path}")
    else:
        log_skipped(charter_pdf_url, "Failed to download Citizen's Charter PDF")

    # Document skipped dynamic portals as per strict rules
    dynamic_portals_to_log = [
        ("https://standards.bis.gov.in/login", "Dynamic authentication required; full standard download restricted under copyright laws"),
        ("https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails", "Dynamic search portal requiring form submission/AJAX; parsed equivalent official static metadata tables instead"),
        ("https://www.services.bis.gov.in/php/BIS_2.0/dgdashboard/Published_Standards", "Dynamic dashboard requiring session initialization; full text restricted"),
        ("https://www.manakonline.in/MANAK/home", "Single Sign-On (SSO) authentication portal for registered users only")
    ]
    for d_url, d_reason in dynamic_portals_to_log:
        log_skipped(d_url, d_reason)

    log_event("Scraping and cleaning phase complete!")

if __name__ == "__main__":
    run_scraper()
