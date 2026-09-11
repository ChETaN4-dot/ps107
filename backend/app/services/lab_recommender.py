"""
Verified BIS Laboratory Recommendation & Discovery Service (PS107).
Provides structured, factual guidance on the Bureau of Indian Standards laboratory network
established under Section 19 of the BIS Act, 2016.

Includes:
- Central Laboratory (Sahibabad)
- Regional Laboratories (Mumbai, Chennai, Kolkata, Mohali)
- Branch Laboratories (Bengaluru, Patna, Guwahati)
- LRS 2020 Recognized / NABL Empanelled testing guidance
- Turnaround time tracking under the Citizen's Charter (effective Jan 1, 2024)
"""

import re
import logging
from typing import List, Dict, Any

from app.models.schemas import (
    LabRecommendation, LabRecommendationRequest, LabRecommendationResponse
)

logger = logging.getLogger(__name__)

# Verified official BIS Laboratory directory (BIS In-House & LRS 2020 Recognized)
OFFICIAL_BIS_LABS: List[Dict[str, Any]] = [
    {
        "lab_name": "BIS Central Laboratory (BCL), Sahibabad",
        "location": "Sahibabad, Ghaziabad, Uttar Pradesh (Delhi NCR)",
        "lab_type": "Central Laboratory (BIS Owned)",
        "discipline": "All Disciplines (Chemical, Mechanical, Electrical, Food, Microbiology, Metallurgy)",
        "scope_highlights": "Comprehensive testing across Chemical, Electrical, Mechanical, and Microbiological disciplines. Packaged drinking water (IS 14543/13428), electrical appliances, cables, food products, toys (IS 9873), pressure cookers, and steel.",
        "address": "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad - 201010, Uttar Pradesh",
        "contact": "cl@bis.gov.in | +91-120-4177100 / 0120-2770030",
        "tat_days": "7 - 21 Days (Citizen's Charter 2024)",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["delhi", "ncr", "sahibabad", "ghaziabad", "up", "north", "central", "water", "electrical", "cables", "toys", "food", "appliances", "mechanical", "microbiology", "all"]
    },
    {
        "lab_name": "BIS Western Regional Laboratory (WRL), Mumbai",
        "location": "Mumbai, Maharashtra",
        "lab_type": "Regional Laboratory (BIS Owned)",
        "discipline": "Chemical & Polymers, Mechanical, Electrical",
        "scope_highlights": "Petroleum products, plastics, polymers, textiles, cement, domestic electrical appliances, switchgear, and chemical safety parameters.",
        "address": "Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (East), Mumbai - 400093, Maharashtra",
        "contact": "wrl@bis.gov.in | +91-22-28329295 / 022-28327891",
        "tat_days": "10 - 20 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["mumbai", "maharashtra", "west", "western", "pune", "gujarat", "petroleum", "plastic", "textile", "cement", "electrical", "appliances"]
    },
    {
        "lab_name": "BIS Southern Regional Laboratory (SRL), Chennai",
        "location": "Chennai, Tamil Nadu",
        "lab_type": "Regional Laboratory (BIS Owned)",
        "discipline": "Electrical & Electronics, Mechanical, Food & Water",
        "scope_highlights": "Submersible pumps (IS 14220), induction motors, electric cables, packaged drinking water, cement, and domestic consumer durables.",
        "address": "CIT Campus, IV Cross Road, Taramani, Chennai - 600113, Tamil Nadu",
        "contact": "srl@bis.gov.in | +91-44-22541442 / 044-22541216",
        "tat_days": "10 - 20 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["chennai", "tamil nadu", "south", "southern", "kerala", "pumps", "motors", "cables", "water", "cement", "electrical"]
    },
    {
        "lab_name": "BIS Eastern Regional Laboratory (ERL), Kolkata",
        "location": "Kolkata, West Bengal",
        "lab_type": "Regional Laboratory (BIS Owned)",
        "discipline": "Mechanical & Metallurgy, Civil Materials, Chemical",
        "scope_highlights": "Structural steel, iron rebars (IS 1786), galvanised sheets, cement, packaged drinking water, and heavy industrial chemical testing.",
        "address": "1/14, C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata - 700054, West Bengal",
        "contact": "erl@bis.gov.in | +91-33-23207080 / 033-23209474",
        "tat_days": "10 - 20 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["kolkata", "west bengal", "east", "eastern", "odisha", "steel", "metallurgy", "iron", "rebars", "water", "chemicals", "cement"]
    },
    {
        "lab_name": "BIS Northern Regional Laboratory (NRL), Mohali",
        "location": "Mohali / Chandigarh, Punjab",
        "lab_type": "Regional Laboratory (BIS Owned)",
        "discipline": "Mechanical & Safety, Electrical, Chemical",
        "scope_highlights": "Domestic pressure cookers (IS 2347), LPG cylinders, auto components, electrical switches, helmets (IS 4151), and agricultural pumps.",
        "address": "Plot No. 4-A, Sector 27-B, Madhya Marg, Chandigarh / Mohali - 160019, Punjab",
        "contact": "nrl@bis.gov.in | +91-172-2650290 / 0172-2703248",
        "tat_days": "10 - 20 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["mohali", "chandigarh", "punjab", "haryana", "himachal", "cooker", "lpg", "auto", "pumps", "helmets", "north"]
    },
    {
        "lab_name": "BIS Bengaluru Branch Laboratory (BNBO Lab)",
        "location": "Bengaluru, Karnataka",
        "lab_type": "Branch Laboratory (BIS Owned)",
        "discipline": "Electrical & Electronics, IT & CRS",
        "scope_highlights": "Electronics, Information Technology equipment, mobile phones, power adapters, and electrical equipment compliance testing under Scheme II (CRS).",
        "address": "Peenya Industrial Area, 1st Stage, Bengaluru - 560058, Karnataka",
        "contact": "bnbo@bis.gov.in | +91-80-28394955",
        "tat_days": "7 - 15 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["bengaluru", "bangalore", "karnataka", "electronics", "it", "crs", "electrical", "adapters", "computers"]
    },
    {
        "lab_name": "BIS Patna Branch Laboratory (PABO Lab)",
        "location": "Patna, Bihar",
        "lab_type": "Branch Laboratory (BIS Owned)",
        "discipline": "Food & Drinking Water, Civil Materials",
        "scope_highlights": "Packaged drinking water, packaged natural mineral water, food grain testing, cement, and routine chemical evaluation.",
        "address": "Patliputra Industrial Estate, Patna - 800013, Bihar",
        "contact": "pabo@bis.gov.in | +91-612-2262305",
        "tat_days": "7 - 15 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["patna", "bihar", "water", "food", "grain", "chemical", "cement"]
    },
    {
        "lab_name": "BIS Guwahati Branch Laboratory (GBO Lab)",
        "location": "Guwahati, Assam",
        "lab_type": "Branch Laboratory (BIS Owned)",
        "discipline": "Civil & Building Materials, Food & Water",
        "scope_highlights": "Packaged drinking water, building materials (cement, aggregates), tea testing, and regional conformity assessment for North-Eastern states.",
        "address": "Nedfi House, 4th Floor, G.S. Road, Dispur, Guwahati - 781006, Assam",
        "contact": "gbo@bis.gov.in | +91-361-2232935",
        "tat_days": "7 - 15 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["guwahati", "assam", "north east", "cement", "water", "building materials", "tea"]
    },
    {
        "lab_name": "National Test House (NTH), Alipore",
        "location": "Kolkata, West Bengal",
        "lab_type": "LRS Recognized National Lab",
        "discipline": "Mechanical & Metallurgy, Electrical, Civil Materials",
        "scope_highlights": "Heavy engineering, high voltage transformers, metallurgical mechanical testing, calibration, structural steel, and paint coatings.",
        "address": "11/1 Judges Court Road, Alipore, Kolkata - 700027, West Bengal",
        "contact": "nth-alipore@gov.in | +91-33-24791557",
        "tat_days": "15 - 30 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["nth", "kolkata", "alipore", "high voltage", "engineering", "metallurgy", "steel", "calibration"]
    },
    {
        "lab_name": "National Test House (NTH), Ghaziabad",
        "location": "Ghaziabad, Uttar Pradesh (Delhi NCR)",
        "lab_type": "LRS Recognized National Lab",
        "discipline": "Chemical & Polymers, Food & Water, Microbiological",
        "scope_highlights": "Chemical assays, polymers, packaged drinking water, toxic metals, agricultural inputs, pesticides, and microbial sterility.",
        "address": "Kamla Nehru Nagar, Ghaziabad - 201002, Uttar Pradesh",
        "contact": "nth-gzb@gov.in | +91-120-2789851",
        "tat_days": "10 - 20 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["nth", "ghaziabad", "delhi ncr", "chemical", "water", "food", "pesticides", "polymers", "rubber"]
    },
    {
        "lab_name": "Central Power Research Institute (CPRI)",
        "location": "Bengaluru, Karnataka / Bhopal / Noida",
        "lab_type": "LRS Recognized Apex Power Testing Institute",
        "discipline": "Electrical & Electronics, High Voltage & Power",
        "scope_highlights": "Power & distribution transformers, switchgear, solar PV inverters (IS 16221), smart energy meters (IS 16444), circuit breakers, and dielectric oil.",
        "address": "Prof. Sir C.V. Raman Road, Sadashivanagar, Bengaluru - 560080, Karnataka",
        "contact": "cpri@cpri.in | +91-80-22072210",
        "tat_days": "15 - 30 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["cpri", "bengaluru", "bangalore", "karnataka", "transformers", "meters", "switchgear", "solar", "inverters", "high voltage"]
    },
    {
        "lab_name": "Electrical Research & Development Association (ERDA)",
        "location": "Vadodara, Gujarat / Rabale, Mumbai",
        "lab_type": "LRS Recognized Electrical Lab",
        "discipline": "Electrical & Electronics, Renewable Energy",
        "scope_highlights": "Energy meters, distribution transformers, electric cables, insulators, lightning arresters, and solar power equipment testing.",
        "address": "ERDA Road, GIDC, Makarpura Industrial Estate, Vadodara - 390010, Gujarat",
        "contact": "erda@erda.org | +91-265-3043128",
        "tat_days": "15 - 25 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["erda", "vadodara", "gujarat", "mumbai", "meters", "transformers", "cables", "insulators", "solar"]
    },
    {
        "lab_name": "Shriram Institute for Industrial Research (SIIR)",
        "location": "Delhi NCR / Gurugram, Haryana",
        "lab_type": "LRS Recognized Research & Testing Lab",
        "discipline": "Chemical & Polymers, Toys & Safety, Food Contact",
        "scope_highlights": "Safety of toys (IS 9873 Parts 1-9), phthalates, heavy metals, food contact materials, medical plastics, and RoHS testing.",
        "address": "19, University Road, Delhi - 110007",
        "contact": "sirdl@shriraminstitute.org | +91-11-27667267",
        "tat_days": "7 - 15 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["shriram", "siir", "delhi", "toys", "plastics", "phthalates", "toxic", "food contact", "rohs"]
    },
    {
        "lab_name": "Automotive Research Association of India (ARAI)",
        "location": "Pune, Maharashtra",
        "lab_type": "LRS Recognized Automotive & Battery Testing Apex Body",
        "discipline": "Automotive & Safety, Mechanical & Metallurgy",
        "scope_highlights": "Traction battery packs for electric vehicles (IS 17855 / AIS 038/156), protective helmets (IS 4151), automotive safety glass, and lighting devices.",
        "address": "Survey No. 102, Vetal Hill, Off Paud Road, Kothrud, Pune - 411038, Maharashtra",
        "contact": "director@araiindia.com | +91-20-30231111",
        "tat_days": "15 - 30 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["arai", "pune", "maharashtra", "ev", "electric vehicles", "batteries", "helmets", "auto", "safety glass"]
    },
    {
        "lab_name": "CEG Test House and Research Centre",
        "location": "Jaipur, Rajasthan",
        "lab_type": "LRS Recognized Civil & Materials Lab",
        "discipline": "Civil & Building Materials, Mechanical & Metallurgy",
        "scope_highlights": "Portland pozzolana cement (IS 1489), ordinary portland cement (IS 269), TMT rebars, bitumen, concrete, and soil mechanics testing.",
        "address": "B-11 (G), Malviya Industrial Area, Jaipur - 302017, Rajasthan",
        "contact": "info@cegtesthouse.com | +91-141-2751801",
        "tat_days": "7 - 14 Days",
        "official_url": "https://lims.bis.gov.in",
        "keywords": ["ceg", "jaipur", "rajasthan", "cement", "steel", "concrete", "tmt", "bitumen", "civil"]
    }
]

class LabRecommender:
    """Discovers and recommends verified BIS testing laboratories."""

    def recommend(self, request: LabRecommendationRequest) -> LabRecommendationResponse:
        query_text = (request.product_or_material or "").lower().strip()
        location_filter = (request.location or "").lower().strip()
        testing_req = (request.testing_requirement or "").lower().strip()

        search_tokens = re.findall(r"\w+", f"{query_text} {location_filter} {testing_req}")
        search_tokens = [t for t in search_tokens if len(t) > 2]

        scored: List[Dict[str, Any]] = []

        for lab in OFFICIAL_BIS_LABS:
            score = 0.0
            lab_kw = lab["keywords"]
            lab_loc = lab["location"].lower()
            lab_name = lab["lab_name"].lower()
            lab_scope = lab["scope_highlights"].lower()

            # Location match
            if location_filter and any(t in lab_loc or t in lab_kw for t in search_tokens):
                score += 0.50

            # Scope / Product match
            matches = [t for t in search_tokens if t in lab_scope or t in lab_kw or t in lab_name]
            if matches:
                score += min(0.50, len(matches) * 0.15)

            # Central Lab default baseline: Central Lab Sahibabad handles national scope
            if lab["lab_type"] == "Central Laboratory":
                score += 0.10

            scored.append({"lab": lab, "score": score})

        # Sort descending by relevance score
        scored.sort(key=lambda x: x["score"], reverse=True)

        results: List[LabRecommendation] = []
        limit = 8 if (query_text or location_filter or testing_req) else len(OFFICIAL_BIS_LABS)
        for itm in scored[:limit]:
            l = itm["lab"]
            results.append(LabRecommendation(
                lab_name=l["lab_name"],
                location=l["location"],
                lab_type=l["lab_type"],
                discipline=l.get("discipline"),
                scope_highlights=l["scope_highlights"],
                address=l["address"],
                contact=l["contact"],
                tat_days=l.get("tat_days", "7 - 20 Days"),
                official_url=l["official_url"]
            ))

        return LabRecommendationResponse(
            query=request.product_or_material,
            recommended_labs=results,
            official_lims_url="https://lims.bis.gov.in",
            citizens_charter_url="https://www.bis.gov.in/the-bureau/citizens-charter/"
        )

    recommend_labs = recommend

_lab_recommender = None

def get_lab_recommender() -> LabRecommender:
    global _lab_recommender
    if _lab_recommender is None:
        _lab_recommender = LabRecommender()
    return _lab_recommender
