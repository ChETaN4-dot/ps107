"""
Official Service Navigation Service for BIS Saathi.
Generates structured action cards directing users to verified official BIS portals.
Enforces the safety principle: The assistant guides and clarifies, but does NOT pretend
to execute official statutory applications, filings, or licence grants.
"""

from typing import List
from app.models.schemas import SuggestedAction, IntentType, PersonaType

PORTAL_DIRECTORY = {
    IntentType.CERTIFICATION_PROCESS: SuggestedAction(
        title="Continue on Official BIS Manakonline Portal",
        description="Submit official application for BIS Grant of Licence under Scheme I (Option 1 or Option 2).",
        url="https://www.manakonline.in/MANAK/applicationManagementNew",
        badge="Official e-BIS Portal",
        action_type="portal_link"
    ),
    IntentType.COMPULSORY_CERTIFICATION: SuggestedAction(
        title="View Official Mandatory QCO Gazette List",
        description="Verify notified products under compulsory certification and statutory compliance dates.",
        url="https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        badge="Statutory Gazette List",
        action_type="portal_link"
    ),
    IntentType.JEWELLER_REGISTRATION: SuggestedAction(
        title="Register Jeweller on Manakonline (Zero Fee)",
        description="Complete instant online registration for selling hallmarked gold/silver jewellery.",
        url="https://www.manakonline.in/MANAK/jewellerRegistrationHome",
        badge="Zero-Fee Registration",
        action_type="portal_link"
    ),
    IntentType.HUID: SuggestedAction(
        title="Verify HUID on Official BIS Care App",
        description="Download BIS Care App to verify 6-digit alphanumeric HUID and check jeweller details.",
        url="https://play.google.com/store/apps/details?id=com.bis.bis_care",
        badge="Official Android/iOS App",
        action_type="verification"
    ),
    IntentType.CONSUMER_COMPLAINT: SuggestedAction(
        title="File Grievance on BIS Standard Promotion Portal",
        description="Submit official complaint with proof regarding substandard quality or fake ISI marks.",
        url="https://www.manakonline.in/MANAK/ComplaintsHome",
        badge="CMED Grievance Redressal",
        action_type="portal_link"
    ),
    IntentType.ISI_MISUSE: SuggestedAction(
        title="Report Spurious ISI Mark / Illegal Manufacturer",
        description="Discreetly report fake ISI misuse to BIS Central Vigilance & Enforcement Department.",
        url="https://www.bis.gov.in/consumer-overview/online-complaint-registration/?lang=en",
        badge="Search & Seizure Enforcement",
        action_type="portal_link"
    ),
    IntentType.STANDARD_SEARCH: SuggestedAction(
        title="Search & Read Standards on BIS Standards Portal",
        description="Search Indian Standards catalog (IS number, technical committees, and preview scope).",
        url="https://standards.bis.gov.in",
        badge="National Standards Portal",
        action_type="portal_link"
    ),
    IntentType.VERIFICATION: SuggestedAction(
        title="Search a BIS Licence (CML Number Lookup)",
        description="Verify validity, factory address, and scope of any 7-digit operative CML number.",
        url="https://www.manakonline.in/MANAK/SearchLicence",
        badge="Licence Registry",
        action_type="verification"
    ),
    IntentType.TESTING: SuggestedAction(
        title="BIS Citizen's Charter & Laboratory Testing",
        description="Review official sample testing turnaround timelines and LRS recognized laboratories.",
        url="https://www.bis.gov.in/the-bureau/citizens-charter/",
        badge="Citizen's Charter",
        action_type="portal_link"
    ),
    IntentType.LABORATORY: SuggestedAction(
        title="Laboratory Recognition Scheme (LRS) Portal",
        description="Access LIMS testing workflow and NABL accredited commercial test laboratories.",
        url="https://www.bis.gov.in/laboratory-overview/",
        badge="LRS Laboratory Portal",
        action_type="portal_link"
    )
}

class NavigationService:
    @staticmethod
    def get_actions(intent: IntentType, persona: PersonaType) -> List[SuggestedAction]:
        """Return relevant official action links based on intent and persona."""
        actions: List[SuggestedAction] = []
        
        # Primary intent action
        if intent in PORTAL_DIRECTORY:
            actions.append(PORTAL_DIRECTORY[intent])

        # Persona-specific secondary action
        if persona in [PersonaType.MSME, PersonaType.MANUFACTURER] and intent != IntentType.CERTIFICATION_PROCESS:
            actions.append(SuggestedAction(
                title="MSME Udyam Portal for Concessions",
                description="Register for 50% application fee and 10% marking fee concessions.",
                url="https://udyamregistration.gov.in",
                badge="Government Concession",
                action_type="portal_link"
            ))
        elif persona == PersonaType.CONSUMER and intent != IntentType.CONSUMER_COMPLAINT:
            actions.append(SuggestedAction(
                title="Download BIS Care Mobile App",
                description="Verify ISI marks, HUID codes, and check ongoing enforcement actions.",
                url="https://www.bis.gov.in/consumer-overview/bis-care-app/?lang=en",
                badge="Mobile App",
                action_type="verification"
            ))

        # Default fallback action if list is empty
        if not actions:
            actions.append(SuggestedAction(
                title="Visit Official Bureau of Indian Standards Portal",
                description="Explore all BIS conformity assessment schemes, guidelines, and branch offices.",
                url="https://www.bis.gov.in",
                badge="National Standards Body",
                action_type="portal_link"
            ))

        return actions[:2]
