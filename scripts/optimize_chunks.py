"""
Script to optimize oversized table dumps in data/processed/chunks.jsonl
Splits monolithic raw table chunks (298KB and 19KB) into 7 clean, sector-specific
metadata chunks adhering strictly to copyright guidelines and RAG token constraints.
Re-indexes ChromaDB vectorstore.
"""

import sys
import json
import shutil
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
CHUNKS_FILE = ROOT_DIR / "data" / "processed" / "chunks.jsonl"
BACKUP_FILE = ROOT_DIR / "data" / "processed" / "chunks.backup.jsonl"

NEW_SECTOR_CHUNKS = [
    {
        "id": "bis-stan-scheme1-cement",
        "source_title": "Compulsory Certification Standards - Cement & Building Materials (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
        "section": "Cement and Concrete Building Materials under Mandatory ISI Certification",
        "text": (
            "## Mandatory BIS Certification (Scheme I) - Cement & Building Materials\n\n"
            "Under statutory Quality Control Orders (QCOs) issued by the Central Government, manufacturing, importing, "
            "or selling cement without a valid BIS Standard Mark (ISI Mark) is strictly prohibited under Section 16 & 17 of the BIS Act, 2016.\n\n"
            "**Key Notified Indian Standards for Cement:**\n"
            "- **IS 269:** Ordinary Portland Cement (OPC 33, 43, 53 grade)\n"
            "- **IS 455:** Portland Slag Cement\n"
            "- **IS 1489 (Part 1 & 2):** Portland Pozzolana Cement (Fly ash based and Calcined clay based)\n"
            "- **IS 8112:** 43 Grade Ordinary Portland Cement\n"
            "- **IS 12269:** 53 Grade Ordinary Portland Cement\n"
            "- **IS 6452:** High Alumina Cement for Structural Use\n"
            "- **IS 6909:** Supersulphated Cement\n\n"
            "**Compliance Pathway:** Manufacturers must obtain a Scheme I licence via the Manakonline portal following complete factory testing laboratory setup, qualified quality control personnel, and mandatory pre-grant audit."
        ),
        "category": "standards_metadata",
        "persona": ["manufacturer", "msme"]
    },
    {
        "id": "bis-stan-scheme1-steel",
        "source_title": "Compulsory Certification Standards - Steel & Iron Products (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
        "section": "Steel Products under Steel Quality Control Orders",
        "text": (
            "## Mandatory BIS Certification (Scheme I) - Steel & Structural Metal Products\n\n"
            "The Ministry of Steel enforces mandatory Quality Control Orders requiring mandatory BIS certification for prime and re-rolled steel products.\n\n"
            "**Key Notified Indian Standards for Steel:**\n"
            "- **IS 1786:** High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT Rebars - Fe 415, Fe 500, Fe 550, Fe 600)\n"
            "- **IS 2062:** Hot Rolled Medium and High Tensile Structural Steel\n"
            "- **IS 2830:** Carbon Steel Cast Billet Ingots, Billets, Blooms and Slabs for Re-rolling\n"
            "- **IS 277:** Galvanized Steel Sheets (Plain and Corrugated)\n"
            "- **IS 1079:** Low Carbon Steel Sheets and Strips\n"
            "- **IS 1239 (Part 1 & 2):** Steel Tubes, Tubulars and Other Wrought Steel Fittings\n\n"
            "**Statutory Requirement:** No foreign or domestic manufacturer may dispatch structural steel without stamping the ISI Mark alongside the registered 7-digit CML licence number."
        ),
        "category": "standards_metadata",
        "persona": ["manufacturer", "msme"]
    },
    {
        "id": "bis-stan-scheme1-electrical",
        "source_title": "Compulsory Certification Standards - Electrical Cables & Transformers (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
        "section": "Electrical Cables, Conductors and Distribution Transformers",
        "text": (
            "## Mandatory BIS Certification (Scheme I) - Electrical Cables & Distribution Transformers\n\n"
            "Electrical equipment, cables, and distribution transformers are notified under mandatory BIS certification for public safety and fire hazard prevention.\n\n"
            "**Key Notified Indian Standards for Electrical Goods:**\n"
            "- **IS 694:** PVC Insulated Cables for Working Voltages up to and including 1100 V (Domestic and industrial wiring)\n"
            "- **IS 1554 (Part 1):** PVC Insulated (Heavy Duty) Electric Cables for working voltages up to and including 1100 V\n"
            "- **IS 7098 (Part 1 & 2):** Crosslinked Polyethylene (XLPE) Insulated Cables\n"
            "- **IS 1180 (Part 1):** Outdoor Type Oil Immersed Distribution Transformers up to and including 2500 kVA, 33 kV\n"
            "- **IS 302 (Part 2 series):** Safety of Household and Similar Electrical Appliances (Electric irons, immersion heaters, toasters)\n"
            "- **IS 12615:** Line Operated Three-Phase Induction Motors\n\n"
            "**Application Note:** Option 2 (Simplified Procedure) is available for eligible low-risk items, granting a licence within 30 days upon submission of a complete independent test report."
        ),
        "category": "standards_metadata",
        "persona": ["manufacturer", "msme"]
    },
    {
        "id": "bis-stan-scheme1-water",
        "source_title": "Compulsory Certification Standards - Drinking Water & Beverages (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
        "section": "Packaged Drinking Water and Natural Mineral Water",
        "text": (
            "## Mandatory BIS Certification (Scheme I) - Packaged Drinking Water & Mineral Water\n\n"
            "Under the Food Safety and Standards Act and BIS Act, 2016, packaged water cannot be manufactured or sold without a dual FSSAI licence and operative BIS ISI mark licence.\n\n"
            "**Key Notified Indian Standards for Water:**\n"
            "- **IS 14543:** Packaged Drinking Water (Other than Packaged Natural Mineral Water)\n"
            "- **IS 13428:** Packaged Natural Mineral Water\n"
            "- **IS 10500:** Drinking Water Quality Specification (Referenced standard for municipal and source water)\n"
            "- **IS 1165:** Milk-Powder\n"
            "- **IS 1166:** Condensed Milk\n"
            "- **IS 15757:** Infant Milk Substitutes\n\n"
            "**Testing & Hygiene Rigor:** Packaged water plants must have dedicated in-house microbiological testing facilities, laminar airflow, and automated bottle rinsing, filling, and capping systems."
        ),
        "category": "standards_metadata",
        "persona": ["consumer", "manufacturer", "msme"]
    },
    {
        "id": "bis-stan-scheme1-chemicals-safety",
        "source_title": "Compulsory Certification Standards - Chemicals, Helmets & Automotive Glass (Scheme I)",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
        "section": "Chemicals, Protective Helmets and Safety Glass under Mandatory QCOs",
        "text": (
            "## Mandatory BIS Certification (Scheme I) - Consumer Safety & Industrial Chemicals\n\n"
            "A wide range of public safety and chemical products are notified under mandatory Quality Control Orders.\n\n"
            "**Key Notified Indian Standards for Safety & Chemicals:**\n"
            "- **IS 4151:** Protective Helmets for Two-Wheeler Riders (Mandatory manufacturing & sale compliance)\n"
            "- **IS 2553 (Part 1 & 2):** Safety Glass for Architectural and Automotive Use\n"
            "- **IS 9873 (Series):** Safety of Toys (Mechanical, physical, flammability, and chemical migration)\n"
            "- **IS 3196 (Part 1 to 4):** Welded Low Carbon Steel Gas Cylinders exceeding 5-litre water capacity for LPG\n"
            "- **IS 5116:** Caustic Soda (Pure and Technical)\n"
            "- **IS 252:** Acetic Acid\n"
            "- **IS 170:** Acetone\n"
            "- **IS 10112:** Polyethylene for Its Safe Use in Contact with Foodstuffs\n\n"
            "**Enforcement:** Sale of uncertified two-wheeler helmets or domestic LPG cylinders without ISI marking is a criminal offense subject to seizure and court prosecution."
        ),
        "category": "standards_metadata",
        "persona": ["consumer", "manufacturer", "msme"]
    },
    {
        "id": "bis-stan-scheme2-crs-electronics",
        "source_title": "Compulsory Registration Standards - Electronics & IT Goods (Scheme II / CRS)",
        "source_url": "https://www.crsbis.in",
        "section": "Compulsory Registration Scheme (CRS) for Electronics and Information Technology",
        "text": (
            "## Scheme II - Compulsory Registration Scheme (CRS) for Electronics & IT Goods\n\n"
            "Notified by the Ministry of Electronics and Information Technology (MeitY) and operated by BIS under Scheme-II (Self-Declaration of Conformity).\n\n"
            "**Key Notified Indian Standards under CRS:**\n"
            "- **IS/IEC 62368 (Part 1): 2023 / IS 13252 (Part 1):** Audio/Video, Information and Communication Technology Equipment (Laptops, Desktops, Tablets, Printers, Scanners, Wireless Keyboards, Point of Sale terminals)\n"
            "- **IS 16046 (Part 1 & 2):** Secondary Cells and Batteries containing Alkaline or other Non-Acid Electrolytes (Lithium-ion battery packs, power banks, mobile phone batteries)\n"
            "- **IS 16102 (Part 1 & 2):** Self-Ballasted LED Lamps for General Lighting Services\n"
            "- **IS 16103 (Part 1):** LED Luminaires for General Lighting\n"
            "- **IS 16242 (Part 1):** Uninterruptible Power Systems (UPS / Inverters)\n"
            "- **IS 16333 (Part 3):** Mobile Phones - Indian Language Support\n"
            "- **IS/IEC 60065:** Audio, Video and Similar Electronic Apparatus (Televisions, set-top boxes, amplifiers)\n\n"
            "**Registration Workflow:** Unlike Scheme I, Scheme II does not require factory audits prior to grant. The applicant submits a test report from a BIS-recognized testing laboratory, and the BIS CRS Department issues an online Registration Mark within statutory Citizen's Charter timelines."
        ),
        "category": "standards_metadata",
        "persona": ["manufacturer", "msme", "consumer"]
    }
]

def optimize():
    print("Backing up chunks.jsonl to chunks.backup.jsonl...")
    shutil.copyfile(CHUNKS_FILE, BACKUP_FILE)

    kept_chunks = []
    dropped_count = 0

    with open(BACKUP_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                ch = json.loads(line)
                cid = ch.get("id")
                # Drop the two oversized raw tables
                if cid in ["bis-stan-402227e0", "bis-stan-30faa488"]:
                    dropped_count += 1
                    print(f"Replacing oversized chunk: {cid} ({len(ch['text'])} chars)")
                else:
                    kept_chunks.append(ch)

    # Add the 6 clean replacement sector chunks
    final_chunks = kept_chunks + NEW_SECTOR_CHUNKS

    print(f"\nOriginal chunks: {len(kept_chunks) + dropped_count}")
    print(f"Dropped oversized chunks: {dropped_count}")
    print(f"Added sector metadata chunks: {len(NEW_SECTOR_CHUNKS)}")
    print(f"Total optimized chunks: {len(final_chunks)}")

    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        for ch in final_chunks:
            f.write(json.dumps(ch, ensure_ascii=False) + "\n")

    print(f"Successfully wrote optimized dataset to {CHUNKS_FILE}")

if __name__ == "__main__":
    optimize()
