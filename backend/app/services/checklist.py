"""
Checklist Generation Service for BIS Saathi.
Generates structured, actionable, and statutory procedural checklists
for MSME certification, jeweller hallmarking, consumer complaints, and lab recognition.
"""

import re
from typing import Optional
from app.models.schemas import Checklist, ChecklistItem, IntentType

CHECKLIST_CATALOG = {
    IntentType.CERTIFICATION: Checklist(
        title="BIS Scheme I (ISI Mark) Application Checklist for Manufacturers",
        category="product_certification",
        steps=[
            ChecklistItem(
                id="CHK-01",
                title="Identify Applicable Indian Standard (ISS)",
                description="Verify the exact IS number (e.g. IS 14543, IS 12330) and confirm if your product is under a mandatory Quality Control Order (QCO).",
                mandatory=True,
                reference_clause="BIS Act 2016, Section 13"
            ),
            ChecklistItem(
                id="CHK-02",
                title="In-House Laboratory & Testing Capabilities",
                description="Install all testing equipment prescribed in the standard and maintain valid calibration certificates.",
                mandatory=True,
                reference_clause="Scheme I Regulations, Paragraph 3"
            ),
            ChecklistItem(
                id="CHK-03",
                title="Scheme of Inspection and Testing (SIT)",
                description="Adopt the standard BIS SIT specifying raw material checks, routine tests, and quality control records.",
                mandatory=True,
                reference_clause="Product Specific Guidelines (Product Manual)"
            ),
            ChecklistItem(
                id="CHK-04",
                title="Choose Procedure: Option 1 vs. Option 2",
                description="Option 1 (Normal Procedure: factory inspection first) or Option 2 (Simplified Procedure: submit test report from BIS recognized lab with application).",
                mandatory=True,
                reference_clause="Guidelines for Grant of Licence"
            ),
            ChecklistItem(
                id="CHK-05",
                title="Submit Online Application via Manakonline",
                description="Register on manakonline.in, upload factory layout, machinery list, manufacturing process flow, and pay ₹1,000 application fee.",
                mandatory=True,
                reference_clause="Manakonline Application Guidelines"
            ),
            ChecklistItem(
                id="CHK-06",
                title="Preliminary Factory Audit & Sample Testing",
                description="Facilitate BIS certification officer visit (₹7,000/man-day inspection fee) and witness sample testing.",
                mandatory=True,
                reference_clause="Conformity Assessment Regulations, 2018"
            )
        ]
    ),
    IntentType.HALLMARKING: Checklist(
        title="BIS Jewellers Registration Checklist for Selling Hallmarked Jewellery",
        category="hallmarking",
        steps=[
            ChecklistItem(
                id="JWL-01",
                title="Zero Registration Fee Benefit",
                description="Confirm eligibility for zero government registration fee under the simplified jeweller registration scheme.",
                mandatory=True,
                reference_clause="BIS Hallmarking Regulations 2018"
            ),
            ChecklistItem(
                id="JWL-02",
                title="Online Registration on Manakonline",
                description="Submit GSTIN certificate, PAN card of proprietor/company, and registered sales outlet address proof.",
                mandatory=True,
                reference_clause="Jewellers Registration Scheme Guidelines"
            ),
            ChecklistItem(
                id="JWL-03",
                title="Link with Recognized Assaying & Hallmarking Centre (AHC)",
                description="Select an authorized AHC in your district for submitting unhallmarked gold jewellery for 6-digit HUID laser marking.",
                mandatory=True,
                reference_clause="IS 15820"
            ),
            ChecklistItem(
                id="JWL-04",
                title="Verify Mandatory 3-Sign Hallmarking",
                description="Ensure all retail stock displays: 1) BIS Logo, 2) Purity mark (e.g. 22K916), 3) 6-digit alphanumeric HUID.",
                mandatory=True,
                reference_clause="Mandatory Hallmarking Order 2020"
            )
        ]
    ),
    IntentType.CONSUMER: Checklist(
        title="Filing a Complaint Against Spurious ISI or Substandard Hallmarking",
        category="consumer",
        steps=[
            ChecklistItem(
                id="CMP-01",
                title="Verify Mark on BIS Care App",
                description="Open BIS Care App and click 'Verify License Details' (for ISI mark) or 'Verify HUID' (for gold jewellery).",
                mandatory=True,
                reference_clause="BIS Care App Verification Guide"
            ),
            ChecklistItem(
                id="CMP-02",
                title="Collect Purchase Proof & Photos",
                description="Gather retail tax invoice showing GSTIN, CML/HUID number, clear photos of product and packaging.",
                mandatory=True,
                reference_clause="Consumer Protection Act & BIS Act 2016"
            ),
            ChecklistItem(
                id="CMP-03",
                title="Submit Complaint via App or Online Portal",
                description="Register complaint on bis.gov.in or BIS Care App with product description and store address.",
                mandatory=True,
                reference_clause="Online Complaint Registration Portal"
            ),
            ChecklistItem(
                id="CMP-04",
                title="Claim Shortfall Compensation (For Hallmarking)",
                description="If gold purity is lower than marked, claim statutory compensation of 2x the purity shortfall plus testing charges.",
                mandatory=True,
                reference_clause="Hallmarking Regulation 2018, Rule 12"
            )
        ]
    ),
    IntentType.LABS: Checklist(
        title="BIS Laboratory Recognition Scheme (LRS) Application Checklist",
        category="labs",
        steps=[
            ChecklistItem(
                id="LAB-01",
                title="NABL Accreditation Prerequisite",
                description="Obtain NABL accreditation as per ISO/IEC 17025 for specific Indian Standards.",
                mandatory=True,
                reference_clause="LRS 2020 Guidelines"
            ),
            ChecklistItem(
                id="LAB-02",
                title="Online Application on LIMS Portal",
                description="Submit application and scope of testing via lims.bis.gov.in with testing personnel resumes.",
                mandatory=True,
                reference_clause="LIMS User Manual"
            ),
            ChecklistItem(
                id="LAB-03",
                title="Proficiency Testing & Inter-Lab Comparison",
                description="Provide successful PT participation reports for the applied standard parameters.",
                mandatory=True,
                reference_clause="Laboratory Recognition Scheme 2020"
            )
        ]
    )
}

INTENT_TO_CHECKLIST = {
    IntentType.PRODUCT_CERTIFICATION: CHECKLIST_CATALOG[IntentType.CERTIFICATION],
    IntentType.CERTIFICATION_PROCESS: CHECKLIST_CATALOG[IntentType.CERTIFICATION],
    IntentType.COMPULSORY_CERTIFICATION: CHECKLIST_CATALOG[IntentType.CERTIFICATION],
    IntentType.LICENCE: CHECKLIST_CATALOG[IntentType.CERTIFICATION],
    IntentType.HALLMARKING: CHECKLIST_CATALOG[IntentType.HALLMARKING],
    IntentType.HUID: CHECKLIST_CATALOG[IntentType.HALLMARKING],
    IntentType.JEWELLER_REGISTRATION: CHECKLIST_CATALOG[IntentType.HALLMARKING],
    IntentType.CONSUMER_COMPLAINT: CHECKLIST_CATALOG[IntentType.CONSUMER],
    IntentType.ISI_MISUSE: CHECKLIST_CATALOG[IntentType.CONSUMER],
    IntentType.LABORATORY: CHECKLIST_CATALOG[IntentType.LABS],
    IntentType.TESTING: CHECKLIST_CATALOG[IntentType.LABS],
}

PROCEDURAL_TRIGGER_REGEX = re.compile(
    r"\b(give me (a )?checklist|step[- ]by[- ]step guide|show checklist|application checklist)\b",
    re.IGNORECASE
)

class ChecklistService:
    @staticmethod
    def should_generate(user_msg: str, explicit_flag: bool = False) -> bool:
        """Determines if a query requires an actionable checklist. Only triggers if explicitly toggled or requested."""
        return explicit_flag or bool(PROCEDURAL_TRIGGER_REGEX.search(user_msg))

    @staticmethod
    def get_checklist(intent: IntentType) -> Optional[Checklist]:
        """Returns the domain checklist matching the intent."""
        return INTENT_TO_CHECKLIST.get(intent) or CHECKLIST_CATALOG.get(intent)
