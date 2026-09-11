// Complete Multilingual Localization Dictionary for BIS Saathi
// Bureau of Indian Standards Official AI Assistant
// Supported Languages: English (en), Hindi (hi), Hinglish (hinglish), Marathi (mr), Bengali (bn),
// Gujarati (gu), Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml), Punjabi (pa)

export type LanguageType = "en" | "hi" | "hinglish" | "mr" | "bn" | "gu" | "ta" | "te" | "kn" | "ml" | "pa";
export type PersonaType = "msme" | "consumer" | "manufacturer" | "jeweller" | "student" | "researcher" | "general";

export interface LanguageOption {
  id: LanguageType;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { id: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { id: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { id: "hinglish", name: "Hinglish", nativeName: "Hinglish (हिंदी + Eng)", flag: "🇮🇳" },
  { id: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { id: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { id: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { id: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { id: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { id: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { id: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { id: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
];

export const BROWSER_LANG_MAP: Record<LanguageType, string> = {
  en: "en-IN",
  hi: "hi-IN",
  hinglish: "hi-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  gu: "gu-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

export interface PersonaContent {
  id: PersonaType;
  label: string;
  iconName: string;
  tagline: string;
  description: string;
  quickActions: { label: string; iconName: string; query: string }[];
}

export interface TranslationDictionary {
  // Top utility bar
  govIndia: string;
  ministry: string;
  fontScale: string;
  voiceReadout: string;
  voiceOn: string;
  helpline: string;

  // Header & Brand
  bisTitle: string;
  bisHindiTitle: string;
  bisMotto: string;
  sihBadge: string;
  toggleSidebar: string;

  // Tabs
  tabAskBis: string;
  tabFindStandard: string;
  tabLabs: string;
  tabVerifyMarks: string;

  // Persona Dropdown
  personaHeader: string;
  personas: Record<PersonaType, { label: string; tagline: string; description: string; quickActions: { label: string; query: string }[] }>;

  // Language Dropdown
  languageHeader: string;

  // Live Ticker
  tickerLabel: string;
  tickerItems: string[];

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  badgeSource: string;
  badgeQco: string;
  badgeCare: string;
  badgeStack: string;

  // Chatbot UI
  newConsultation: string;
  consultationsTitle: string;
  searchHistoryPlaceholder: string;
  noPastChats: string;
  clearHistory: string;
  inputPlaceholder: string;
  micListening: string;
  micError: string;
  includeChecklist: string;
  send: string;
  suggestedQuestions: string;
  sourceConfidence: string;
  confHigh: string;
  confMed: string;
  confLow: string;
  citationsTitle: string;
  actionCopy: string;
  actionCopied: string;
  actionListen: string;
  actionStop: string;
  actionDownload: string;
  actionPrint: string;
  actionShare: string;
  checklistTitle: string;
  statutoryNotice: string;
  connectionError: string;

  // Find My Standard Tab
  findStandardTitle: string;
  findStandardSubtitle: string;
  findStandardSearchPlaceholder: string;
  findStandardSearchBtn: string;
  findStandardSearching: string;
  colStandard: string;
  colStatus: string;
  colMatchScore: string;
  colAction: string;
  qcoMandatory: string;
  voluntaryStandard: string;
  btnAskBisAbout: string;
  noStandardsFound: string;
  standardsCount: string;

  // Laboratories Tab
  labTitle: string;
  labSubtitle: string;
  labSearchProductPlaceholder: string;
  labSearchLocationPlaceholder: string;
  labSearchBtn: string;
  labSearching: string;
  labDisciplineAll: string;
  labDisciplineChemical: string;
  labDisciplineElectrical: string;
  labDisciplineMechanical: string;
  labDisciplineCivil: string;
  labDisciplineFood: string;
  labTat: string;
  labAddress: string;
  labContact: string;
  labScope: string;
  labOfficialLims: string;
  labResultsCount: string;

  // Verify Marks Tab
  verifyTitle: string;
  verifySubtitle: string;
  verifyTabIsi: string;
  verifyTabHuid: string;
  verifyTabCrs: string;
  verifyTabGrievance: string;
  verifyIsiHeading: string;
  verifyIsiDesc: string;
  verifyHuidHeading: string;
  verifyHuidDesc: string;
  verifyCrsHeading: string;
  verifyCrsDesc: string;
  verifyGrievanceHeading: string;
  verifyGrievanceDesc: string;
  verifyDownloadCareApp: string;

  // Footer
  footerDisclaimer: string;
  footerCopyright: string;
  footerLinks: { label: string; url: string }[];
}

export const UI_TRANSLATIONS: Record<LanguageType, TranslationDictionary> = {
  // ───────────────────────────────────────────────────────────────────
  // ENGLISH (en)
  // ───────────────────────────────────────────────────────────────────
  en: {
    govIndia: "GOVERNMENT OF INDIA",
    ministry: "MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION",
    fontScale: "Font:",
    voiceReadout: "Voice Readout",
    voiceOn: "(ON)",
    helpline: "Helpline: 1912",

    bisTitle: "BIS Saathi",
    bisHindiTitle: "बीआईएस साथी",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "Consultation History",

    tabAskBis: "Ask BIS",
    tabFindStandard: "Find My Standard",
    tabLabs: "Laboratories (LIMS)",
    tabVerifyMarks: "Verify Marks & HUID",

    personaHeader: "Select Stakeholder Persona",
    personas: {
      msme: {
        label: "MSME",
        tagline: "Get your product BIS-ready with 50% fee concessions & testing support.",
        description: "MSME (Product BIS-Ready & Concessions)",
        quickActions: [
          { label: "Find My Standard", query: "How can an MSME find the applicable Indian Standard for manufactured products?" },
          { label: "Option 2 Simplified Procedure", query: "Explain the step-by-step Option 2 simplified procedure for granting a manufacturing licence." },
          { label: "50% Fee Concessions", query: "What fee concessions and financial incentives are available for Micro and Small Enterprises under Scheme I?" },
          { label: "Empanelled Testing Labs", query: "Where can an MSME get products tested at BIS-recognized or empanelled laboratories?" },
        ],
      },
      consumer: {
        label: "Consumer",
        tagline: "Check before you buy. Verify ISI marks, 6-digit HUID & report violations.",
        description: "Consumer (Rights, Verification & Grievance)",
        quickActions: [
          { label: "Verify ISI & CML", query: "How do I verify if an ISI mark and CML licence number on a product is genuine on the BIS Care App?" },
          { label: "Verify Gold HUID", query: "What is 6-digit HUID and how can a consumer verify gold purity on the BIS Care App?" },
          { label: "File Grievance / Misuse", query: "How do I file a complaint with BIS CMED regarding misuse of ISI mark or spurious products?" },
          { label: "Mandatory Quality Marks", query: "Explain the official quality certification marks in India: ISI Mark, Hallmarking, and CRS registration." },
        ],
      },
      manufacturer: {
        label: "Manufacturer",
        tagline: "Navigate BIS Scheme I factory audits, in-house lab norms & QCO mandates.",
        description: "Manufacturer (Scheme I & Testing)",
        quickActions: [
          { label: "Applicable Standard", query: "How do I identify which Indian Standard applies to my manufactured product category?" },
          { label: "Compulsory QCOs", query: "Which product categories are subject to mandatory Quality Control Orders (QCOs)?" },
          { label: "Factory Audit Readiness", query: "What quality control testing equipment and in-house laboratory facilities are required for BIS factory audits?" },
          { label: "Scheme I Normal vs Simplified", query: "What are the regulatory differences between Option 1 (normal) and Option 2 (simplified) under Scheme I?" },
        ],
      },
      jeweller: {
        label: "Jeweller",
        tagline: "Your guide to zero-fee hallmarking registration, 6-digit HUID & AHC centers.",
        description: "Jeweller (HUID & Hallmarking)",
        quickActions: [
          { label: "6-Digit HUID Rules", query: "What are the statutory requirements for 6-digit alphanumeric HUID hallmarking on gold jewellery?" },
          { label: "Zero-Fee Registration", query: "What is the procedure and zero government fee policy for jeweller hallmarking registration on Manakonline?" },
          { label: "Assaying & Hallmarking (AHC)", query: "How do jewellers submit gold articles to BIS Assaying and Hallmarking Centres (AHCs) and track delivery?" },
          { label: "Purity Grades (IS 1417)", query: "What gold purity grades (14K, 18K, 20K, 22K, 23K, 24K) are permitted for hallmarking under IS 1417?" },
        ],
      },
      student: {
        label: "Student",
        tagline: "Learn BIS simply. Standards formulation, quality movements & consumer protection.",
        description: "Student / Academic (Standards & Quality)",
        quickActions: [
          { label: "What is BIS?", query: "What is the Bureau of Indian Standards and what is its statutory role under the BIS Act, 2016?" },
          { label: "Standards Formulation", query: "How are Indian Standards formulated, reviewed, and published by BIS Sectional Committees?" },
          { label: "Certification Types", query: "Explain the difference between product certification (ISI), system certification (ISO 9001), and compulsory registration (CRS)." },
          { label: "Citizen's Charter", query: "What statutory consumer protections and service timelines are defined in the BIS Citizen's Charter 2024?" },
        ],
      },
      researcher: {
        label: "Researcher",
        tagline: "Explore the Indian Standards catalog, technical committees & ISO alignment.",
        description: "Technical Researcher (Catalog & ISO Alignment)",
        quickActions: [
          { label: "Search Standards Catalog", query: "How can I search the catalog of Indian Standards by technical committee or division?" },
          { label: "Standards Metadata", query: "What metadata is maintained for Indian Standards (IS number, year, reaffirmation, and scope)?" },
          { label: "Gazette QCO Orders", query: "Where are official Gazette notifications and Quality Control Orders published?" },
          { label: "ISO/IEC Alignment", query: "How are international ISO/IEC standards harmonized into Indian Standards (IS/ISO)?" },
        ],
      },
      general: {
        label: "General Public",
        tagline: "How can BIS Saathi help today? Instant verified answers on Indian Standards & BIS services.",
        description: "General Public (Standards & Quality)",
        quickActions: [
          { label: "Find My Standard", query: "How do I find the applicable Indian Standard for a specific product?" },
          { label: "Verify ISI Mark", query: "How do I verify if an ISI mark and CML licence number on a product is genuine?" },
          { label: "Verify Gold HUID", query: "What is 6-digit HUID and how can consumers verify genuine hallmarked gold jewellery?" },
          { label: "50% MSME Concession", query: "What fee concessions are available for Micro and Small Enterprises applying for BIS licence?" },
        ],
      },
    },

    languageHeader: "Select Language",
    tickerLabel: "Live Gazette Ticker",
    tickerItems: [
      "QCO Mandate: Stainless Steel & Alloy Steel items require compulsory ISI marking under IS 6911 / IS 1786.",
      "MSME Relief: 50% marking fee concession active for Micro & Small Enterprises under Scheme I on Manakonline.",
      "Hallmarking Update: 6-Digit alphanumeric HUID mandatory for 14K, 18K, 20K, 22K, 23K, and 24K Gold Jewellery.",
      "Consumer Alert: Verify CML licence number and HUID authenticity directly on the BIS Care App before purchase.",
    ],

    heroTitle: "Bureau of Indian Standards Official AI Assistant",
    heroSubtitle: "Instant verified statutory guidance on Indian Standards, ISI Certification, 6-Digit HUID Hallmarking, Scheme I to IV, and LIMS Lab Discovery backed by the BIS Act, 2016.",
    badgeSource: "100% Source-Backed",
    badgeQco: "Active QCOs Included",
    badgeCare: "BIS Care 2.0 Ready",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "New Consultation",
    consultationsTitle: "Consultations",
    searchHistoryPlaceholder: "Search consultations...",
    noPastChats: "No past consultations found",
    clearHistory: "Clear All",
    inputPlaceholder: "Ask BIS Saathi about standards, certification, Option 2, HUID, labs...",
    micListening: "Listening... Speak your query",
    micError: "Speech recognition error. Please type your query.",
    includeChecklist: "Include Step-by-Step Checklist",
    send: "Send",
    suggestedQuestions: "Suggested Inquiries",
    sourceConfidence: "Source Confidence",
    confHigh: "HIGH (Verified)",
    confMed: "MEDIUM",
    confLow: "STATUTORY NOTICE",
    citationsTitle: "Verified Statutory Citations & Sources",
    actionCopy: "Copy",
    actionCopied: "Copied!",
    actionListen: "Listen (TTS)",
    actionStop: "Stop Audio",
    actionDownload: "Download",
    actionPrint: "Print",
    actionShare: "Share",
    checklistTitle: "Procedural Compliance Checklist",
    statutoryNotice: "Official BIS Guidance",
    connectionError: "Unable to reach the BIS Saathi backend. Please ensure FastAPI server is running on port 8000.",

    findStandardTitle: "Find My Standard — Indian Standards Catalog Recommender",
    findStandardSubtitle: "Enter your manufactured product, raw material, or electrical appliance to find matching Indian Standards (IS), compulsory QCO mandates, and certification eligibility.",
    findStandardSearchPlaceholder: "e.g., Packaged drinking water, Pressure cooker, Ceiling fan, Toys, Gold jewellery, Steel bars...",
    findStandardSearchBtn: "Search Standards",
    findStandardSearching: "Searching 741+ Standards...",
    colStandard: "Standard & Title",
    colStatus: "Compulsory Status",
    colMatchScore: "Match Score",
    colAction: "Action",
    qcoMandatory: "COMPULSORY QCO",
    voluntaryStandard: "VOLUNTARY STANDARD",
    btnAskBisAbout: "Ask BIS Guidance",
    noStandardsFound: "No standards matching query. Try typing common product terms like 'water', 'cables', 'cement', or 'cooker'.",
    standardsCount: "Found {count} matching standards in catalog",

    labTitle: "BIS LIMS Laboratory Discovery & Testing Network",
    labSubtitle: "Locate official BIS Central, Regional, and empanelled NABL-accredited testing laboratories across India with citizen charter turnaround times.",
    labSearchProductPlaceholder: "Filter by product or test discipline (e.g. Water, Steel, Chemical, Electrical)...",
    labSearchLocationPlaceholder: "Filter by location / city (e.g. Sahibabad, Mumbai, Chennai, Kolkata, Bengaluru)...",
    labSearchBtn: "Search Labs",
    labSearching: "Locating Labs...",
    labDisciplineAll: "All Disciplines",
    labDisciplineChemical: "Chemical & Polymers",
    labDisciplineElectrical: "Electrical & Electronics",
    labDisciplineMechanical: "Mechanical & Metals",
    labDisciplineCivil: "Civil & Construction",
    labDisciplineFood: "Microbiology & Food",
    labTat: "Turnaround Time (TAT)",
    labAddress: "Address",
    labContact: "Contact & Email",
    labScope: "Key Testing Scope",
    labOfficialLims: "Official LIMS Portal",
    labResultsCount: "Displaying {count} verified testing facilities",

    verifyTitle: "Statutory Marks Verification & Authenticity Guide",
    verifySubtitle: "Learn how to verify genuine ISI certification marks, 6-digit alphanumeric Gold HUID, and CRS electronic marks on the BIS Care App.",
    verifyTabIsi: "ISI Mark (Scheme I)",
    verifyTabHuid: "Gold Hallmarking (HUID)",
    verifyTabCrs: "CRS Registration",
    verifyTabGrievance: "Report Misuse / Grievance",
    verifyIsiHeading: "How to Verify ISI Mark & CML Licence Number",
    verifyIsiDesc: "Every genuine ISI-marked product must carry the IS standard number on top (e.g., IS 14543) and a 7 to 10 digit CML licence number at the bottom (e.g., CM/L-1234567). Verify licence validity on the BIS Care App under 'Verify Licence Details'.",
    verifyHuidHeading: "6-Digit Alphanumeric Gold Hallmarking (HUID)",
    verifyHuidDesc: "Mandatory hallmarked jewellery features 3 distinct stamps: (1) The BIS Logo, (2) Purity Grade (e.g., 22K916 or 18K750), and (3) A unique 6-digit alphanumeric HUID code (e.g., AB12CD). Verify purity and jeweller details instantly in the BIS Care App.",
    verifyCrsHeading: "Compulsory Registration Scheme (CRS) for Electronics",
    verifyCrsDesc: "IT and electronics products (mobile phones, laptops, power adapters) require CRS registration under Scheme II. Genuine articles display the standard BIS CRS logo with 'Registration No. R-XXXXXXXX' and 'is:13252' reference.",
    verifyGrievanceHeading: "Filing Grievances on Spurious Marks & Misuse",
    verifyGrievanceDesc: "If you detect counterfeit ISI marks, fake HUID hallmarking, or sub-standard products under mandatory QCOs, file a formal complaint via BIS Care App or email cmed@bis.gov.in. BIS Enforcement conducts search and seizure operations.",
    verifyDownloadCareApp: "Download Official BIS Care Mobile App",

    footerDisclaimer: "Statutory Disclaimer: BIS Saathi is an official AI assistant providing source-backed guidance based on the Bureau of Indian Standards Act, 2016 and published Indian Standards. For official legal certification filings and statutory compliance, always visit manakonline.in.",
    footerCopyright: "© 2026 Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, Food & Public Distribution, Government of India. All Rights Reserved.",
    footerLinks: [
      { label: "BIS Official Portal", url: "https://www.bis.gov.in" },
      { label: "Manakonline Portal", url: "https://www.manakonline.in" },
      { label: "LIMS Laboratory Portal", url: "https://lims.bis.gov.in" },
      { label: "e-BIS Standards Portal", url: "https://www.services.bis.gov.in" },
      { label: "Citizen's Charter", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // HINDI (hi) — हिन्दी
  // ───────────────────────────────────────────────────────────────────
  hi: {
    govIndia: "भारत सरकार | GOVERNMENT OF INDIA",
    ministry: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय",
    fontScale: "फ़ॉन्ट:",
    voiceReadout: "आवाज़ वाचन",
    voiceOn: "(सक्रिय)",
    helpline: "हेल्पलाइन: 1912",

    bisTitle: "बीआईएस साथी",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "परामर्श इतिहास",

    tabAskBis: "बीआईएस से पूछें",
    tabFindStandard: "मानक खोजें",
    tabLabs: "प्रयोगशालाएं (LIMS)",
    tabVerifyMarks: "चिह्न व HUID सत्यापन",

    personaHeader: "हितधारक प्रोफ़ाइल चुनें",
    personas: {
      msme: {
        label: "एमएसएमई (MSME)",
        tagline: "50% शुल्क छूट और परीक्षण सहायता के साथ अपने उत्पाद को बीआईएस-रेडी बनाएं।",
        description: "एमएसएमई (उत्पाद प्रमाणन एवं 50% छूट)",
        quickActions: [
          { label: "लागू मानक खोजें", query: "एमएसएमई निर्मित उत्पादों के लिए लागू भारतीय मानक कैसे खोज सकते हैं?" },
          { label: "विकल्प 2 सरलीकृत प्रक्रिया", query: "मैन्युफैक्चरिंग लाइसेंस देने की विकल्प 2 सरलीकृत प्रक्रिया विस्तार से बताएं।" },
          { label: "50% शुल्क रियायतें", query: "स्कीम I के तहत सूक्ष्म और लघु उद्यमों के लिए कौन सी शुल्क छूट उपलब्ध हैं?" },
          { label: "मान्यता प्राप्त प्रयोगशालाएं", query: "एमएसएमई बीआईएस-मान्यता प्राप्त प्रयोगशालाओं में उत्पाद परीक्षण कहां करा सकते हैं?" },
        ],
      },
      consumer: {
        label: "उपभोक्ता (Consumer)",
        tagline: "खरीदने से पहले जांचें। आईएसआई मार्क, 6-अंकीय HUID सत्यापित करें और शिकायत दर्ज करें।",
        description: "उपभोक्ता (अधिकार, सत्यापन एवं शिकायत)",
        quickActions: [
          { label: "ISI व CML सत्यापन", query: "बीआईएस केयर ऐप पर उत्पाद के आईएसआई मार्क और CML लाइसेंस नंबर का सत्यापन कैसे करें?" },
          { label: "स्वर्ण HUID सत्यापन", query: "6-अंकीय HUID क्या है और उपभोक्ता बीआईएस केयर ऐप पर सोने की शुद्धता कैसे जांचें?" },
          { label: "नकली मार्क की शिकायत", query: "आईएसआई मार्क के दुरुपयोग या घटिया उत्पादों की शिकायत बीआईएस में कैसे दर्ज करें?" },
          { label: "अनिवार्य गुणवत्ता चिह्न", query: "भारत में आधिकारिक गुणवत्ता प्रमाणन चिह्न: ISI मार्क, हॉलमार्किंग और CRS समझाएं।" },
        ],
      },
      manufacturer: {
        label: "निर्माता (Manufacturer)",
        tagline: "बीआईएस स्कीम I फैक्ट्री ऑडिट, इन-हाउस लैब मानदंड और क्यूसीओ आदेशों को समझें।",
        description: "निर्माता (स्कीम I एवं परीक्षण)",
        quickActions: [
          { label: "लागू भारतीय मानक", query: "मेरे उत्पाद श्रेणी पर कौन सा भारतीय मानक लागू होता है?" },
          { label: "अनिवार्य क्यूसीओ (QCO)", query: "किन उत्पाद श्रेणियों पर अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) लागू हैं?" },
          { label: "फैक्ट्री ऑडिट तैयारी", query: "बीआईएस फैक्ट्री ऑडिट के लिए कौन से परीक्षण उपकरण और इन-हाउस लैब आवश्यक हैं?" },
          { label: "विकल्प 1 बनाम विकल्प 2", query: "स्कीम I के तहत सामान्य (विकल्प 1) और सरलीकृत (विकल्प 2) में क्या अंतर है?" },
        ],
      },
      jeweller: {
        label: "ज्वैलर (Jeweller)",
        tagline: "शून्य-शुल्क हॉलमार्किंग पंजीकरण, 6-अंकीय HUID और AHC केंद्रों के लिए आपकी मार्गदर्शिका।",
        description: "ज्वैलर (HUID एवं हॉलमार्किंग)",
        quickActions: [
          { label: "6-अंकीय HUID नियम", query: "सोने के आभूषणों पर 6-अंकीय अल्फ़ान्यूमेरिक HUID हॉलमार्किंग के वैधानिक नियम क्या हैं?" },
          { label: "शून्य-शुल्क पंजीकरण", query: "मानकऑनलाइन पर ज्वैलर हॉलमार्किंग पंजीकरण की शून्य-शुल्क प्रक्रिया क्या है?" },
          { label: "AHC केंद्र सबमिशन", query: "ज्वैलर्स बीआईएस हॉलमार्किंग केंद्रों (AHC) पर सोने के आभूषण कैसे जमा करते हैं?" },
          { label: "शुद्धता श्रेणियां (IS 1417)", query: "IS 1417 के तहत हॉलमार्किंग के लिए कौन सी शुद्धता श्रेणियां (14K, 18K, 20K, 22K, 24K) मान्य हैं?" },
        ],
      },
      student: {
        label: "छात्र / शोधार्थी",
        tagline: "बीआईएस को सरलता से समझें। मानक निर्माण, गुणवत्ता आंदोलन और उपभोक्ता संरक्षण।",
        description: "छात्र / अकादमिक (मानक एवं गुणवत्ता)",
        quickActions: [
          { label: "बीआईएस क्या है?", query: "भारतीय मानक ब्यूरो क्या है और बीआईएस अधिनियम 2016 के तहत इसकी क्या भूमिका है?" },
          { label: "मानक निर्माण प्रक्रिया", query: "बीआईएस अनुभागीय समितियों द्वारा भारतीय मानक कैसे तैयार और प्रकाशित किए जाते हैं?" },
          { label: "प्रमाणन के प्रकार", query: "उत्पाद प्रमाणन (ISI), सिस्टम प्रमाणन (ISO) और CRS में क्या अंतर है?" },
          { label: "नागरिक चार्टर", query: "बीआईएस नागरिक चार्टर 2024 में कौन सी समय-सीमाएं और उपभोक्ता अधिकार दिए गए हैं?" },
        ],
      },
      researcher: {
        label: "शोधकर्ता (Researcher)",
        tagline: "भारतीय मानक कैटलॉग, तकनीकी समितियों और आईएसओ संरेखण का अन्वेषण करें।",
        description: "तकनीकी शोधकर्ता (कैटलॉग एवं आईएसओ)",
        quickActions: [
          { label: "मानक कैटलॉग खोज", query: "तकनीकी समिति या प्रभाग द्वारा भारतीय मानक कैटलॉग कैसे खोजें?" },
          { label: "मानक मेटाडेटा", query: "भारतीय मानकों के लिए कौन सा मेटाडेटा (IS नंबर, वर्ष, पुनः पुष्टि) रखा जाता है?" },
          { label: "राजपत्र QCO आदेश", query: "आधिकारिक राजपत्र अधिसूचनाएं और गुणवत्ता नियंत्रण आदेश कहां प्रकाशित होते हैं?" },
          { label: "ISO/IEC संरेखण", query: "अंतर्राष्ट्रीय ISO/IEC मानकों को भारतीय मानकों (IS/ISO) में कैसे संरेखित किया जाता है?" },
        ],
      },
      general: {
        label: "आम नागरिक (General)",
        tagline: "बीआईएस साथी आज आपकी क्या सहायता कर सकता है? भारतीय मानकों और सेवाओं पर त्वरित उत्तर।",
        description: "आम नागरिक (मानक एवं गुणवत्ता)",
        quickActions: [
          { label: "मानक खोजें", query: "किसी विशेष उत्पाद के लिए लागू भारतीय मानक कैसे खोजें?" },
          { label: "ISI मार्क जांचें", query: "उत्पाद पर आईएसआई मार्क और CML नंबर असली है या नहीं, कैसे सत्यापित करें?" },
          { label: "सोने का HUID जांचें", query: "6-अंकीय HUID क्या है और उपभोक्ता हॉलमार्क वाले असली सोने की जांच कैसे करें?" },
          { label: "50% एमएसएमई छूट", query: "बीआईएस लाइसेंस के लिए सूक्ष्म और लघु उद्यमों को क्या शुल्क छूट मिलती है?" },
        ],
      },
    },

    languageHeader: "भाषा चुनें (Select Language)",
    tickerLabel: "लाइव राजपत्र टिकर",
    tickerItems: [
      "क्यूसीओ आदेश: स्टेनलेस स्टील और एलॉय स्टील उत्पादों पर IS 6911 / IS 1786 के तहत अनिवार्य ISI मार्किंग जरूरी है।",
      "एमएसएमई राहत: मानकऑनलाइन पर स्कीम I के तहत सूक्ष्म एवं लघु उद्यमों के लिए 50% मार्किंग शुल्क छूट सक्रिय है।",
      "हॉलमार्किंग अपडेट: 14K, 18K, 20K, 22K, 23K और 24K सोने के आभूषणों के लिए 6-अंकीय अल्फ़ान्यूमेरिक HUID अनिवार्य है।",
      "उपभोक्ता सूचना: खरीदारी से पहले बीआईएस केयर ऐप पर CML लाइसेंस नंबर और HUID की प्रामाणिकता अवश्य जांचें।",
    ],

    heroTitle: "भारतीय मानक ब्यूरो का आधिकारिक एआई सहायक",
    heroSubtitle: "भारतीय मानक अधिनियम, 2016 द्वारा समर्थित भारतीय मानकों, आईएसआई प्रमाणन, 6-अंकीय HUID हॉलमार्किंग, स्कीम I से IV और LIMS लैब खोज पर त्वरित सत्यापित वैधानिक मार्गदर्शन।",
    badgeSource: "100% स्रोत-प्रमाणित",
    badgeQco: "सक्रिय क्यूसीओ शामिल",
    badgeCare: "बीआईएस केयर 2.0 तैयार",
    badgeStack: "फास्टएपीआई + क्रोमाडीबी",

    newConsultation: "नया परामर्श",
    consultationsTitle: "परामर्श इतिहास",
    searchHistoryPlaceholder: "इतिहास खोजें...",
    noPastChats: "कोई पिछला परामर्श नहीं मिला",
    clearHistory: "सभी साफ़ करें",
    inputPlaceholder: "बीआईएस साथी से मानकों, प्रमाणन, विकल्प 2, HUID, लैब के बारे में पूछें...",
    micListening: "सुन रहा हूँ... अपना प्रश्न बोलें",
    micError: "आवाज़ पहचान में त्रुटि। कृपया टाइप करें।",
    includeChecklist: "चरण-दर-चरण चेकलिस्ट शामिल करें",
    send: "भेजें",
    suggestedQuestions: "सुझाए गए प्रश्न",
    sourceConfidence: "स्रोत विश्वसनीयता",
    confHigh: "उच्च (सत्यापित)",
    confMed: "मध्यम",
    confLow: "वैधानिक सूचना",
    citationsTitle: "सत्यापित वैधानिक संदर्भ एवं स्रोत",
    actionCopy: "कॉपी",
    actionCopied: "कॉपी हो गया!",
    actionListen: "सुनें (TTS)",
    actionStop: "आवाज़ रोकें",
    actionDownload: "डाउनलोड",
    actionPrint: "प्रिंट",
    actionShare: "शेयर",
    checklistTitle: "प्रक्रियात्मक अनुपालन चेकलिस्ट",
    statutoryNotice: "आधिकारिक बीआईएस मार्गदर्शन",
    connectionError: "बीआईएस साथी बैकएंड से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि फास्टएपीआई सर्वर पोर्ट 8000 पर चल रहा है।",

    findStandardTitle: "मानक खोजें — भारतीय मानक कैटलॉग अनुशंसाकर्ता",
    findStandardSubtitle: "लागू भारतीय मानक (IS), अनिवार्य QCO आदेश और प्रमाणन पात्रता खोजने के लिए अपने उत्पाद या कच्चे माल का नाम दर्ज करें।",
    findStandardSearchPlaceholder: "उदा. पैकेजबंद पेयजल, प्रेशर कुकर, सीलिंग फैन, खिलौने, सोने के गहने, स्टील की छड़ें...",
    findStandardSearchBtn: "मानक खोजें",
    findStandardSearching: "741+ मानकों में खोज जारी...",
    colStandard: "मानक एवं शीर्षक",
    colStatus: "अनिवार्य स्थिति",
    colMatchScore: "मिलान स्कोर",
    colAction: "कार्रवाई",
    qcoMandatory: "अनिवार्य क्यूसीओ (QCO)",
    voluntaryStandard: "ऐच्छिक मानक",
    btnAskBisAbout: "बीआईएस से मार्गदर्शन लें",
    noStandardsFound: "कोई मानक नहीं मिला। कृपया 'पानी', 'केबल', 'सीमेंट', या 'कुकर' जैसे सामान्य उत्पाद शब्द लिखकर देखें।",
    standardsCount: "कैटलॉग में {count} संबंधित मानक मिले",

    labTitle: "बीआईएस LIMS प्रयोगशाला खोज एवं परीक्षण नेटवर्क",
    labSubtitle: "नागरिक चार्टर समय-सीमा के साथ पूरे भारत में आधिकारिक बीआईएस केंद्रीय, क्षेत्रीय और मान्यता प्राप्त परीक्षण प्रयोगशालाओं का पता लगाएं।",
    labSearchProductPlaceholder: "उत्पाद या परीक्षण क्षेत्र द्वारा फ़िल्टर करें (उदा. पानी, स्टील, रसायन, विद्युत)...",
    labSearchLocationPlaceholder: "स्थान / शहर द्वारा फ़िल्टर करें (उदा. साहिबाबाद, मुंबई, चेन्नई, कोलकाता)...",
    labSearchBtn: "प्रयोगशाला खोजें",
    labSearching: "प्रयोगशालाएं खोजी जा रही हैं...",
    labDisciplineAll: "सभी विषय",
    labDisciplineChemical: "रसायन एवं पॉलिमर",
    labDisciplineElectrical: "विद्युत एवं इलेक्ट्रॉनिक्स",
    labDisciplineMechanical: "यांत्रिक एवं धातु",
    labDisciplineCivil: "सिविल एवं निर्माण",
    labDisciplineFood: "सूक्ष्म जीव विज्ञान एवं खाद्य",
    labTat: "कार्य समापन समय (टीएटी)",
    labAddress: "पता",
    labContact: "संपर्क एवं ईमेल",
    labScope: "प्रमुख परीक्षण क्षेत्र",
    labOfficialLims: "आधिकारिक LIMS पोर्टल",
    labResultsCount: "{count} सत्यापित परीक्षण सुविधाएं प्रदर्शित",

    verifyTitle: "वैधानिक चिह्न सत्यापन एवं प्रामाणिकता मार्गदर्शिका",
    verifySubtitle: "बीआईएस केयर ऐप पर वास्तविक आईएसआई प्रमाणन चिह्नों, 6-अंकीय HUID और CRS इलेक्ट्रॉनिक चिह्नों को सत्यापित करने का तरीका जानें।",
    verifyTabIsi: "आईएसआई मार्क (स्कीम I)",
    verifyTabHuid: "स्वर्ण हॉलमार्किंग (HUID)",
    verifyTabCrs: "सीआरएस पंजीकरण",
    verifyTabGrievance: "दुरुपयोग / शिकायत दर्ज करें",
    verifyIsiHeading: "ISI मार्क एवं CML लाइसेंस नंबर कैसे सत्यापित करें",
    verifyIsiDesc: "प्रत्येक वास्तविक ISI-चिह्नित उत्पाद पर ऊपर IS मानक संख्या (उदा. IS 14543) और नीचे 7 से 10 अंकों का CML लाइसेंस नंबर (उदा. CM/L-1234567) होना अनिवार्य है। बीआईएस केयर ऐप में 'लाइसेंस विवरण सत्यापित करें' पर जाकर जांचें।",
    verifyHuidHeading: "6-अंकीय अल्फ़ान्यूमेरिक गोल्ड हॉलमार्किंग (HUID)",
    verifyHuidDesc: "अनिवार्य हॉलमार्क वाले आभूषणों पर 3 स्पष्ट निशान होते हैं: (1) बीआईएस लोगो, (2) शुद्धता ग्रेड (उदा. 22K916 या 18K750), और (3) अद्वितीय 6-अंकीय HUID कोड (उदा. AB12CD)। बीआईएस केयर ऐप में तुरंत शुद्धता जांचें।",
    verifyCrsHeading: "इलेक्ट्रॉनिक्स के लिए अनिवार्य पंजीकरण योजना (CRS)",
    verifyCrsDesc: "आईटी और इलेक्ट्रॉनिक्स उत्पादों (मोबाइल, लैपटॉप, एडेप्टर) को स्कीम II के तहत CRS पंजीकरण की आवश्यकता होती है। असली उत्पादों पर 'Registration No. R-XXXXXXXX' और 'is:13252' संदर्भ के साथ बीआईएस CRS लोगो होता है।",
    verifyGrievanceHeading: "नकली चिह्नों और घटिया गुणवत्ता की शिकायत",
    verifyGrievanceDesc: "यदि आपको नकली आईएसआई मार्क, फर्जी HUID या अनिवार्य QCOs का उल्लंघन दिखता है, तो बीआईएस केयर ऐप या cmed@bis.gov.in पर औपचारिक शिकायत दर्ज करें। बीआईएस प्रवर्तन टीम जब्ती और कानूनी कार्रवाई करती है।",
    verifyDownloadCareApp: "आधिकारिक बीआईएस केयर ऐप डाउनलोड करें",

    footerDisclaimer: "वैधानिक अस्वीकरण: बीआईएस साथी भारतीय मानक ब्यूरो अधिनियम, 2016 और प्रकाशित भारतीय मानकों पर आधारित स्रोत-समर्थित मार्गदर्शन प्रदान करने वाला एक आधिकारिक एआई सहायक है। आधिकारिक कानूनी प्रमाणन और आवेदन दाखिल करने के लिए हमेशा manakonline.in पर जाएं।",
    footerCopyright: "© 2026 भारतीय मानक ब्यूरो (BIS), उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय, भारत सरकार। सर्वाधिकार सुरक्षित।",
    footerLinks: [
      { label: "बीआईएस आधिकारिक पोर्टल", url: "https://www.bis.gov.in" },
      { label: "मानकऑनलाइन पोर्टल", url: "https://www.manakonline.in" },
      { label: "LIMS प्रयोगशाला पोर्टल", url: "https://lims.bis.gov.in" },
      { label: "ई-बीआईएस मानक पोर्टल", url: "https://www.services.bis.gov.in" },
      { label: "नागरिक चार्टर", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // HINGLISH (hinglish) — हिंदी + English
  // ───────────────────────────────────────────────────────────────────
  hinglish: {
    govIndia: "GOVERNMENT OF INDIA | भारत सरकार",
    ministry: "MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION",
    fontScale: "Font:",
    voiceReadout: "Voice Readout",
    voiceOn: "(ON)",
    helpline: "Helpline: 1912",

    bisTitle: "BIS Saathi",
    bisHindiTitle: "बीआईएस साथी",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "Consultation History",

    tabAskBis: "Ask BIS",
    tabFindStandard: "Find My Standard",
    tabLabs: "Laboratories (LIMS)",
    tabVerifyMarks: "Verify Marks & HUID",

    personaHeader: "Apna Persona Select Karein",
    personas: {
      msme: {
        label: "MSME (Small Business)",
        tagline: "Apne product ko BIS-ready banayein 50% fee concession aur testing support ke saath.",
        description: "MSME (Product BIS-Ready & 50% Concession)",
        quickActions: [
          { label: "Find My Standard", query: "MSME manufactured products ke liye applicable Indian Standard kaise find karein?" },
          { label: "Option 2 Simplified Process", query: "Manufacturing licence lene ka Option 2 simplified procedure step-by-step samjhayein." },
          { label: "50% Fee Concessions", query: "Scheme I ke under Micro aur Small Enterprises ko kya fee concession milta hai?" },
          { label: "Testing Laboratories", query: "MSME apne product ki testing BIS recognized labs me kahan karwa sakte hain?" },
        ],
      },
      consumer: {
        label: "Consumer (Grahak)",
        tagline: "Khareedne se pehle check karein. ISI mark, 6-digit HUID verify karein aur shikayat darj karein.",
        description: "Consumer (Rights, Verification & Grievance)",
        quickActions: [
          { label: "Verify ISI & CML", query: "BIS Care App par product ka ISI mark aur CML licence number genuine hai ya nahi kaise check karein?" },
          { label: "Verify Gold HUID", query: "6-digit HUID kya hai aur consumer BIS Care App par gold purity kaise verify karein?" },
          { label: "File Grievance / Misuse", query: "Fake ISI mark ya spurious products ki complaint BIS CMED me kaise file karein?" },
          { label: "Mandatory Quality Marks", query: "India me official quality certification marks (ISI, Hallmarking, CRS) explain karein." },
        ],
      },
      manufacturer: {
        label: "Manufacturer (Factory)",
        tagline: "BIS Scheme I factory audit, in-house lab rules aur QCO orders ko samjhein.",
        description: "Manufacturer (Scheme I & Testing)",
        quickActions: [
          { label: "Applicable Standard", query: "Mere manufactured product category ke liye kaun sa Indian Standard apply hota hai?" },
          { label: "Compulsory QCOs", query: "Kaun se product categories par mandatory Quality Control Orders (QCOs) lagaye gaye hain?" },
          { label: "Factory Audit Readiness", query: "BIS factory audit ke liye kya testing equipment aur in-house lab facilities chahiye?" },
          { label: "Option 1 vs Option 2", query: "Scheme I ke under Option 1 (normal) aur Option 2 (simplified) me kya farak hai?" },
        ],
      },
      jeweller: {
        label: "Jeweller (Sona Vyapari)",
        tagline: "Zero-fee hallmarking registration, 6-digit HUID aur AHC centers ke liye aapka guide.",
        description: "Jeweller (HUID & Hallmarking)",
        quickActions: [
          { label: "6-Digit HUID Rules", query: "Gold jewellery par 6-digit alphanumeric HUID hallmarking ke statutory rules kya hain?" },
          { label: "Zero-Fee Registration", query: "Manakonline par jeweller hallmarking registration ka zero-fee process kya hai?" },
          { label: "AHC Center Submission", query: "Jewellers BIS Assaying & Hallmarking Centres (AHCs) par gold articles kaise submit karte hain?" },
          { label: "Purity Grades (IS 1417)", query: "IS 1417 ke under hallmarking ke liye kaun se gold purity grades (14K, 18K, 20K, 22K, 24K) allowed hain?" },
        ],
      },
      student: {
        label: "Student / Academic",
        tagline: "BIS ko aasaani se samjhein. Standards kaise bante hain aur consumer rights kya hain.",
        description: "Student / Academic (Standards & Quality)",
        quickActions: [
          { label: "What is BIS?", query: "Bureau of Indian Standards kya hai aur BIS Act 2016 ke under iska kya role hai?" },
          { label: "Standards Formulation", query: "BIS Sectional Committees Indian Standards kaise formulate aur publish karti hain?" },
          { label: "Certification Types", query: "Product certification (ISI), system certification (ISO), aur CRS me kya difference hai?" },
          { label: "Citizen's Charter", query: "BIS Citizen's Charter 2024 me consumer ke kya rights aur service timelines hain?" },
        ],
      },
      researcher: {
        label: "Researcher",
        tagline: "Indian Standards catalog, technical committees aur ISO alignment search karein.",
        description: "Technical Researcher (Catalog & ISO)",
        quickActions: [
          { label: "Search Catalog", query: "Technical committee ya division ke hisaab se Indian Standards catalog kaise search karein?" },
          { label: "Standards Metadata", query: "Indian Standards ke liye kya metadata (IS number, year, reaffirmation) maintain hota hai?" },
          { label: "Gazette QCO Orders", query: "Official Gazette notifications aur Quality Control Orders kahan publish hote hain?" },
          { label: "ISO/IEC Alignment", query: "International ISO/IEC standards ko Indian Standards (IS/ISO) ke saath kaise align kiya jata hai?" },
        ],
      },
      general: {
        label: "General Public",
        tagline: "BIS Saathi aaj aapki kya help kar sakta hai? Indian Standards aur BIS services par instant verified answers.",
        description: "General Public (Standards & Quality)",
        quickActions: [
          { label: "Find My Standard", query: "Kisi specific product ke liye applicable Indian Standard kaise find karein?" },
          { label: "Verify ISI Mark", query: "Product par ISI mark aur CML licence number genuine hai ya fake kaise verify karein?" },
          { label: "Verify Gold HUID", query: "6-digit HUID kya hai aur genuine hallmarked gold jewellery kaise check karein?" },
          { label: "50% MSME Concession", query: "BIS licence apply karte waqt Micro aur Small Enterprises ko kya fee concession milta hai?" },
        ],
      },
    },

    languageHeader: "Language Select Karein",
    tickerLabel: "Live Gazette Ticker",
    tickerItems: [
      "QCO Mandate: Stainless Steel aur Alloy Steel items par IS 6911 / IS 1786 ke under compulsory ISI mark zaroori hai.",
      "MSME Relief: Manakonline par Scheme I ke under Micro & Small Enterprises ke liye 50% fee concession active hai.",
      "Hallmarking Update: 14K, 18K, 20K, 22K, 23K, aur 24K Gold Jewellery par 6-Digit alphanumeric HUID mandatory hai.",
      "Consumer Alert: Khareedari se pehle BIS Care App par CML licence number aur HUID zaroor verify karein.",
    ],

    heroTitle: "Bureau of Indian Standards Official AI Assistant",
    heroSubtitle: "Indian Standards, ISI Certification, 6-Digit HUID Hallmarking, Scheme I to IV, aur LIMS Labs par instant verified official guidance backed by BIS Act, 2016.",
    badgeSource: "100% Source-Backed",
    badgeQco: "Active QCOs Included",
    badgeCare: "BIS Care 2.0 Ready",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "New Consultation",
    consultationsTitle: "Consultations",
    searchHistoryPlaceholder: "Search consultations...",
    noPastChats: "Koi purana chat nahi mila",
    clearHistory: "Clear All",
    inputPlaceholder: "BIS Saathi se standards, certification, Option 2, HUID, labs ke baare me poochhein...",
    micListening: "Listening... Apna sawaal bolein",
    micError: "Mic transcription me error aayi. Please type karein.",
    includeChecklist: "Include Step-by-Step Checklist",
    send: "Send",
    suggestedQuestions: "Suggested Questions",
    sourceConfidence: "Source Confidence",
    confHigh: "HIGH (Verified)",
    confMed: "MEDIUM",
    confLow: "STATUTORY NOTICE",
    citationsTitle: "Verified Official Sources & Citations",
    actionCopy: "Copy",
    actionCopied: "Copied!",
    actionListen: "Listen (TTS)",
    actionStop: "Stop Audio",
    actionDownload: "Download",
    actionPrint: "Print",
    actionShare: "Share",
    checklistTitle: "Procedural Compliance Checklist",
    statutoryNotice: "Official BIS Guidance",
    connectionError: "BIS Saathi backend se connect nahi ho paya. Please ensure karein ki FastAPI server port 8000 par running hai.",

    findStandardTitle: "Find My Standard — Indian Standards Catalog Recommender",
    findStandardSubtitle: "Apna product ya raw material enter karein aur matching Indian Standards (IS), compulsory QCO rules aur certification eligibility dekhein.",
    findStandardSearchPlaceholder: "e.g., Packaged drinking water, Pressure cooker, Ceiling fan, Toys, Gold jewellery, Steel bars...",
    findStandardSearchBtn: "Search Standards",
    findStandardSearching: "741+ Standards me search ho raha hai...",
    colStandard: "Standard & Title",
    colStatus: "Compulsory Status",
    colMatchScore: "Match Score",
    colAction: "Action",
    qcoMandatory: "COMPULSORY QCO",
    voluntaryStandard: "VOLUNTARY STANDARD",
    btnAskBisAbout: "Ask BIS Guidance",
    noStandardsFound: "Koi standard match nahi hua. Common product words jaise 'water', 'cables', 'cement' type karke dekhein.",
    standardsCount: "Catalog me {count} matching standards mile",

    labTitle: "BIS LIMS Laboratory Discovery & Testing Network",
    labSubtitle: "Citizen charter turnaround times ke saath pure India me official BIS Central, Regional, aur NABL accredited labs locate karein.",
    labSearchProductPlaceholder: "Product ya discipline se filter karein (e.g. Water, Steel, Chemical, Electrical)...",
    labSearchLocationPlaceholder: "Location ya city se filter karein (e.g. Sahibabad, Mumbai, Chennai, Kolkata)...",
    labSearchBtn: "Search Labs",
    labSearching: "Labs search ho rahi hain...",
    labDisciplineAll: "All Disciplines",
    labDisciplineChemical: "Chemical & Polymers",
    labDisciplineElectrical: "Electrical & Electronics",
    labDisciplineMechanical: "Mechanical & Metals",
    labDisciplineCivil: "Civil & Construction",
    labDisciplineFood: "Microbiology & Food",
    labTat: "Turnaround Time (TAT)",
    labAddress: "Address",
    labContact: "Contact & Email",
    labScope: "Key Testing Scope",
    labOfficialLims: "Official LIMS Portal",
    labResultsCount: "{count} verified testing facilities display ho rahi hain",

    verifyTitle: "Statutory Marks Verification & Authenticity Guide",
    verifySubtitle: "BIS Care App par genuine ISI certification mark, 6-digit alphanumeric Gold HUID, aur CRS marks verify karne ka tarika dekhein.",
    verifyTabIsi: "ISI Mark (Scheme I)",
    verifyTabHuid: "Gold Hallmarking (HUID)",
    verifyTabCrs: "CRS Registration",
    verifyTabGrievance: "Report Violation / Grievance",
    verifyIsiHeading: "ISI Mark aur CML Licence Number kaise verify karein",
    verifyIsiDesc: "Har genuine ISI-marked product par upar IS standard number (e.g. IS 14543) aur neeche 7 se 10 digit ka CML licence number (e.g. CM/L-1234567) hota hai. BIS Care App me 'Verify Licence Details' par jakar check karein.",
    verifyHuidHeading: "6-Digit Alphanumeric Gold Hallmarking (HUID)",
    verifyHuidDesc: "Mandatory hallmarked jewellery par 3 stamps hote hain: (1) BIS Logo, (2) Purity Grade (e.g. 22K916 ya 18K750), aur (3) Unique 6-digit alphanumeric HUID code (e.g. AB12CD). BIS Care App me purity instantly check karein.",
    verifyCrsHeading: "Electronics ke liye Compulsory Registration Scheme (CRS)",
    verifyCrsDesc: "IT aur electronics products (mobile, laptop, power adapter) ko Scheme II ke under CRS registration chahiye hota hai. Genuine products par BIS CRS logo ke saath 'Registration No. R-XXXXXXXX' aur 'is:13252' reference hota hai.",
    verifyGrievanceHeading: "Spurious Marks aur Misuse ki Complaint",
    verifyGrievanceDesc: "Agar aapko koi fake ISI mark, fake HUID ya mandatory QCOs ka violation dikhe, to BIS Care App ya cmed@bis.gov.in par complaint file karein. BIS enforcement team investigation aur seizure karti hai.",
    verifyDownloadCareApp: "Download Official BIS Care Mobile App",

    footerDisclaimer: "Statutory Disclaimer: BIS Saathi Bureau of Indian Standards Act, 2016 par based official AI assistant hai. Legal certification aur application file karne ke liye hamesha manakonline.in par visit karein.",
    footerCopyright: "© 2026 Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, Food & Public Distribution, Government of India. All Rights Reserved.",
    footerLinks: [
      { label: "BIS Official Portal", url: "https://www.bis.gov.in" },
      { label: "Manakonline Portal", url: "https://www.manakonline.in" },
      { label: "LIMS Laboratory Portal", url: "https://lims.bis.gov.in" },
      { label: "e-BIS Standards Portal", url: "https://www.services.bis.gov.in" },
      { label: "Citizen's Charter", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // MARATHI (mr) — मराठी
  // ───────────────────────────────────────────────────────────────────
  mr: {
    govIndia: "भारत सरकार | GOVERNMENT OF INDIA",
    ministry: "ग्राहक व्यवहार, अन्न आणि सार्वजनिक वितरण मंत्रालय",
    fontScale: "फॉन्ट:",
    voiceReadout: "आवाज वाचन",
    voiceOn: "(सुरू)",
    helpline: "हेल्पलाइन: 1912",

    bisTitle: "बीआईएस साथी",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "सल्लामसलत इतिहास",

    tabAskBis: "BIS ला विचारा",
    tabFindStandard: "माझे मानक शोधा",
    tabLabs: "प्रयोगशाळा (LIMS)",
    tabVerifyMarks: "चिन्हे व HUID पडताळणी",

    personaHeader: "हितधारक प्रोफाइल निवडा",
    personas: {
      msme: {
        label: "MSME (सूक्ष्म व लघू उद्योग)",
        tagline: "५०% फी सवलत आणि चाचणी सहाय्यासह तुमचे उत्पादन BIS-तयार करा.",
        description: "MSME (उत्पादन प्रमाणीकरण व ५०% सवलत)",
        quickActions: [
          { label: "लागू मानक शोधा", query: "MSME उत्पादित उत्पादनांसाठी लागू भारतीय मानक कसे शोधू शकतात?" },
          { label: "पर्याय २ सोपी प्रक्रिया", query: "उत्पादन परवाना देण्याची पर्याय २ सुलभ प्रक्रिया स्पष्ट करा." },
          { label: "५०% फी सवलत", query: "योजना I अंतर्गत सूक्ष्म आणि लघु उद्योगांसाठी कोणत्या फी सवलती उपलब्ध आहेत?" },
          { label: "मान्यताप्राप्त प्रयोगशाळा", query: "MSME उत्पादनांची चाचणी BIS मान्यताप्राप्त लॅबमध्ये कुठे करू शकतात?" },
        ],
      },
      consumer: {
        label: "ग्राहक (Consumer)",
        tagline: "खरेदी करण्यापूर्वी तपासा. ISI मार्क, ६-अंकी HUID पडताळा आणि तक्रार दाखल करा.",
        description: "ग्राहक (हक्क, पडताळणी व तक्रार)",
        quickActions: [
          { label: "ISI व CML पडताळणी", query: "BIS Care App वर ISI मार्क आणि CML परवाना क्रमांक कसा पडताळायचा?" },
          { label: "सोने HUID पडताळणी", query: "६-अंकी HUID काय आहे आणि ग्राहक सोन्याची शुद्धता कशी तपासू शकतात?" },
          { label: "खोट्या मार्काची तक्रार", query: "ISI मार्कचा गैरवापर किंवा बनावट उत्पादनांबद्दल BIS कडे तक्रार कशी करावी?" },
          { label: "अनिवार्य गुणवत्ता चिन्हे", query: "भारतातील अधिकृत गुणवत्ता चिन्हे: ISI मार्क, हॉलमार्किंग आणि CRS स्पष्ट करा." },
        ],
      },
      manufacturer: {
        label: "उत्पादक (Manufacturer)",
        tagline: "BIS योजना I फॅक्टरी ऑडिट, इन-हाऊस लॅब नियम आणि QCO आदेश समजून घ्या.",
        description: "उत्पादक (योजना I आणि चाचणी)",
        quickActions: [
          { label: "लागू भारतीय मानक", query: "माझ्या उत्पादन श्रेणीसाठी कोणते भारतीय मानक लागू आहे?" },
          { label: "अनिवार्य QCO आदेश", query: "कोणत्या उत्पादन श्रेणींवर अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) लागू आहेत?" },
          { label: "फॅक्टरी ऑडिट तयारी", query: "BIS फॅक्टरी ऑडिटसाठी कोणती चाचणी उपकरणे आणि इन-हाऊस लॅब आवश्यक आहेत?" },
          { label: "पर्याय १ विरुद्ध पर्याय २", query: "योजना I अंतर्गत सामान्य आणि सुलभ प्रक्रियेत काय फरक आहे?" },
        ],
      },
      jeweller: {
        label: "सुवर्ण व्यावसायिक (Jeweller)",
        tagline: "शून्य-शुल्क हॉलमार्किंग नोंदणी, ६-अंकी HUID आणि AHC केंद्रांसाठी तुमचे मार्गदर्शक.",
        description: "ज्वेलर (HUID आणि हॉलमार्किंग)",
        quickActions: [
          { label: "६-अंकी HUID नियम", query: "सोन्याच्या दागिन्यांवर ६-अंकी HUID हॉलमार्किंगचे कायदेशीर नियम काय आहेत?" },
          { label: "शून्य-शुल्क नोंदणी", query: "Manakonline वर ज्वेलर हॉलमार्किंग नोंदणीची मोफत प्रक्रिया काय आहे?" },
          { label: "AHC केंद्र सबमिशन", query: "दागिने व्यावसायिक BIS हॉलमार्किंग केंद्रांवर सोने कसे जमा करतात?" },
          { label: "शुद्धता श्रेणी (IS 1417)", query: "IS 1417 अंतर्गत हॉलमार्किंगसाठी कोणत्या शुद्धता श्रेणी (14K ते 24K) वैध आहेत?" },
        ],
      },
      student: {
        label: "विद्यार्थी / संशोधक",
        tagline: "BIS सहज समजून घ्या. मानक निर्मिती, गुणवत्ता चळवळ आणि ग्राहक संरक्षण.",
        description: "विद्यार्थी (मानके व गुणवत्ता)",
        quickActions: [
          { label: "BIS काय आहे?", query: "भारतीय मानक ब्युरो काय आहे आणि BIS कायदा २०१६ अंतर्गत त्याची भूमिका काय आहे?" },
          { label: "मानक निर्मिती प्रक्रिया", query: "BIS तांत्रिक समित्यांद्वारे भारतीय मानके कशी तयार केली जातात?" },
          { label: "प्रमाणीकरणाचे प्रकार", query: "उत्पादन प्रमाणीकरण (ISI) आणि CRS मध्ये काय फरक आहे?" },
          { label: "नागरिक सनद", query: "BIS सिटीझन चार्टर २०२४ मध्ये कोणत्या सेवा कालमर्यादा दिल्या आहेत?" },
        ],
      },
      researcher: {
        label: "संशोधक (Researcher)",
        tagline: "भारतीय मानक कॅटलॉग, तांत्रिक समित्या आणि ISO संरेखन शोधा.",
        description: "तांत्रिक संशोधक (कॅटलॉग व ISO)",
        quickActions: [
          { label: "मानक कॅटलॉग शोधा", query: "तांत्रिक समितीनुसार भारतीय मानक कॅटलॉग कसा शोधायचा?" },
          { label: "मानक मेटाडेटा", query: "भारतीय मानकांसाठी कोणता मेटाडेटा राखला जातो?" },
          { label: "राजपत्र QCO आदेश", query: "अधिकृत राजपत्रातील गुणवत्ता नियंत्रण आदेश कुठे प्रसिद्ध केले जातात?" },
          { label: "ISO/IEC संरेखन", query: "आंतरराष्ट्रीय मानके भारतीय मानकांशी कशी सुसंगत केली जातात?" },
        ],
      },
      general: {
        label: "सामान्य नागरिक",
        tagline: "BIS साथी आज तुम्हाला कशी मदत करू शकते? भारतीय मानके आणि सेवांवर त्वरित उत्तरे.",
        description: "सामान्य नागरिक (मानके व गुणवत्ता)",
        quickActions: [
          { label: "मानक शोधा", query: "विशिष्ट उत्पादनासाठी लागू भारतीय मानक कसे शोधायचे?" },
          { label: "ISI मार्क तपासा", query: "उत्पादनावरील ISI मार्क आणि CML क्रमांक खरा आहे की नाही हे कसे तपासायचे?" },
          { label: "सोने HUID तपासा", query: "६-अंकी HUID काय आहे आणि खऱ्या हॉलमार्क सोन्याची तपासणी कशी करावी?" },
          { label: "५०% MSME सवलत", query: "BIS परवान्यासाठी सूक्ष्म आणि लघु उद्योगांना काय फी सवलत मिळते?" },
        ],
      },
    },

    languageHeader: "भाषा निवडा (Select Language)",
    tickerLabel: "थेट राजपत्र टिकर",
    tickerItems: [
      "QCO आदेश: स्टेनलेस स्टील उत्पादनांवर IS 6911 / IS 1786 अंतर्गत अनिवार्य ISI मार्किंग आवश्यक आहे.",
      "MSME दिलासा: Manakonline वर सूक्ष्म व लघू उद्योगांसाठी ५०% फी सवलत सक्रिय आहे.",
      "हॉलमार्किंग अपडेट: १४K ते २४K सोन्याच्या दागिन्यांसाठी ६-अंकी HUID अनिवार्य आहे.",
      "ग्राहक सूचना: खरेदीपूर्वी BIS Care App वर CML परवाना क्रमांक आणि HUID ची सत्यता तपासा.",
    ],

    heroTitle: "भारतीय मानक ब्युरो अधिकृत AI सहाय्यक",
    heroSubtitle: "भारतीय मानके, ISI प्रमाणीकरण, ६-अंकी HUID हॉलमार्किंग आणि प्रयोगशाळा शोधावर अधिकृत वैधानिक मार्गदर्शन.",
    badgeSource: "१००% स्रोत-समर्थित",
    badgeQco: "सक्रिय QCO समाविष्ट",
    badgeCare: "BIS Care २.० तयार",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "नवीन सल्लामसलत",
    consultationsTitle: "सल्लामसलत इतिहास",
    searchHistoryPlaceholder: "इतिहास शोधा...",
    noPastChats: "मागील सल्लामसलत आढळली नाही",
    clearHistory: "सर्व साफ करा",
    inputPlaceholder: "BIS साथीला मानके, प्रमाणीकरण, HUID, लॅबबद्दल विचारा...",
    micListening: "ऐकत आहे... तुमचा प्रश्न बोला",
    micError: "आवाज ओळखण्यात त्रुटी. कृपया टाइप करा.",
    includeChecklist: "तपशीलवार चेकलिस्ट समाविष्ट करा",
    send: "पाठवा",
    suggestedQuestions: "सुचवलेले प्रश्न",
    sourceConfidence: "स्रोत विश्वासार्हता",
    confHigh: "उच्च (सत्यापित)",
    confMed: "मध्यम",
    confLow: "वैधानिक सूचना",
    citationsTitle: "सत्यापित वैधानिक संदर्भ",
    actionCopy: "कॉपी करा",
    actionCopied: "कॉपी झाले!",
    actionListen: "ऐका (TTS)",
    actionStop: "आवाज थांबवा",
    actionDownload: "डाउनलोड",
    actionPrint: "प्रिंट",
    actionShare: "शेअर",
    checklistTitle: "प्रक्रियात्मक अनुपालन चेकलिस्ट",
    statutoryNotice: "अधिकृत BIS मार्गदर्शन",
    connectionError: "BIS साथी सर्व्हरशी कनेक्ट होऊ शकले नाही. कृपया सर्व्हर तपासा.",

    findStandardTitle: "माझे मानक शोधा — भारतीय मानक कॅटलॉग",
    findStandardSubtitle: "लागू भारतीय मानक (IS) आणि अनिवार्य QCO आदेश शोधण्यासाठी उत्पादनाचे नाव टाका.",
    findStandardSearchPlaceholder: "उदा. पिण्याचे पाणी, प्रेशर कुकर, पंखा, खेळणी, सोन्याचे दागिने, स्टील...",
    findStandardSearchBtn: "मानक शोधा",
    findStandardSearching: "७४१+ मानकांमध्ये शोध सुरू आहे...",
    colStandard: "मानक आणि शीर्षक",
    colStatus: "अनिवार्य स्थिती",
    colMatchScore: "मॅच स्कोअर",
    colAction: "कृती",
    qcoMandatory: "अनिवार्य QCO",
    voluntaryStandard: "ऐच्छिक मानक",
    btnAskBisAbout: "BIS मार्गदर्शन मिळवा",
    noStandardsFound: "कोणतेही मानक सापडले नाही. 'पाणी', 'केबल', 'सिमेंट' असे शब्द शोधून पहा.",
    standardsCount: "कॅटलॉगमध्ये {count} संबंधित मानके सापडली",

    labTitle: "BIS LIMS प्रयोगशाळा शोध नेटवर्क",
    labSubtitle: "भारतातील अधिकृत BIS आणि NABL मान्यताप्राप्त प्रयोगशाळा शोधा.",
    labSearchProductPlaceholder: "उत्पादन किंवा विषयानुसार शोधा...",
    labSearchLocationPlaceholder: "शहर किंवा राज्यानुसार शोधा...",
    labSearchBtn: "लॅब शोधा",
    labSearching: "लॅब शोधत आहे...",
    labDisciplineAll: "सर्व विषय",
    labDisciplineChemical: "रासायनिक व पॉलिमर",
    labDisciplineElectrical: "विद्युत व इलेक्ट्रॉनिक्स",
    labDisciplineMechanical: "यांत्रिक व धातू",
    labDisciplineCivil: "सिव्हिल व बांधकाम",
    labDisciplineFood: "अन्न व सूक्ष्मजीवशास्त्र",
    labTat: "काम पूर्ण होण्याची वेळ (TAT)",
    labAddress: "पत्ता",
    labContact: "संपर्क व ईमेल",
    labScope: "चाचणी व्याप्ती",
    labOfficialLims: "अधिकृत LIMS पोर्टल",
    labResultsCount: "{count} अधिकृत चाचणी लॅब दाखवत आहे",

    verifyTitle: "वैधानिक चिन्हे पडताळणी मार्गदर्शक",
    verifySubtitle: "BIS Care App वर खरे ISI मार्क, ६-अंकी HUID आणि CRS चिन्हे कशी तपासायची ते शिका.",
    verifyTabIsi: "ISI मार्क (योजना I)",
    verifyTabHuid: "सोने हॉलमार्किंग (HUID)",
    verifyTabCrs: "CRS नोंदणी",
    verifyTabGrievance: "तक्रार दाखल करा",
    verifyIsiHeading: "ISI मार्क आणि CML परवाना कसा तपासायचा",
    verifyIsiDesc: "प्रत्येक खऱ्या उत्पादनावर वर IS मानक क्रमांक आणि खाली CML परवाना क्रमांक असतो. BIS Care App मध्ये याची सत्यता पडताळा.",
    verifyHuidHeading: "६-अंकी HUID सुवर्ण हॉलमार्किंग",
    verifyHuidDesc: "दागिन्यांवर BIS लोगो, शुद्धता आणि ६-अंकी HUID कोड असतो. BIS Care App मध्ये शुद्धतेची त्वरित खात्री करा.",
    verifyCrsHeading: "इलेक्ट्रॉनिक्ससाठी CRS नोंदणी",
    verifyCrsDesc: "मोबाईल, लॅपटॉप उत्पादनांवर 'Registration No. R-XXXXXXXX' सह CRS लोगो असणे बंधनकारक आहे.",
    verifyGrievanceHeading: "बनावट चिन्हांची तक्रार दाखल करणे",
    verifyGrievanceDesc: "बनावट ISI मार्क किंवा खोट्या हॉलमार्किंगची तक्रार BIS Care App द्वारे किंवा cmed@bis.gov.in वर करा.",
    verifyDownloadCareApp: "अधिकृत BIS Care App डाउनलोड करा",

    footerDisclaimer: "वैधानिक अस्वीकरण: BIS साथी हे भारतीय मानक ब्युरो कायदा २०१६ वर आधारित AI सहाय्यक आहे. अधिकृत अर्जांसाठी manakonline.in ला भेट द्या.",
    footerCopyright: "© २०२६ भारतीय मानक ब्युरो (BIS), भारत सरकार. सर्व हक्क राखीव.",
    footerLinks: [
      { label: "BIS अधिकृत पोर्टल", url: "https://www.bis.gov.in" },
      { label: "Manakonline पोर्टल", url: "https://www.manakonline.in" },
      { label: "LIMS पोर्टल", url: "https://lims.bis.gov.in" },
      { label: "नागरिक सनद", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // BENGALI (bn) — বাংলা
  // ───────────────────────────────────────────────────────────────────
  bn: {
    govIndia: "ভারত সরকার | GOVERNMENT OF INDIA",
    ministry: "ভোক্তা বিষয়ক, খাদ্য ও গণবন্টন মন্ত্রক",
    fontScale: "হরফ:",
    voiceReadout: "ভয়েস রিডআউট",
    voiceOn: "(চালু)",
    helpline: "হেল্পলাইন: ১৯১২",

    bisTitle: "বিআইএস সাথী",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "মানক: পথপ্রদর্শক:",
    sihBadge: "",
    toggleSidebar: "পরামর্শের ইতিহাস",

    tabAskBis: "BIS কে জিজ্ঞাসা করুন",
    tabFindStandard: "আমার মান খুঁজুন",
    tabLabs: "গবেষণাগার (LIMS)",
    tabVerifyMarks: "চিহ্ন ও HUID যাচাই",

    personaHeader: "আপনার স্টেকহোল্ডার প্রোফাইল বাছুন",
    personas: {
      msme: {
        label: "MSME (ক্ষুদ্র ও মাঝারি শিল্প)",
        tagline: "৫০% ফি ছাড় ও পরীক্ষার সহায়তা নিয়ে আপনার পণ্য BIS-প্রস্তুত করুন।",
        description: "MSME (পণ্য সার্টিফিকেশন ও ৫০% ছাড়)",
        quickActions: [
          { label: "প্রযোজ্য মান খুঁজুন", query: "MSME উৎপাদিত পণ্যের জন্য প্রযোজ্য ভারতীয় মান কীভাবে খুঁজবেন?" },
          { label: "বিকল্প ২ সহজ প্রক্রিয়া", query: "ম্যানুফ্যাকচারিং লাইসেন্স পাওয়ার বিকল্প ২ সহজ প্রক্রিয়াটি ব্যাখ্যা করুন।" },
          { label: "৫০% ফি ছাড়", query: "স্কিম ১ এর অধীনে ক্ষুদ্র শিল্পের জন্য কী কী ফি ছাড় রয়েছে?" },
          { label: "পরীক্ষাগার সন্ধান", query: "MSME অনুমোদিত ল্যাবে পণ্যের গুণমান পরীক্ষা কোথায় করাতে পারে?" },
        ],
      },
      consumer: {
        label: "ভোক্তা / ক্রেতা (Consumer)",
        tagline: "কেনার আগে যাচাই করুন। ISI মার্ক, ৬-সংখ্যার HUID পরীক্ষা করুন এবং অভিযোগ দায়ের করুন।",
        description: "ভোক্তা (অধিকার, যাচাই ও অভিযোগ)",
        quickActions: [
          { label: "ISI ও CML যাচাই", query: "BIS Care অ্যাপে পণ্যের ISI মার্ক ও CML লাইসেন্স নম্বর কীভাবে যাচাই করবেন?" },
          { label: "সোনার HUID যাচাই", query: "৬-সংখ্যার HUID কী এবং ক্রেতারা সোনার বিশুদ্ধতা কীভাবে যাচাই করবেন?" },
          { label: "নকল মার্কের অভিযোগ", query: "নকল ISI মার্ক বা নিম্নমানের পণ্যের বিরুদ্ধে BIS-এ কীভাবে অভিযোগ করবেন?" },
          { label: "বাধ্যতামূলক কোয়ালিটি মার্ক", query: "ভারতে অফিসিয়াল গুণমান সার্টিফিকেশন মার্কগুলি (ISI, হলমার্ক, CRS) ব্যাখ্যা করুন।" },
        ],
      },
      manufacturer: {
        label: "প্রস্তুতকারক (Manufacturer)",
        tagline: "BIS স্কিম ১ কারখানা অডিট, ইন-হাউস ল্যাব নিয়ম ও QCO নির্দেশিকা জানুন।",
        description: "প্রস্তুতকারক (স্কিম ১ ও পরীক্ষা)",
        quickActions: [
          { label: "প্রযোজ্য মান", query: "আমার পণ্যের জন্য কোন ভারতীয় মান প্রযোজ্য?" },
          { label: "বাধ্যতামূলক QCO", query: "কোন কোন পণ্যে কোয়ালিটি কন্ট্রোল অর্ডার (QCO) বাধ্যতামূলক?" },
          { label: "কারখানা অডিট প্রস্তুতি", query: "BIS কারখানা অডিটের জন্য কী কী পরীক্ষার সরঞ্জাম প্রয়োজন?" },
          { label: "বিকল্প ১ বনাম বিকল্প ২", query: "স্কিম ১ এর সাধারণ এবং সহজ প্রক্রিয়ার মধ্যে পার্থক্য কী?" },
        ],
      },
      jeweller: {
        label: "জুয়েলার (Jeweller)",
        tagline: "বিনামূল্যে হলমার্কিং রেজিস্ট্রেশন, ৬-সংখ্যার HUID ও AHC কেন্দ্র গাইড।",
        description: "জুয়েলার (HUID ও হলমার্কিং)",
        quickActions: [
          { label: "৬-সংখ্যার HUID নিয়ম", query: "সোনার গয়নায় ৬-সংখ্যার HUID হলমার্কিংয়ের সরকারি নিয়ম কী?" },
          { label: "বিনামূল্যে রেজিস্ট্রেশন", query: "Manakonline পোর্টালে জুয়েলার হলমার্কিং রেজিস্ট্রেশনের নিয়ম কী?" },
          { label: "AHC কেন্দ্র প্রক্রিয়া", query: "জুয়েলাররা কীভাবে হলমার্কিং সেন্টারে সোনা জমা দেন?" },
          { label: "বিশুদ্ধতার গ্রেড (IS 1417)", query: "IS 1417 এর অধীনে হলমার্কিংয়ের জন্য কোন কোন ক্যারেট অনুমোদিত?" },
        ],
      },
      student: {
        label: "শিক্ষার্থী / গবেষক",
        tagline: "সহজে BIS বুঝুন। মান প্রণয়ন, গুণমান আন্দোলন ও ভোক্তা সুরক্ষা।",
        description: "শিক্ষার্থী (মান ও গুণমান)",
        quickActions: [
          { label: "BIS কী?", query: "ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস কী এবং BIS আইন ২০১৬ এর আওতায় এর ভূমিকা কী?" },
          { label: "মান প্রণয়ন প্রক্রিয়া", query: "BIS কমিটিগুলি কীভাবে ভারতীয় মান প্রস্তুত ও প্রকাশ করে?" },
          { label: "সার্টিফিকেশনের প্রকার", query: "পণ্য সার্টিফিকেশন (ISI) এবং CRS এর মধ্যে পার্থক্য কী?" },
          { label: "সিটিজেন চার্টার", query: "BIS সিটিজেন চার্টার ২০২৪-এ ভোক্তাদের কী কী অধিকার দেওয়া হয়েছে?" },
        ],
      },
      researcher: {
        label: "গবেষক (Researcher)",
        tagline: "ভারতীয় মানের ক্যাটালগ, কারিগরি কমিটি ও ISO মান অন্বেষণ করুন।",
        description: "কারিগরি গবেষক (ক্যাটালগ ও ISO)",
        quickActions: [
          { label: "মান ক্যাটালগ অনুসন্ধান", query: "কমিটি অনুযায়ী ভারতীয় মানের ক্যাটালগ কীভাবে খুঁজবেন?" },
          { label: "মানের মেটাডেটা", query: "ভারতীয় মানের কী কী মেটাডেটা সংরক্ষিত থাকে?" },
          { label: "গেজেট QCO আদেশ", query: "অফিসিয়াল গেজেট বিজ্ঞপ্তি কোথায় প্রকাশিত হয়?" },
          { label: "ISO/IEC সামঞ্জস্য", query: "আন্তর্জাতিক মান কীভাবে ভারতীয় মানের সাথে সামঞ্জস্যপূর্ণ করা হয়?" },
        ],
      },
      general: {
        label: "সাধারণ জনগণ",
        tagline: "BIS সাথী আজ আপনাকে কীভাবে সাহায্য করতে পারে? ভারতীয় মান ও সেবার সঠিক উত্তর।",
        description: "সাধারণ জনগণ (মান ও গুণমান)",
        quickActions: [
          { label: "মান খুঁজুন", query: "নির্দিষ্ট পণ্যের জন্য প্রযোজ্য ভারতীয় মান কীভাবে খুঁজবেন?" },
          { label: "ISI মার্ক যাচাই", query: "পণ্যে থাকা ISI মার্ক আসল কিনা তা কীভাবে নিশ্চিত করবেন?" },
          { label: "সোনার HUID যাচাই", query: "৬-সংখ্যার HUID কী এবং আসল হলমার্ক সোনা কীভাবে চিনবেন?" },
          { label: "৫০% MSME ছাড়", query: "BIS লাইসেন্স নেওয়ার ক্ষেত্রে ক্ষুদ্র শিল্পের জন্য কী ফি ছাড় রয়েছে?" },
        ],
      },
    },

    languageHeader: "ভাষা নির্বাচন করুন (Select Language)",
    tickerLabel: "লাইভ গেজেট টিকার",
    tickerItems: [
      "QCO আদেশ: স্টেইনলেস স্টিল পণ্যে IS 6911 / IS 1786 এর অধীনে বাধ্যতামূলক ISI মার্কিং আবশ্যক।",
      "MSME স্বস্তি: Manakonline পোর্টালে ক্ষুদ্র শিল্পের জন্য ৫০% ফি ছাড় সক্রিয় রয়েছে।",
      "হলমার্কিং আপডেট: ১৪K থেকে ২৪K সোনার গয়নায় ৬-সংখ্যার HUID বাধ্যতামূলক।",
      "ভোক্তা সতর্কতা: কেনাকাটার আগে BIS Care অ্যাপে CML লাইসেন্স নম্বর ও HUID যাচাই করুন।",
    ],

    heroTitle: "ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস অফিসিয়াল এআই সহকারী",
    heroSubtitle: "ভারতীয় মান, ISI সার্টিফিকেশন, ৬-সংখ্যার HUID হলমার্কিং এবং গবেষণাগার অনুসন্ধানে নির্ভরযোগ্য নির্দেশিকা।",
    badgeSource: "১০০% উৎস-সমর্থিত",
    badgeQco: "সক্রিয় QCO অন্তর্ভুক্ত",
    badgeCare: "BIS Care ২.০ প্রস্তুত",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "নতুন পরামর্শ",
    consultationsTitle: "পরামর্শের ইতিহাস",
    searchHistoryPlaceholder: "ইতিহাস খুঁজুন...",
    noPastChats: "পূর্ববর্তী কোনো পরামর্শ পাওয়া যায়নি",
    clearHistory: "সব মুছুন",
    inputPlaceholder: "BIS সাথীকে মান, লাইসেন্স, HUID বা ল্যাব সম্পর্কে জিজ্ঞাসা করুন...",
    micListening: "শুনছি... আপনার প্রশ্ন বলুন",
    micError: "ভয়েস রিকগনিশনে ত্রুটি। দয়া করে টাইপ করুন।",
    includeChecklist: "ধাপভিত্তিক চেকলিস্ট অন্তর্ভুক্ত করুন",
    send: "পাঠান",
    suggestedQuestions: "প্রস্তাবিত প্রশ্নাবলী",
    sourceConfidence: "উৎস নির্ভরযোগ্যতা",
    confHigh: "উচ্চ (যাচাইকৃত)",
    confMed: "মাঝারি",
    confLow: "সংবিধিবদ্ধ বিজ্ঞপ্তি",
    citationsTitle: "যাচাইকৃত অফিসিয়াল উদ্ধৃতি ও উৎস",
    actionCopy: "কপি করুন",
    actionCopied: "কপি হয়েছে!",
    actionListen: "শুনুন (TTS)",
    actionStop: "ভয়েস বন্ধ করুন",
    actionDownload: "ডাউনলোড",
    actionPrint: "প্রিন্ট",
    actionShare: "শেয়ার",
    checklistTitle: "পদ্ধতিগত সম্মতি চেকলিস্ট",
    statutoryNotice: "অফিসিয়াল BIS নির্দেশিকা",
    connectionError: "BIS সাথী ব্যাকএন্ডে সংযোগ করা যায়নি। অনুগ্রহ করে পোর্ট ৮০০০ যাচাই করুন।",

    findStandardTitle: "আমার মান খুঁজুন — ভারতীয় মান ক্যাটালগ",
    findStandardSubtitle: "প্রযোজ্য ভারতীয় মান (IS) এবং বাধ্যতামূলক QCO নির্দেশিকা জানতে পণ্যের নাম লিখুন।",
    findStandardSearchPlaceholder: "যেমন: পানীয় জল, প্রেসার কুকার, ফ্যান, খেলনা, সোনা, ইস্পাত...",
    findStandardSearchBtn: "মান অনুসন্ধান",
    findStandardSearching: "৭৪১+ মানের মধ্যে অনুসন্ধান চলছে...",
    colStandard: "মান এবং শিরোনাম",
    colStatus: "বাধ্যতামূলক স্থিতি",
    colMatchScore: "ম্যাচ স্কোর",
    colAction: "পদক্ষেপ",
    qcoMandatory: "বাধ্যতামূলক QCO",
    voluntaryStandard: "ঐচ্ছিক মান",
    btnAskBisAbout: "BIS থেকে নির্দেশিকা নিন",
    noStandardsFound: "কোনো মান মেলেনি। 'জল', 'তার', 'সিমেন্ট' বা 'কুকার' লিখে দেখুন।",
    standardsCount: "ক্যাটালগে {count} টি প্রাসঙ্গিক মান পাওয়া গেছে",

    labTitle: "BIS LIMS পরীক্ষাগার অনুসন্ধান নেটওয়ার্ক",
    labSubtitle: "সিটিজেন চার্টার সময়সীমা সহ ভারতের অফিসিয়াল BIS এবং NABL স্বীকৃত ল্যাবগুলি খুঁজুন।",
    labSearchProductPlaceholder: "পণ্য বা বিভাগ দ্বারা ফিল্টার করুন...",
    labSearchLocationPlaceholder: "শহর বা রাজ্য দ্বারা ফিল্টার করুন...",
    labSearchBtn: "ল্যাব খুঁজুন",
    labSearching: "ল্যাব অনুসন্ধান করা হচ্ছে...",
    labDisciplineAll: "সব বিভাগ",
    labDisciplineChemical: "রাসায়নিক ও পলিমার",
    labDisciplineElectrical: "বৈদ্যুতিক ও ইলেকট্রনিক্স",
    labDisciplineMechanical: "যান্ত্রিক ও ধাতু",
    labDisciplineCivil: "সিভিল ও নির্মাণ",
    labDisciplineFood: "খাদ্য ও মাইক্রোবায়োলজি",
    labTat: "কাজ সম্পন্ন হওয়ার সময় (TAT)",
    labAddress: "ঠিকানা",
    labContact: "যোগাযোগ ও ইমেল",
    labScope: "প্রধান পরীক্ষার পরিধি",
    labOfficialLims: "অফিসিয়াল LIMS পোর্টাল",
    labResultsCount: "{count} টি অনুমোদিত ল্যাব প্রদর্শিত হচ্ছে",

    verifyTitle: "অফিসিয়াল মার্কস যাচাই ও প্রামাণ্যতা গাইড",
    verifySubtitle: "BIS Care অ্যাপে আসল ISI মার্ক, ৬-সংখ্যার HUID এবং CRS ইলেকট্রনিক্স মার্ক যাচাই করার নিয়ম জানুন।",
    verifyTabIsi: "ISI মার্ক (স্কিম ১)",
    verifyTabHuid: "সোনার হলমার্কিং (HUID)",
    verifyTabCrs: "CRS রেজিস্ট্রেশন",
    verifyTabGrievance: "অভিযোগ দায়ের করুন",
    verifyIsiHeading: "ISI মার্ক ও CML লাইসেন্স কীভাবে যাচাই করবেন",
    verifyIsiDesc: "প্রতিটি আসল পণ্যে উপরে IS মান নম্বর এবং নিচে CML লাইসেন্স নম্বর থাকে। BIS Care অ্যাপে এটি সহজেই যাচাই করা যায়।",
    verifyHuidHeading: "৬-সংখ্যার আলফানিউমেরিক HUID",
    verifyHuidDesc: "সোনার গয়নায় BIS লোগো, ক্যারেট বিশুদ্ধতা এবং ৬-সংখ্যার HUID স্ট্যাম্প থাকে। অ্যাপে বিশুদ্ধতা নিশ্চিত করুন।",
    verifyCrsHeading: "ইলেকট্রনিক্সের জন্য CRS রেজিস্ট্রেশন",
    verifyCrsDesc: "মোবাইল, ল্যাপটপ পণ্যে 'Registration No. R-XXXXXXXX' সহ CRS লোগো থাকা বাধ্যতামূলক।",
    verifyGrievanceHeading: "নকল মার্কের বিরুদ্ধে অভিযোগ দায়ের",
    verifyGrievanceDesc: "জাল ISI মার্ক বা অননুমোদিত পণ্যের ক্ষেত্রে BIS Care অ্যাপ বা cmed@bis.gov.in-এ অভিযোগ জানান।",
    verifyDownloadCareApp: "অফিসিয়াল BIS Care অ্যাপ ডাউনলোড করুন",

    footerDisclaimer: "সংবিধিবদ্ধ অস্বীকৃতি: BIS সাথী ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস অ্যাক্ট ২০১৬-এর ওপর ভিত্তি করে তৈরি একটি এআই সহায়ক। প্রাতিষ্ঠানিক লাইসেন্সের জন্য manakonline.in ভিজিট করুন।",
    footerCopyright: "© ২০২৬ ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস (BIS), ভারত সরকার। সর্বস্বত্ব সংরক্ষিত।",
    footerLinks: [
      { label: "BIS অফিসিয়াল পোর্টাল", url: "https://www.bis.gov.in" },
      { label: "Manakonline পোর্টাল", url: "https://www.manakonline.in" },
      { label: "LIMS ল্যাব পোর্টাল", url: "https://lims.bis.gov.in" },
      { label: "সিটিজেন চার্টার", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // GUJARATI (gu) — ગુજરાતી
  // ───────────────────────────────────────────────────────────────────
  gu: {
    govIndia: "ભારત સરકાર | GOVERNMENT OF INDIA",
    ministry: "ગ્રાહક બાબતો, ખાદ્ય અને જાહેર વિતરણ મંત્રાલય",
    fontScale: "ફોન્ટ:",
    voiceReadout: "વોઇસ રીડઆઉટ",
    voiceOn: "(ચાલુ)",
    helpline: "હેલ્પલાઇન: 1912",

    bisTitle: "બીઆઇએસ સાથી",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "માનક: પથપ્રદર્શક:",
    sihBadge: "",
    toggleSidebar: "પરામર્શ ઇતિહાસ",

    tabAskBis: "BIS ને પૂછો",
    tabFindStandard: "મારું સ્ટાન્ડર્ડ શોધો",
    tabLabs: "પ્રયોગશાળાઓ (LIMS)",
    tabVerifyMarks: "માર્કસ અને HUID ચકાસો",

    personaHeader: "સ્ટેકહોલ્ડર પ્રોફાઇલ પસંદ કરો",
    personas: {
      msme: {
        label: "MSME (લઘુ ઉદ્યોગ)",
        tagline: "50% ફી રાહત અને ટેસ્ટિંગ સહાય સાથે તમારા ઉત્પાદનને BIS-રેડી બનાવો.",
        description: "MSME (પ્રોડક્ટ સર્ટિફિકેશન અને 50% રાહત)",
        quickActions: [
          { label: "લાગુ સ્ટાન્ડર્ડ શોધો", query: "MSME ઉત્પાદનો માટે લાગુ પડતું ભારતીય સ્ટાન્ડર્ડ કેવી રીતે શોધવું?" },
          { label: "ઓપ્શન 2 સરળ પ્રક્રિયા", query: "મેન્યુફેક્ચરિંગ લાયસન્સ માટે ઓપ્શન 2 સરળ પ્રક્રિયા સમજાવો." },
          { label: "50% ફી રાહત", query: "સ્કીમ 1 હેઠળ લઘુ ઉદ્યોગો માટે કઈ ફી રાહત ઉપલબ્ધ છે?" },
          { label: "માન્યતા પ્રાપ્ત લેબ્સ", query: "MSME માન્ય લેબ્સમાં પ્રોડક્ટ ટેસ્ટિંગ ક્યાં કરાવી શકે છે?" },
        ],
      },
      consumer: {
        label: "ગ્રાહક (Consumer)",
        tagline: "ખરીદતા પહેલા ચકાસો. ISI માર્ક, 6-અંકનો HUID ચકાસો અને ફરિયાદ નોંધાવો.",
        description: "ગ્રાહક (અધિકાર, ચકાસણી અને ફરિયાદ)",
        quickActions: [
          { label: "ISI અને CML ચકાસણી", query: "BIS Care એપ પર પ્રોડક્ટનો ISI માર્ક અને CML લાયસન્સ નંબર કેવી રીતે ચકાસવો?" },
          { label: "સોનાનો HUID ચકાસો", query: "6-અંકનો HUID શું છે અને સોનાની શુદ્ધતા કેવી રીતે ચકાસવી?" },
          { label: "ખોટા માર્કની ફરિયાદ", query: "નકલી ISI માર્ક અથવા હલકી ગુણવત્તાવાળા ઉત્પાદનો સામે BIS માં ફરિયાદ કેવી રીતે કરવી?" },
          { label: "ગુણવત્તા માર્ક્સ", query: "ભારતમાં અધિકૃત ગુણવત્તા પ્રમાણપત્ર ચિહ્નો (ISI, હોલમાર્ક, CRS) સમજાવો." },
        ],
      },
      manufacturer: {
        label: "ઉત્પાદક (Manufacturer)",
        tagline: "BIS સ્કીમ 1 ફેક્ટરી ઓડિટ, ઇન-હાઉસ લેબ નિયમો અને QCO ઓર્ડર સમજો.",
        description: "ઉત્પાદક (સ્કીમ 1 અને ટેસ્ટિંગ)",
        quickActions: [
          { label: "લાગુ સ્ટાન્ડર્ડ", query: "મારા ઉત્પાદન માટે કયું ભારતીય સ્ટાન્ડર્ડ લાગુ પડે છે?" },
          { label: "ફરજિયાત QCO", query: "કયા ઉત્પાદનો પર ગુણવત્તા નિયંત્રણ ઓર્ડર (QCO) ફરજિયાત છે?" },
          { label: "ફેક્ટરી ઓડિટ તૈયારી", query: "BIS ફેક્ટરી ઓડિટ માટે કયા ટેસ્ટિંગ સાધનો જરૂરી છે?" },
          { label: "ઓપ્શન 1 વિ ઓપ્શન 2", query: "સ્કીમ 1 હેઠળ સામાન્ય અને સરળ પ્રક્રિયા વચ્ચે શું તફાવત છે?" },
        ],
      },
      jeweller: {
        label: "જ્વેલર્સ (Jeweller)",
        tagline: "ઝીરો-ફી હોલમાર્કિંગ રજીસ્ટ્રેશન, 6-અંકનો HUID અને AHC સેન્ટર ગાઇડ.",
        description: "જ્વેલર્સ (HUID અને હોલમાર્કિંગ)",
        quickActions: [
          { label: "6-અંકના HUID નિયમો", query: "સોનાના દાગીના પર 6-અંકના HUID હોલમાર્કિંગના સરકારી નિયમો શું છે?" },
          { label: "ઝીરો-ફી રજીસ્ટ્રેશન", query: "Manakonline પર જ્વેલર્સ હોલમાર્કિંગ રજીસ્ટ્રેશનની મફત પ્રક્રિયા શું છે?" },
          { label: "AHC સેન્ટર પ્રક્રિયા", query: "જ્વેલર્સ હોલમાર્કિંગ સેન્ટર પર સોનું કેવી રીતે જમા કરાવે છે?" },
          { label: "શુદ્ધતા ગ્રેડ (IS 1417)", query: "IS 1417 હેઠળ કઈ શુદ્ધતા કેટેગરી (14K થી 24K) માન્ય છે?" },
        ],
      },
      student: {
        label: "વિદ્યાર્થી / સંશોધક",
        tagline: "સરળતાથી BIS સમજો. સ્ટાન્ડર્ડ નિર્માણ, ગુણવત્તા ચળવળ અને ગ્રાહક સુરક્ષા.",
        description: "વિદ્યાર્થી (ગુણવત્તા અને સ્ટાન્ડર્ડ)",
        quickActions: [
          { label: "BIS શું છે?", query: "બ્યુરો ઓફ ઇન્ડિયન સ્ટાન્ડર્ડ્સ શું છે અને BIS એક્ટ 2016 હેઠળ તેની ભૂમિકા શું છે?" },
          { label: "સ્ટાન્ડર્ડ નિર્માણ", query: "BIS સમિતિઓ ભારતીય સ્ટાન્ડર્ડ કેવી રીતે તૈયાર કરે છે?" },
          { label: "પ્રમાણપત્રના પ્રકાર", query: "પ્રોડક્ટ સર્ટિફિકેશન (ISI) અને CRS વચ્ચે શું તફાવત છે?" },
          { label: "સિટીઝન ચાર્ટર", query: "BIS સિટીઝન ચાર્ટર 2024 માં ગ્રાહકોને કયા અધિકારો આપેલા છે?" },
        ],
      },
      researcher: {
        label: "સંશોધક (Researcher)",
        tagline: "ભારતીય સ્ટાન્ડર્ડ કેટલોગ, ટેકનિકલ કમિટી અને ISO સંરેખણ શોધો.",
        description: "ટેકનિકલ સંશોધક (કેટલોગ અને ISO)",
        quickActions: [
          { label: "કેટલોગ સર્ચ", query: "ટેકનિકલ કમિટી મુજબ ભારતીય સ્ટાન્ડર્ડ કેટલોગ કેવી રીતે શોધવો?" },
          { label: "સ્ટાન્ડર્ડ મેટાડેટા", query: "ભારતીય સ્ટાન્ડર્ડ માટે કયો મેટાડેટા જાળવવામાં આવે છે?" },
          { label: "ગેઝેટ QCO ઓર્ડર", query: "સત્તાવાર ગેઝેટ સૂચનાઓ ક્યાં પ્રકાશિત થાય છે?" },
          { label: "ISO/IEC સંરેખણ", query: "આંતરરાષ્ટ્રીય સ્ટાન્ડર્ડને ભારતીય સ્ટાન્ડર્ડ સાથે કેવી રીતે સંરેખિત કરાય છે?" },
        ],
      },
      general: {
        label: "સામાન્ય નાગરિક",
        tagline: "BIS સાથી આજે તમને કેવી રીતે મદદ કરી શકે છે? ભારતીય સ્ટાન્ડર્ડ પર સચોટ જવાબો.",
        description: "સામાન્ય નાગરિક (સ્ટાન્ડર્ડ અને ગુણવત્તા)",
        quickActions: [
          { label: "સ્ટાન્ડર્ડ શોધો", query: "કોઈ પ્રોડક્ટ માટે લાગુ પડતું ભારતીય સ્ટાન્ડર્ડ કેવી રીતે શોધવું?" },
          { label: "ISI માર્ક ચકાસો", query: "પ્રોડક્ટ પરનો ISI માર્ક અસલી છે કે નહીં તે કેવી રીતે ચકાસવું?" },
          { label: "સોનાનો HUID ચકાસો", query: "6-અંકનો HUID શું છે અને અસલી હોલમાર્ક સોનું કેવી રીતે ઓળખવું?" },
          { label: "50% MSME રાહત", query: "BIS લાયસન્સ માટે લઘુ ઉદ્યોગોને કઈ ફી રાહત મળે છે?" },
        ],
      },
    },

    languageHeader: "ભાષા પસંદ કરો (Select Language)",
    tickerLabel: "લાઇવ ગેઝેટ ટીકર",
    tickerItems: [
      "QCO ઓર્ડર: સ્ટેનલેસ સ્ટીલ ઉત્પાદનો પર IS 6911 / IS 1786 હેઠળ ફરજિયાત ISI માર્કિંગ જરૂરી છે.",
      "MSME રાહત: Manakonline પોર્ટલ પર લઘુ ઉદ્યોગો માટે 50% ફી રાહત સક્રિય છે.",
      "હોલમાર્કિંગ અપડેટ: 14K થી 24K સોનાના દાગીના માટે 6-અંકનો HUID ફરજિયાત છે.",
      "ગ્રાહક સાવધાની: ખરીદી કરતા પહેલા BIS Care એપ પર CML લાયસન્સ નંબર અને HUID ચકાસો.",
    ],

    heroTitle: "બ્યુરો ઓફ ઇન્ડિયન સ્ટાન્ડર્ડ્સ સત્તાવાર એઆઈ સહાયક",
    heroSubtitle: "ભારતીય સ્ટાન્ડર્ડ્સ, ISI સર્ટિફિકેશન, 6-અંકનો HUID અને લેબોરેટરી શોધ પર અધિકૃત માર્ગદર્શન.",
    badgeSource: "100% સ્ત્રોત-આધારિત",
    badgeQco: "સક્રિય QCO સામેલ",
    badgeCare: "BIS Care 2.0 તૈયાર",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "નવી ચર્ચા",
    consultationsTitle: "પરામર્શ ઇતિહાસ",
    searchHistoryPlaceholder: "ઇતિહાસ શોધો...",
    noPastChats: "કોઈ જૂનો પરામર્શ મળ્યો નથી",
    clearHistory: "બધું સાફ કરો",
    inputPlaceholder: "BIS સાથીને સ્ટાન્ડર્ડ, સર્ટિફિકેશન, HUID અથવા લેબ્સ વિશે પૂછો...",
    micListening: "સાંભળી રહ્યો છું... તમારો પ્રશ્ન બોલો",
    micError: "અવાજ ઓળખવામાં ભૂલ. કૃપા કરીને ટાઇપ કરો.",
    includeChecklist: "સ્ટેપ-બાય-સ્ટેપ ચેકલિસ્ટ સામેલ કરો",
    send: "મોકલો",
    suggestedQuestions: "સૂચવેલા પ્રશ્નો",
    sourceConfidence: "સ્ત્રોત વિશ્વસનીયતા",
    confHigh: "ઉચ્ચ (ચકાસાયેલ)",
    confMed: "મધ્યમ",
    confLow: "વૈધાનિક સૂચના",
    citationsTitle: "ચકાસાયેલા સત્તાવાર સંદર્ભો",
    actionCopy: "કૉપિ કરો",
    actionCopied: "કૉપિ થઈ ગયું!",
    actionListen: "સાંભળો (TTS)",
    actionStop: "અવાજ બંધ કરો",
    actionDownload: "ડાઉનલોડ",
    actionPrint: "પ્રિન્ટ",
    actionShare: "શેર",
    checklistTitle: "પ્રક્રિયાગત અનુપાલન ચેકલિસ્ટ",
    statutoryNotice: "સત્તાવાર BIS માર્ગદર્શન",
    connectionError: "BIS સાથી બેકએન્ડ સાથે કનેક્ટ થઈ શક્યું નથી. પોર્ટ 8000 ચકાસો.",

    findStandardTitle: "મારું સ્ટાન્ડર્ડ શોધો — ભારતીય સ્ટાન્ડર્ડ કેટલોગ",
    findStandardSubtitle: "લાગુ પડતું સ્ટાન્ડર્ડ (IS) અને QCO ઓર્ડર શોધવા માટે પ્રોડક્ટનું નામ દાખલ કરો.",
    findStandardSearchPlaceholder: "દા.ત., પીવાનું પાણી, પ્રેશર કૂકર, ફેન, રમકડાં, સોનું, સ્ટીલ...",
    findStandardSearchBtn: "સ્ટાન્ડર્ડ શોધો",
    findStandardSearching: "741+ સ્ટાન્ડર્ડમાં શોધ ચાલુ છે...",
    colStandard: "સ્ટાન્ડર્ડ અને શીર્ષક",
    colStatus: "ફરજિયાત સ્થિતિ",
    colMatchScore: "મેચ સ્કોર",
    colAction: "પગલું",
    qcoMandatory: "ફરજિયાત QCO",
    voluntaryStandard: "મરજિયાત સ્ટાન્ડર્ડ",
    btnAskBisAbout: "BIS માર્ગદર્શન લો",
    noStandardsFound: "કોઈ સ્ટાન્ડર્ડ મળ્યું નથી. 'પાણી', 'કેબલ', 'સિમેન્ટ' જેવા શબ્દો શોધો.",
    standardsCount: "કેટલોગમાં {count} સંબંધિત સ્ટાન્ડર્ડ મળ્યા",

    labTitle: "BIS LIMS લેબોરેટરી શોધ નેટવર્ક",
    labSubtitle: "ભારતભરમાં સત્તાવાર BIS અને NABL માન્યતા પ્રાપ્ત ટેસ્ટિંગ લેબ્સ શોધો.",
    labSearchProductPlaceholder: "પ્રોડક્ટ અથવા વિષય દ્વારા ફિલ્ટર કરો...",
    labSearchLocationPlaceholder: "શહેર અથવા રાજ્ય દ્વારા ફિલ્ટર કરો...",
    labSearchBtn: "લેબ શોધો",
    labSearching: "લેબ્સ શોધાઈ રહી છે...",
    labDisciplineAll: "બધા વિષયો",
    labDisciplineChemical: "કેમિકલ અને પોલિમર",
    labDisciplineElectrical: "ઇલેક્ટ્રિકલ અને ઇલેક્ટ્રોનિક્સ",
    labDisciplineMechanical: "મિકેનિકલ અને મેટલ્સ",
    labDisciplineCivil: "સિવિલ અને કન્સ્ટ્રક્શન",
    labDisciplineFood: "ફૂડ અને માઇક્રોબાયોલોજી",
    labTat: "કામ પૂર્ણ થવાનો સમય (TAT)",
    labAddress: "સરનામું",
    labContact: "સંપર્ક અને ઇમેઇલ",
    labScope: "મુખ્ય ટેસ્ટિંગ ક્ષેત્ર",
    labOfficialLims: "સત્તાવાર LIMS પોર્ટલ",
    labResultsCount: "{count} માન્ય ટેસ્ટિંગ લેબ્સ દર્શાવી રહ્યું છે",

    verifyTitle: "સત્તાવાર માર્ક્સ ચકાસણી ગાઇડ",
    verifySubtitle: "BIS Care એપ પર સાચો ISI માર્ક, 6-અંકનો HUID અને CRS ઇલેક્ટ્રોનિક્સ માર્ક કેવી રીતે ચકાસવો તે શીખો.",
    verifyTabIsi: "ISI માર્ક (સ્કીમ 1)",
    verifyTabHuid: "ગોલ્ડ હોલમાર્કિંગ (HUID)",
    verifyTabCrs: "CRS રજીસ્ટ્રેશન",
    verifyTabGrievance: "ફરિયાદ નોંધાવો",
    verifyIsiHeading: "ISI માર્ક અને CML લાયસન્સ કેવી રીતે ચકાસવું",
    verifyIsiDesc: "દરેક અસલી પ્રોડક્ટ પર ઉપર IS સ્ટાન્ડર્ડ નંબર અને નીચે CML લાયસન્સ નંબર હોય છે. BIS Care એપમાં તેની ચકાસણી કરો.",
    verifyHuidHeading: "6-અંકનો HUID ગોલ્ડ હોલમાર્કિંગ",
    verifyHuidDesc: "દાગીના પર BIS લોગો, કેરેટ શુદ્ધતા અને 6-અંકનો HUID સ્ટેમ્પ હોય છે. એપમાં તરત શુદ્ધતા ચકાસો.",
    verifyCrsHeading: "ઇલેક્ટ્રોનિક્સ માટે CRS રજીસ્ટ્રેશન",
    verifyCrsDesc: "મોબાઇલ, લેપટોપ પ્રોડક્ટ્સ પર 'Registration No. R-XXXXXXXX' સાથે CRS લોગો હોવો ફરજિયાત છે.",
    verifyGrievanceHeading: "નકલી માર્ક્સ સામે ફરિયાદ નોંધાવવી",
    verifyGrievanceDesc: "જો તમને નકલી ISI માર્ક કે ખોટો HUID દેખાય તો BIS Care એપ અથવા cmed@bis.gov.in પર ફરિયાદ કરો.",
    verifyDownloadCareApp: "સત્તાવાર BIS Care એપ ડાઉનલોડ કરો",

    footerDisclaimer: "વૈધાનિક અસ્વીકરણ: BIS સાથી એ બ્યુરો ઓફ ઇન્ડિયન સ્ટાન્ડર્ડ્સ એક્ટ 2016 પર આધારિત AI સહાયક છે. સત્તાવાર અરજી માટે manakonline.in ની મુલાકાત લો.",
    footerCopyright: "© 2026 બ્યુરો ઓફ ઇન્ડિયન સ્ટાન્ડર્ડ્સ (BIS), ભારત સરકાર. સર્વાધિકાર સુરક્ષિત.",
    footerLinks: [
      { label: "BIS સત્તાવાર પોર્ટલ", url: "https://www.bis.gov.in" },
      { label: "Manakonline પોર્ટલ", url: "https://www.manakonline.in" },
      { label: "LIMS પોર્ટલ", url: "https://lims.bis.gov.in" },
      { label: "સિટીઝન ચાર્ટર", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // TAMIL (ta) — தமிழ்
  // ───────────────────────────────────────────────────────────────────
  ta: {
    govIndia: "இந்திய அரசு | GOVERNMENT OF INDIA",
    ministry: "நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்",
    fontScale: "எழுத்துரு:",
    voiceReadout: "குரல் வாசிப்பு",
    voiceOn: "(செயலில்)",
    helpline: "உதவி எண்: 1912",

    bisTitle: "பிஐஎஸ் சாதி",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "ஆலோசனை வரலாறு",

    tabAskBis: "BIS-ஐ கேளுங்கள்",
    tabFindStandard: "எனது தரநிலையைக் கண்டறியவும்",
    tabLabs: "ஆய்வகங்கள் (LIMS)",
    tabVerifyMarks: "குறியீடுகள் & HUID சரிபார்க்கவும்",

    personaHeader: "உங்கள் பயனர் சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
    personas: {
      msme: {
        label: "MSME (சிறு குறு தொழில்கள்)",
        tagline: "50% கட்டண சலுகை மற்றும் சோதனை ஆதரவுடன் உங்கள் தயாரிப்பை BIS-தயாராக மாற்றவும்.",
        description: "MSME (தயாரிப்பு சான்றிதழ் மற்றும் 50% சலுகை)",
        quickActions: [
          { label: "தரநிலையைக் கண்டறியவும்", query: "MSME தயாரிப்புகளுக்குப் பொருந்தக்கூடிய இந்தியத் தரநிலையை எப்படிக் கண்டறிவது?" },
          { label: "விருப்பம் 2 எளிய முறை", query: "உற்பத்தி உரிமம் பெறுவதற்கான விருப்பம் 2 எளிய நடைமுறையை விளக்குங்கள்." },
          { label: "50% கட்டண சலுகைகள்", query: "திட்டம் 1-ன் கீழ் சிறு தொழில்களுக்கு என்ன கட்டண சலுகைகள் உள்ளன?" },
          { label: "அங்கீகரிக்கப்பட்ட ஆய்வகங்கள்", query: "MSME தயாரிப்புகளை BIS அங்கீகரித்த ஆய்வகங்களில் எங்கு பரிசோதிக்கலாம்?" },
        ],
      },
      consumer: {
        label: "நுகர்வோர் (Consumer)",
        tagline: "வாங்குவதற்கு முன் சரிபார்க்கவும். ISI குறி, 6-இலக்க HUID சரிபார்த்து புகார் அளிக்கவும்.",
        description: "நுகர்வோர் (உரிமைகள், சரிபார்ப்பு மற்றும் புகார்)",
        quickActions: [
          { label: "ISI & CML சரிபார்ப்பு", query: "BIS Care செயலியில் தயாரிப்பின் ISI குறி மற்றும் CML உரிம எண்ணை எவ்வாறு சரிபார்ப்பது?" },
          { label: "தங்க HUID சரிபார்ப்பு", query: "6-இலக்க HUID என்றால் என்ன, தங்கத்தின் தூய்மையை எவ்வாறு சரிபார்ப்பது?" },
          { label: "போலி குறி புகார்", query: "போலி ISI குறி அல்லது தரமற்ற தயாரிப்புகள் குறித்து BIS-ல் எவ்வாறு புகார் அளிப்பது?" },
          { label: "கட்டாய தரக் குறியீடுகள்", query: "இந்தியாவின் அதிகாரப்பூர்வ தரச் சான்றிதழ் குறியீடுகளை (ISI, ஹால்மார்க், CRS) விளக்குங்கள்." },
        ],
      },
      manufacturer: {
        label: "உற்பத்தியாளர் (Manufacturer)",
        tagline: "BIS திட்டம் 1 தொழிற்சாலை தணிக்கை, உள் ஆய்வக விதிகள் மற்றும் QCO ஆணைகளைப் புரிந்து கொள்ளுங்கள்.",
        description: "உற்பத்தியாளர் (திட்டம் 1 மற்றும் சோதனை)",
        quickActions: [
          { label: "பொருந்தும் தரநிலை", query: "எனது தயாரிப்பு வகைக்கு எந்த இந்திய தரநிலை பொருந்தும்?" },
          { label: "கட்டாய QCO ஆணைகள்", query: "எந்த தயாரிப்புகளுக்கு தரக் கட்டுப்பாட்டு ஆணைகள் (QCO) கட்டாயமாக்கப்பட்டுள்ளன?" },
          { label: "தணிக்கை தயார்நிலை", query: "BIS தொழிற்சாலை தணிக்கைக்கு என்ன சோதனை உபகரணங்கள் தேவை?" },
          { label: "விருப்பம் 1 vs 2", query: "திட்டம் 1-ன் கீழ் வழக்கமான மற்றும் எளிய நடைமுறைக்கு என்ன வித்தியாசம்?" },
        ],
      },
      jeweller: {
        label: "நகைக்கடை உரிமையாளர்",
        tagline: "கட்டணமில்லா ஹால்மார்க்கிங் பதிவு, 6-இலக்க HUID மற்றும் AHC மைய வழிகாட்டி.",
        description: "நகைக்கடைக்காரர் (HUID மற்றும் ஹால்மார்க்கிங்)",
        quickActions: [
          { label: "6-இலக்க HUID விதிகள்", query: "தங்க நகைகளில் 6-இலக்க HUID ஹால்மார்க்கிங்கிற்கான சட்டப்பூர்வ விதிகள் என்ன?" },
          { label: "இலவச பதிவு முறை", query: "Manakonline-ல் நகைக்கடைக்காரர் ஹால்மார்க்கிங் பதிவு செய்வதற்கான இலவச நடைமுறை என்ன?" },
          { label: "AHC மைய சமர்ப்பிப்பு", query: "நகைக்கடைக்காரர்கள் ஹால்மார்க்கிங் மையங்களில் தங்கம் எவ்வாறு சமர்ப்பிக்கிறார்கள்?" },
          { label: "தூய்மை தரங்கள் (IS 1417)", query: "IS 1417-ன் கீழ் ஹால்மார்க்கிங்கிற்கு எந்த தூய்மை தரங்கள் (14K முதல் 24K வரை) அனுமதிக்கப்படுகின்றன?" },
        ],
      },
      student: {
        label: "மாணவர் / ஆராய்ச்சியாளர்",
        tagline: "BIS-ஐ எளிதாகப் புரிந்து கொள்ளுங்கள். தர நிர்ணயம், தர இயக்கம் மற்றும் நுகர்வோர் பாதுகாப்பு.",
        description: "மாணவர் (தரநிலைகள் மற்றும் தரம்)",
        quickActions: [
          { label: "BIS என்றால் என்ன?", query: "இந்திய தரநிலைகள் பணியகம் என்றால் என்ன, BIS சட்டம் 2016-ன் கீழ் அதன் பங்கு என்ன?" },
          { label: "தரநிலைகள் உருவாக்கம்", query: "BIS குழுக்கள் இந்திய தரநிலைகளை எவ்வாறு உருவாக்கி வெளியிடுகின்றன?" },
          { label: "சான்றிதழ் வகைகள்", query: "தயாரிப்பு சான்றிதழ் (ISI) மற்றும் CRS-க்கு என்ன வித்தியாசம்?" },
          { label: "குடிமக்கள் சாசனம்", query: "BIS குடிமக்கள் சாசனம் 2024-ல் நுகர்வோருக்கு என்ன உரிமைகள் வழங்கப்பட்டுள்ளன?" },
        ],
      },
      researcher: {
        label: "ஆராய்ச்சியாளர் (Researcher)",
        tagline: "இந்திய தரநிலைகள் பட்டியல், தொழில்நுட்பக் குழுக்கள் மற்றும் ISO சீரமைப்பை ஆராயுங்கள்.",
        description: "தொழில்நுட்ப ஆராய்ச்சியாளர் (பட்டியல் & ISO)",
        quickActions: [
          { label: "பட்டியல் தேடல்", query: "தொழில்நுட்பக் குழு வாரியாக இந்திய தரநிலைகள் பட்டியலை எவ்வாறு தேடுவது?" },
          { label: "தரநிலை மெட்டாடேட்டா", query: "இந்திய தரநிலைகளுக்காக என்ன மெட்டாடேட்டா பராமரிக்கப்படுகிறது?" },
          { label: "அரசிதழ் QCO ஆணைகள்", query: "அதிகாரப்பூர்வ அரசிதழ் அறிவிப்புகள் எங்கு வெளியிடப்படுகின்றன?" },
          { label: "ISO/IEC சீரமைப்பு", query: "சர்வதேச தரநிலைகள் இந்திய தரநிலைகளுடன் எவ்வாறு ஒத்திசைக்கப்படுகின்றன?" },
        ],
      },
      general: {
        label: "பொது மக்கள் (General)",
        tagline: "BIS சாதி இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்? இந்திய தரநிலைகள் குறித்த துல்லியமான பதில்கள்.",
        description: "பொது மக்கள் (தரநிலைகள் மற்றும் தரம்)",
        quickActions: [
          { label: "தரநிலையைக் கண்டறியவும்", query: "ஒரு குறிப்பிட்ட தயாரிப்புக்கான இந்திய தரநிலையை எப்படிக் கண்டறிவது?" },
          { label: "ISI குறியைச் சரிபார்க்கவும்", query: "தயாரிப்பில் உள்ள ISI குறி மற்றும் CML எண் உண்மையானதா என எவ்வாறு சரிபார்ப்பது?" },
          { label: "தங்க HUID சரிபார்க்கவும்", query: "6-இலக்க HUID என்றால் என்ன, உண்மையான ஹால்மார்க் தங்கத்தை எவ்வாறு சரிபார்ப்பது?" },
          { label: "50% MSME சலுகை", query: "BIS உரிமம் பெற சிறு நிறுவனங்களுக்கு என்ன கட்டண சலுகை கிடைக்கிறது?" },
        ],
      },
    },

    languageHeader: "மொழியைத் தேர்ந்தெடுக்கவும் (Select Language)",
    tickerLabel: "நேரலை அரசிதழ் டிக்கர்",
    tickerItems: [
      "QCO ஆணை: துருப்பிடிக்காத எஃகு தயாரிப்புகளுக்கு IS 6911 / IS 1786 கீழ் கட்டாய ISI முத்திரை அவசியம்.",
      "MSME நிவாரணம்: Manakonline போர்ட்டலில் சிறு தொழில்களுக்கு 50% கட்டண சலுகை செயலில் உள்ளது.",
      "ஹால்மார்க்கிங் அப்டேட்: 14K முதல் 24K தங்க நகைகளுக்கு 6-இலக்க HUID கட்டாயமாகும்.",
      "நுகர்வோர் எச்சரிக்கை: வாங்குவதற்கு முன் BIS Care செயலியில் CML உரிம எண் மற்றும் HUID-ஐ சரிபார்க்கவும்.",
    ],

    heroTitle: "இந்திய தரநிலைகள் பணியகம் அதிகாரப்பூர்வ AI உதவியாளர்",
    heroSubtitle: "இந்திய தரநிலைகள், ISI சான்றிதழ், 6-இலக்க HUID மற்றும் ஆய்வகங்கள் குறித்த நம்பகமான வழிகாட்டுதல்.",
    badgeSource: "100% ஆதாரம்-சார்ந்தது",
    badgeQco: "செயலில் உள்ள QCO-க்கள்",
    badgeCare: "BIS Care 2.0 தயார்",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "புதிய ஆலோசனை",
    consultationsTitle: "ஆலோசனை வரலாறு",
    searchHistoryPlaceholder: "வரலாற்றைத் தேடுங்கள்...",
    noPastChats: "முந்தைய ஆலோசனைகள் எதுவும் இல்லை",
    clearHistory: "அனைத்தையும் அழி",
    inputPlaceholder: "BIS சாதியிடம் தரநிலைகள், உரிமங்கள், HUID அல்லது ஆய்வகங்கள் பற்றிக் கேளுங்கள்...",
    micListening: "கேட்கிறது... உங்கள் கேள்வியைப் பேசுங்கள்",
    micError: "குரல் அறிதலில் பிழை. தட்டச்சு செய்யவும்.",
    includeChecklist: "படிநிலையான சரிபார்ப்புப் பட்டியலைச் சேர்க்கவும்",
    send: "அனுப்பு",
    suggestedQuestions: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
    sourceConfidence: "ஆதார நம்பகத்தன்மை",
    confHigh: "உயர் (சரிபார்க்கப்பட்டது)",
    confMed: "நடுத்தரம்",
    confLow: "சட்டப்பூர்வ அறிவிப்பு",
    citationsTitle: "சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ ஆதாரங்கள்",
    actionCopy: "நகலெடு",
    actionCopied: "நகலெடுக்கப்பட்டது!",
    actionListen: "கேளுங்கள் (TTS)",
    actionStop: "குரலை நிறுத்து",
    actionDownload: "பதிவிறக்கு",
    actionPrint: "அச்சிடு",
    actionShare: "பகிர்",
    checklistTitle: "நடைமுறை இணக்க சரிபார்ப்புப் பட்டியல்",
    statutoryNotice: "அதிகாரப்பூர்வ BIS வழிகாட்டுதல்",
    connectionError: "BIS சாதி சேவையகத்தை அணுக முடியவில்லை. போர்ட் 8000-ஐ சரிபார்க்கவும்.",

    findStandardTitle: "எனது தரநிலையைக் கண்டறியவும் — இந்திய தரநிலைகள் பட்டியல்",
    findStandardSubtitle: "பொருந்தக்கூடிய இந்திய தரநிலை (IS) மற்றும் QCO ஆணைகளைக் கண்டறிய தயாரிப்பின் பெயரை உள்ளிடவும்.",
    findStandardSearchPlaceholder: "எ.கா. குடிநீர், பிரஷர் குக்கர், மின்விசிறி, பொம்மைகள், தங்கம், எஃகு...",
    findStandardSearchBtn: "தரநிலையைத் தேடு",
    findStandardSearching: "741+ தரநிலைகளில் தேடப்படுகிறது...",
    colStandard: "தரநிலை மற்றும் தலைப்பு",
    colStatus: "கட்டாய நிலை",
    colMatchScore: "பொருத்த மதிப்பெண்",
    colAction: "செயல்",
    qcoMandatory: "கட்டாய QCO",
    voluntaryStandard: "விருப்பத் தரநிலை",
    btnAskBisAbout: "BIS வழிகாட்டுதலைப் பெறுங்கள்",
    noStandardsFound: "தரநிலைகள் எதுவும் கிடைக்கவில்லை. 'தண்ணீர்', 'கேபிள்', 'சிமெண்ட்' போன்ற சொற்களைத் தட்டச்சு செய்யவும்.",
    standardsCount: "பட்டியலில் {count} தொடர்புடைய தரநிலைகள் கண்டறியப்பட்டன",

    labTitle: "BIS LIMS ஆய்வகக் கண்டுபிடிப்பு நெட்வொர்க்",
    labSubtitle: "குடிமக்கள் சாசன காலக்கெடுவுடன் இந்தியா முழுவதும் உள்ள அதிகாரப்பூர்வ BIS மற்றும் NABL ஆய்வகங்களைக் கண்டறியவும்.",
    labSearchProductPlaceholder: "தயாரிப்பு அல்லது துறை வாரியாக வடிகட்டவும்...",
    labSearchLocationPlaceholder: "நகரம் அல்லது மாநிலம் வாரியாக வடிகட்டவும்...",
    labSearchBtn: "ஆய்வகத்தைத் தேடு",
    labSearching: "ஆய்வகங்கள் தேடப்படுகின்றன...",
    labDisciplineAll: "அனைத்து துறைகளும்",
    labDisciplineChemical: "வேதியியல் & பாலிமர்கள்",
    labDisciplineElectrical: "மின்சாரம் & மின்னணுவியல்",
    labDisciplineMechanical: "இயந்திரவியல் & உலோகங்கள்",
    labDisciplineCivil: "சிவில் & கட்டுமானம்",
    labDisciplineFood: "உணவு & நுண்ணுயிரியல்",
    labTat: "பணி முடிக்கும் நேரம் (TAT)",
    labAddress: "முகவரி",
    labContact: "தொடர்பு & மின்னஞ்சல்",
    labScope: "முக்கிய சோதனை வரம்பு",
    labOfficialLims: "அதிகாரப்பூர்வ LIMS போர்டல்",
    labResultsCount: "{count} அங்கீகரிக்கப்பட்ட ஆய்வகங்கள் காட்டப்படுகின்றன",

    verifyTitle: "அதிகாரப்பூர்வ குறியீடுகள் சரிபார்ப்பு வழிகாட்டி",
    verifySubtitle: "BIS Care செயலியில் உண்மையான ISI குறி, 6-இலக்க HUID மற்றும் CRS மின்னணுக் குறியீடுகளை எவ்வாறு சரிபார்ப்பது என்பதைக் கற்றுக்கொள்ளுங்கள்.",
    verifyTabIsi: "ISI குறி (திட்டம் 1)",
    verifyTabHuid: "தங்க ஹால்மார்க்கிங் (HUID)",
    verifyTabCrs: "CRS பதிவு",
    verifyTabGrievance: "புகார் அளிக்கவும்",
    verifyIsiHeading: "ISI குறி மற்றும் CML உரிமத்தை எவ்வாறு சரிபார்ப்பது",
    verifyIsiDesc: "ஒவ்வொரு உண்மையான தயாரிப்பிலும் மேலே IS தரநிலை எண்ணும், கீழே CML உரிம எண்ணும் இருக்கும். BIS Care செயலியில் இதைச் சரிபார்க்கவும்.",
    verifyHuidHeading: "6-இலக்க HUID தங்க ஹால்மார்க்கிங்",
    verifyHuidDesc: "நகைகளில் BIS லோகோ, தூய்மை மற்றும் 6-இலக்க HUID குறியீடு இருக்கும். செயலியில் தூய்மையை உடனடியாக உறுதிப்படுத்தவும்.",
    verifyCrsHeading: "மின்னணுவியல் பொருட்களுக்கான CRS பதிவு",
    verifyCrsDesc: "மொபைல், லேப்டாப் தயாரிப்புகளில் 'Registration No. R-XXXXXXXX' உடன் CRS லோகோ இருப்பது கட்டாயமாகும்.",
    verifyGrievanceHeading: "போலி குறியீடுகளுக்கு எதிராக புகார் அளித்தல்",
    verifyGrievanceDesc: "போலி ISI குறி அல்லது தவறான ஹால்மார்க்கிங் கண்டறியப்பட்டால் BIS Care செயலி அல்லது cmed@bis.gov.in மூலம் புகார் அளிக்கவும்.",
    verifyDownloadCareApp: "அதிகாரப்பூர்வ BIS Care செயலியைப் பதிவிறக்கவும்",

    footerDisclaimer: "சட்டப்பூர்வ மறுப்பு: BIS சாதி என்பது இந்திய தரநிலைகள் பணியக சட்டம் 2016-ன் அடிப்படையில் உருவாக்கப்பட்ட AI உதவியாளர் ஆகும். அதிகாரப்பூர்வ விண்ணப்பங்களுக்கு manakonline.in தளத்தைப் பார்வையிடவும்.",
    footerCopyright: "© 2026 இந்திய தரநிலைகள் பணியகம் (BIS), இந்திய அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    footerLinks: [
      { label: "BIS அதிகாரப்பூர்வ தளம்", url: "https://www.bis.gov.in" },
      { label: "Manakonline போர்டல்", url: "https://www.manakonline.in" },
      { label: "LIMS போர்டல்", url: "https://lims.bis.gov.in" },
      { label: "குடிமக்கள் சாசனம்", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // TELUGU (te) — తెలుగు
  // ───────────────────────────────────────────────────────────────────
  te: {
    govIndia: "భారత ప్రభుత్వం | GOVERNMENT OF INDIA",
    ministry: "వినియోగదారుల వ్యవహారాలు, ఆహారం మరియు ప్రజా పంపిణీ మంత్రిత్వ శాఖ",
    fontScale: "ఫాంట్:",
    voiceReadout: "వాయిస్ రీడౌట్",
    voiceOn: "(ఆన్)",
    helpline: "హెల్ప్‌లైన్: 1912",

    bisTitle: "బీఐఎస్ సాథీ",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "సంప్రదింపుల చరిత్ర",

    tabAskBis: "BIS ని అడగండి",
    tabFindStandard: "నా ప్రమాణాన్ని కనుగొనండి",
    tabLabs: "ప్రయోగశాలలు (LIMS)",
    tabVerifyMarks: "మార్కులు & HUID ధృవీకరించండి",

    personaHeader: "మీ ప్రొఫైల్‌ను ఎంచుకోండి",
    personas: {
      msme: {
        label: "MSME (చిన్న పరిశ్రమలు)",
        tagline: "50% ఫీజు రాయితీ మరియు టెస్టింగ్ మద్దతుతో మీ ఉత్పత్తిని BIS-సిద్ధంగా చేయండి.",
        description: "MSME (ఉత్పత్తి సర్టిఫికేషన్ & 50% రాయితీ)",
        quickActions: [
          { label: "వర్తించే ప్రమాణం", query: "MSME ఉత్పత్తులకు వర్తించే భారతీయ ప్రమాణాన్ని ఎలా కనుగొనాలి?" },
          { label: "ఆప్షన్ 2 సులభ ప్రక్రియ", query: "తయారీ లైసెన్స్ పొందే ఆప్షన్ 2 సులభతర విధానాన్ని వివరించండి." },
          { label: "50% ఫీజు రాయితీలు", query: "స్కీమ్ 1 కింద చిన్న పరిశ్రమలకు ఏయే ఫీజు రాయితీలు అందుబాటులో ఉన్నాయి?" },
          { label: "గుర్తింపు పొందిన ల్యాబ్‌లు", query: "MSME ఉత్పత్తులను BIS గుర్తింపు పొందిన ల్యాబ్‌లలో ఎక్కడ పరీక్షించవచ్చు?" },
        ],
      },
      consumer: {
        label: "వినియోగదారుడు (Consumer)",
        tagline: "కొనుగోలు చేసే ముందు తనిఖీ చేయండి. ISI మార్క్, 6-అంకెల HUID ధృవీకరించండి మరియు ఫిర్యాదు చేయండి.",
        description: "వినియోగదారుడు (హక్కులు, ధృవీకరణ & ఫిర్యాదు)",
        quickActions: [
          { label: "ISI & CML ధృవీకరణ", query: "BIS Care యాప్‌లో ఉత్పత్తి యొక్క ISI మార్క్ మరియు CML లైసెన్స్ నంబర్‌ను ఎలా ధృవీకరించాలి?" },
          { label: "బంగారు HUID ధృవీకరణ", query: "6-అంకెల HUID అంటే ఏమిటి మరియు బంగారు స్వచ్ఛతను ఎలా ధృవీకరించాలి?" },
          { label: "నకిలీ మార్క్ ఫిర్యాదు", query: "నకిలీ ISI మార్క్ లేదా నాణ్యత లేని ఉత్పత్తులపై BIS కి ఎలా ఫిర్యాదు చేయాలి?" },
          { label: "నాణ్యతా చిహ్నాలు", query: "భారతదేశంలో అధికారిక నాణ్యతా ధృవీకరణ చిహ్నాలను (ISI, హాల్‌మార్కింగ్, CRS) వివరించండి." },
        ],
      },
      manufacturer: {
        label: "తయారీదారు (Manufacturer)",
        tagline: "BIS స్కీమ్ 1 ఫ్యాక్టరీ ఆడిట్, ఇన్-హౌస్ ల్యాబ్ నిబంధనలు మరియు QCO ఆర్డర్‌లను అర్థం చేసుకోండి.",
        description: "తయారీదారు (స్కీమ్ 1 మరియు టెస్టింగ్)",
        quickActions: [
          { label: "వర్తించే ప్రమాణం", query: "నా ఉత్పత్తి కేటగిరీకి ఏ భారతీయ ప్రమాణం వర్తిస్తుంది?" },
          { label: "తప్పనిసరి QCO ఆర్డర్లు", query: "ఏయే ఉత్పత్తులకు క్వాలిటీ కంట్రోల్ ఆర్డర్లు (QCO) తప్పనిసరి చేయబడ్డాయి?" },
          { label: "ఫ్యాక్టరీ ఆడిట్ సంసిద్ధత", query: "BIS ఫ్యాక్టరీ ఆడిట్ కోసం ఏయే పరీక్షా పరికరాలు అవసరం?" },
          { label: "ఆప్షన్ 1 vs ఆప్షన్ 2", query: "స్కీమ్ 1 కింద సాధారణ మరియు సులభతర విధానానికి తేడా ఏమిటి?" },
        ],
      },
      jeweller: {
        label: "నగల వ్యాపారి (Jeweller)",
        tagline: "ఉచిత హాల్‌మార్కింగ్ రిజిస్ట్రేషన్, 6-అంకెల HUID మరియు AHC కేంద్రాల గైడ్.",
        description: "నగల వ్యాపారి (HUID మరియు హాల్‌మార్కింగ్)",
        quickActions: [
          { label: "6-అంకెల HUID నిబంధనలు", query: "బంగారు ఆభరణాలపై 6-అంకెల HUID హాల్‌మార్కింగ్ చట్టపరమైన నిబంధనలు ఏమిటి?" },
          { label: "ఉచిత రిజిస్ట్రేషన్", query: "Manakonline లో నగల వ్యాపారి హాల్‌మార్కింగ్ రిజిస్ట్రేషన్ విధానం ఏమిటి?" },
          { label: "AHC కేంద్ర సమర్పణ", query: "నగల వ్యాపారులు హాల్‌మార్కింగ్ కేంద్రాలలో బంగారాన్ని ఎలా సమర్పిస్తారు?" },
          { label: "స్వచ్ఛతా గ్రేడ్‌లు (IS 1417)", query: "IS 1417 కింద హాల్‌మార్కింగ్ కోసం ఏయే క్యారెట్ గ్రేడ్‌లు (14K నుండి 24K) అనుమతించబడ్డాయి?" },
        ],
      },
      student: {
        label: "విద్యార్థి / పరిశోధకుడు",
        tagline: "BIS ని సులభంగా అర్థం చేసుకోండి. ప్రమాణాల రూపకల్పన, నాణ్యతా ఉద్యమం మరియు వినియోగదారుల రక్షణ.",
        description: "విద్యార్థి (ప్రమాణాలు మరియు నాణ్యత)",
        quickActions: [
          { label: "BIS అంటే ఏమిటి?", query: "బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ అంటే ఏమిటి మరియు BIS చట్టం 2016 కింద దాని పాత్ర ఏమిటి?" },
          { label: "ప్రమాణాల రూపకల్పన", query: "BIS కమిటీలు భారతీయ ప్రమాణాలను ఎలా తయారు చేసి ప్రచురిస్తాయి?" },
          { label: "సర్టిఫికేషన్ రకాలు", query: "ఉత్పత్తి సర్టిఫికేషన్ (ISI) మరియు CRS మధ్య తేడా ఏమిటి?" },
          { label: "సిటిజన్స్ చార్టర్", query: "BIS సిటిజన్స్ చార్టర్ 2024 లో వినియోగదారులకు ఏయే హక్కులు కల్పించబడ్డాయి?" },
        ],
      },
      researcher: {
        label: "పరిశోధకుడు (Researcher)",
        tagline: "భారతీయ ప్రమాణాల కేటలాగ్, సాంకేతిక కమిటీలు మరియు ISO అమరికను అన్వేషించండి.",
        description: "సాంకేతిక పరిశోధకుడు (కేటలాగ్ & ISO)",
        quickActions: [
          { label: "కేటలాగ్ శోధన", query: "సాంకేతిక కమిటీల వారీగా భారతీయ ప్రమాణాల కేటలాగ్‌ను ఎలా శోధించాలి?" },
          { label: "ప్రమాణాల మెటాడేటా", query: "భారతీయ ప్రమాణాల కోసం ఏ మెటాడేటా నిర్వహించబడుతుంది?" },
          { label: "గెజిట్ QCO ఆర్డర్లు", query: "అధికారిక గెజిట్ నోటిఫికేషన్లు ఎక్కడ ప్రచురించబడతాయి?" },
          { label: "ISO/IEC అమరిక", query: "అంతర్జాతీయ ప్రమాణాలను భారతీయ ప్రమాణాలతో ఎలా సమలేఖనం చేస్తారు?" },
        ],
      },
      general: {
        label: "సాధారణ పౌరుడు",
        tagline: "BIS సాథీ ఈరోజు మీకు ఎలా సహాయపడుతుంది? భారతీయ ప్రమాణాలపై ఖచ్చితమైన సమాధానాలు.",
        description: "సాధారణ పౌరుడు (ప్రమాణాలు మరియు నాణ్యత)",
        quickActions: [
          { label: "ప్రమాణాన్ని కనుగొనండి", query: "ఒక నిర్దిష్ట ఉత్పత్తికి వర్తించే భారతీయ ప్రమాణాన్ని ఎలా కనుగొనాలి?" },
          { label: "ISI మార్క్ తనిఖీ", query: "ఉత్పత్తిపై ఉన్న ISI మార్క్ అసలైనదా కాదా అని ఎలా ధృవీకరించాలి?" },
          { label: "బంగారు HUID తనిఖీ", query: "6-అంకెల HUID అంటే ఏమిటి మరియు అసలైన హాల్‌మార్క్ బంగారాన్ని ఎలా తనిఖీ చేయాలి?" },
          { label: "50% MSME రాయితీ", query: "BIS లైసెన్స్ కోసం చిన్న పరిశ్రమలకు ఏయే ఫీజు రాయితీలు లభిస్తాయి?" },
        ],
      },
    },

    languageHeader: "భాషను ఎంచుకోండి (Select Language)",
    tickerLabel: "లైవ్ గెజిట్ టిక్కర్",
    tickerItems: [
      "QCO ఆర్డర్: స్టెయిన్‌లెస్ స్టీల్ ఉత్పత్తులపై IS 6911 / IS 1786 కింద తప్పనిసరి ISI మార్కింగ్ అవసరం.",
      "MSME ఊరట: Manakonline పోర్టల్‌లో చిన్న పరిశ్రమలకు 50% ఫీజు రాయితీ అందుబాటులో ఉంది.",
      "హాల్‌మార్కింగ్ అప్‌డేట్: 14K నుండి 24K బంగారు ఆభరణాలకు 6-అంకెల HUID తప్పనిసరి.",
      "వినియోగదారుల హెచ్చరిక: కొనుగోలుకు ముందు BIS Care యాప్‌లో CML లైసెన్స్ నంబర్ మరియు HUID ధృవీకరించండి.",
    ],

    heroTitle: "బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ అధికారిక AI అసిస్టెంట్",
    heroSubtitle: "భారతీయ ప్రమాణాలు, ISI సర్టిఫికేషన్, 6-అంకెల HUID మరియు ల్యాబ్‌ల శోధనపై అధికారిక మార్గదర్శకత్వం.",
    badgeSource: "100% మూలాధారమైనది",
    badgeQco: "యాక్టివ్ QCOలు కలవు",
    badgeCare: "BIS Care 2.0 సిద్ధం",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "కొత్త సంప్రదింపు",
    consultationsTitle: "సంప్రదింపుల చరిత్ర",
    searchHistoryPlaceholder: "చరిత్రను శోధించండి...",
    noPastChats: "గత సంప్రదింపులు ఏవీ లేవు",
    clearHistory: "అన్నీ తొలగించు",
    inputPlaceholder: "BIS సాథీని ప్రమాణాలు, లైసెన్సింగ్, HUID లేదా ల్యాబ్‌ల గురించి అడగండి...",
    micListening: "వింటోంది... మీ ప్రశ్న మాట్లాడండి",
    micError: "వాయిస్ రికగ్నిషన్‌లో లోపం. దయచేసి టైప్ చేయండి.",
    includeChecklist: "దశల వారీ చెక్‌లిస్ట్‌ను చేర్చండి",
    send: "పంపు",
    suggestedQuestions: "సూచించిన ప్రశ్నలు",
    sourceConfidence: "మూల విశ్వసనీయత",
    confHigh: "అధికం (ధృవీకరించబడింది)",
    confMed: "మధ్యస్థం",
    confLow: "చట్టబద్ధమైన నోటీసు",
    citationsTitle: "ధృవీకరించబడిన అధికారిక మూలాలు",
    actionCopy: "కాపీ చేయండి",
    actionCopied: "కాపీ చేయబడింది!",
    actionListen: "వినండి (TTS)",
    actionStop: "ఆపండి",
    actionDownload: "డౌన్‌లోడ్",
    actionPrint: "ప్రింట్",
    actionShare: "షేర్",
    checklistTitle: "విధానపరమైన సమ్మతి చెక్‌లిస్ట్",
    statutoryNotice: "అధికారిక BIS మార్గదర్శకత్వం",
    connectionError: "BIS సాథీ సర్వర్‌ను కనెక్ట్ చేయలేకపోయాము. దయచేసి పోర్ట్ 8000 తనిఖీ చేయండి.",

    findStandardTitle: "నా ప్రమాణాన్ని కనుగొనండి — భారతీయ ప్రమాణాల కేటలాగ్",
    findStandardSubtitle: "వర్తించే భారతీయ ప్రమాణం (IS) మరియు QCO ఆర్డర్‌లను కనుగొనడానికి ఉత్పత్తి పేరును నమోదు చేయండి.",
    findStandardSearchPlaceholder: "ఉదా. తాగునీరు, ప్రెజర్ కుక్కర్, ఫ్యాన్, బొమ్మలు, బంగారం, స్టీల్...",
    findStandardSearchBtn: "ప్రమాణాన్ని శోధించండి",
    findStandardSearching: "741+ ప్రమాణాలలో శోధిస్తోంది...",
    colStandard: "ప్రమాణం మరియు శీర్షిక",
    colStatus: "తప్పనిసరి స్థితి",
    colMatchScore: "మ్యాచ్ స్కోరు",
    colAction: "చర్య",
    qcoMandatory: "తప్పనిసరి QCO",
    voluntaryStandard: "ఐచ్ఛిక ప్రమాణం",
    btnAskBisAbout: "BIS మార్గదర్శకత్వం పొందండి",
    noStandardsFound: "ప్రమాణాలు ఏవీ సరిపోలలేదు. 'నీరు', 'కేబుల్స్', 'సిమెంట్' వంటి పదాలను ప్రయత్నించండి.",
    standardsCount: "కేటలాగ్‌లో {count} సంబంధిత ప్రమాణాలు కనుగొనబడ్డాయి",

    labTitle: "BIS LIMS ప్రయోగశాలల శోధన నెట్‌వర్క్",
    labSubtitle: "సిటిజన్స్ చార్టర్ గడువులతో భారతదేశం అంతటా అధికారిక BIS మరియు NABL ల్యాబ్‌లను కనుగొనండి.",
    labSearchProductPlaceholder: "ఉత్పత్తి లేదా విభాగం ద్వారా ఫిల్టర్ చేయండి...",
    labSearchLocationPlaceholder: "నగరం లేదా రాష్ట్రం ద్వారా ఫిల్టర్ చేయండి...",
    labSearchBtn: "ల్యాబ్‌ను శోధించండి",
    labSearching: "ల్యాబ్‌లను శోధిస్తోంది...",
    labDisciplineAll: "అన్ని విభాగాలు",
    labDisciplineChemical: "కెమికల్ & పాలిమర్స్",
    labDisciplineElectrical: "ఎలక్ట్రికల్ & ఎలక్ట్రానిక్స్",
    labDisciplineMechanical: "మెకానికల్ & లోహాలు",
    labDisciplineCivil: "సివిల్ & నిర్మాణం",
    labDisciplineFood: "ఫుడ్ & మైక్రోబయాలజీ",
    labTat: "పూర్తయ్యే సమయం (TAT)",
    labAddress: "చిరునామా",
    labContact: "సంప్రదింపు & ఇమెయిల్",
    labScope: "ముఖ్య పరీక్షల పరిధి",
    labOfficialLims: "అధికారిక LIMS పోర్టల్",
    labResultsCount: "{count} గుర్తింపు పొందిన ల్యాబ్‌లు చూపబడుతున్నాయి",

    verifyTitle: "అధికారిక గుర్తుల ధృవీకరణ గైడ్",
    verifySubtitle: "BIS Care యాప్‌లో నిజమైన ISI మార్క్, 6-అంకెల HUID మరియు CRS ఎలక్ట్రానిక్స్ గుర్తులను ఎలా ధృవీకరించాలో తెలుసుకోండి.",
    verifyTabIsi: "ISI మార్క్ (స్కీమ్ 1)",
    verifyTabHuid: "బంగారు హాల్‌మార్కింగ్ (HUID)",
    verifyTabCrs: "CRS రిజిస్ట్రేషన్",
    verifyTabGrievance: "ఫిర్యాదు చేయండి",
    verifyIsiHeading: "ISI మార్క్ మరియు CML లైసెన్స్ ఎలా ధృవీకరించాలి",
    verifyIsiDesc: "ప్రతి అసలైన ఉత్పత్తిపై పైన IS ప్రమాణ సంఖ్య మరియు క్రింద CML లైసెన్స్ సంఖ్య ఉంటాయి. BIS Care యాప్‌లో దీనిని ధృవీకరించండి.",
    verifyHuidHeading: "6-అంకెల HUID బంగారు హాల్‌మార్కింగ్",
    verifyHuidDesc: "నగలపై BIS లోగో, క్యారెట్ స్వచ్ఛత మరియు 6-అంకెల HUID కోడ్ ఉంటాయి. యాప్‌లో స్వచ్ఛతను వెంటనే నిర్ధారించుకోండి.",
    verifyCrsHeading: "ఎలక్ట్రానిక్స్ కోసం CRS రిజిస్ట్రేషన్",
    verifyCrsDesc: "మొబైల్, ల్యాప్‌టాప్ ఉత్పత్తులపై 'Registration No. R-XXXXXXXX' తో CRS లోగో ఉండటం తప్పనిసరి.",
    verifyGrievanceHeading: "నకిలీ గుర్తులపై ఫిర్యాదు చేయడం",
    verifyGrievanceDesc: "నకిలీ ISI మార్క్ లేదా తప్పుడు హాల్‌మార్కింగ్ కనిపిస్తే BIS Care యాప్ లేదా cmed@bis.gov.in ద్వారా ఫిర్యాదు చేయండి.",
    verifyDownloadCareApp: "అధికారిక BIS Care యాప్‌ను డౌన్‌లోడ్ చేసుకోండి",

    footerDisclaimer: "చట్టబద్ధమైన నిరాకరణ: BIS సాథీ అనేది బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ చట్టం 2016 ఆధారంగా రూపొందించబడిన AI అసిస్టెంట్. అధికారిక దరఖాస్తుల కోసం manakonline.in సందర్శించండి.",
    footerCopyright: "© 2026 బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS), భారత ప్రభుత్వం. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.",
    footerLinks: [
      { label: "BIS అధికారిక పోర్టల్", url: "https://www.bis.gov.in" },
      { label: "Manakonline పోర్టల్", url: "https://www.manakonline.in" },
      { label: "LIMS పోర్టల్", url: "https://lims.bis.gov.in" },
      { label: "సిటిజన్స్ చార్టర్", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // KANNADA (kn) — ಕನ್ನಡ
  // ───────────────────────────────────────────────────────────────────
  kn: {
    govIndia: "ಭಾರತ ಸರ್ಕಾರ | GOVERNMENT OF INDIA",
    ministry: "ಗ್ರಾಹಕ ವ್ಯವಹಾರಗಳು, ಆಹಾರ ಮತ್ತು ಸಾರ್ವಜನಿಕ ವಿತರಣಾ ಸಚಿವಾಲಯ",
    fontScale: "ಫಾಂಟ್:",
    voiceReadout: "ಧ್ವನಿ ಓದುವಿಕೆ",
    voiceOn: "(ಆನ್)",
    helpline: "ಸಹಾಯವಾಣಿ: 1912",

    bisTitle: "ಬಿಐಎಸ್ ಸಾಥಿ",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "ಸಮಾಲೋಚನೆ ಇತಿಹಾಸ",

    tabAskBis: "BIS ಅನ್ನು ಕೇಳಿ",
    tabFindStandard: "ನನ್ನ ಮಾನದಂಡ ಹುಡುಕಿ",
    tabLabs: "ಪ್ರಯೋಗಾಲಯಗಳು (LIMS)",
    tabVerifyMarks: "ಗುರುತುಗಳು & HUID ಪರಿಶೀಲಿಸಿ",

    personaHeader: "ಬಳಕೆದಾರರ ವಿವರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    personas: {
      msme: {
        label: "MSME (ಸಣ್ಣ ಉದ್ಯಮಗಳು)",
        tagline: "50% ಶುಲ್ಕ ರಿಯಾಯಿತಿ ಮತ್ತು ಪರೀಕ್ಷಾ ಬೆಂಬಲದೊಂದಿಗೆ ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು BIS-ಸಿದ್ಧಗೊಳಿಸಿ.",
        description: "MSME (ಉತ್ಪನ್ನ ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು 50% ರಿಯಾಯಿತಿ)",
        quickActions: [
          { label: "ಅನ್ವಯವಾಗುವ ಮಾನದಂಡ", query: "MSME ಉತ್ಪನ್ನಗಳಿಗೆ ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಮಾನದಂಡವನ್ನು ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?" },
          { label: "ಆಯ್ಕೆ 2 ಸುಲಭ ಪ್ರಕ್ರಿಯೆ", query: "ಉತ್ಪಾದನಾ ಪರವಾನಗಿ ಪಡೆಯುವ ಆಯ್ಕೆ 2 ಸುಲಭ ವಿಧಾನವನ್ನು ವಿವರಿಸಿ." },
          { label: "50% ಶುಲ್ಕ ರಿಯಾಯಿತಿ", query: "ಸ್ಕೀಮ್ 1 ರ ಅಡಿಯಲ್ಲಿ ಸಣ್ಣ ಉದ್ಯಮಗಳಿಗೆ ಯಾವ ಶುಲ್ಕ ರಿಯಾಯಿತಿಗಳು ಲಭ್ಯವಿದೆ?" },
          { label: "ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್‌ಗಳು", query: "MSME ಉತ್ಪನ್ನಗಳನ್ನು BIS ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್‌ಗಳಲ್ಲಿ ಎಲ್ಲಿ ಪರೀಕ್ಷಿಸಬಹುದು?" },
        ],
      },
      consumer: {
        label: "ಗ್ರಾಹಕ (Consumer)",
        tagline: "ಖರೀದಿಸುವ ಮುನ್ನ ಪರಿಶೀಲಿಸಿ. ISI ಮಾರ್ಕ್, 6-ಅಂಕಿಯ HUID ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದೂರು ದಾಖಲಿಸಿ.",
        description: "ಗ್ರಾಹಕ (ಹಕ್ಕುಗಳು, ಪರಿಶೀಲನೆ ಮತ್ತು ದೂರು)",
        quickActions: [
          { label: "ISI ಮತ್ತು CML ಪರಿಶೀಲನೆ", query: "BIS Care ಆಪ್‌ನಲ್ಲಿ ಉತ್ಪನ್ನದ ISI ಮಾರ್ಕ್ ಮತ್ತು CML ಪರವಾನಗಿ ಸಂಖ್ಯೆಯನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?" },
          { label: "ಚಿನ್ನದ HUID ಪರಿಶೀಲನೆ", query: "6-ಅಂಕಿಯ HUID ಎಂದರೇನು ಮತ್ತು ಚಿನ್ನದ ಶುದ್ಧತೆಯನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?" },
          { label: "ನಕಲಿ ಮಾರ್ಕ್ ದೂರು", query: "ನಕಲಿ ISI ಮಾರ್ಕ್ ಅಥವಾ ಕಳಪೆ ಉತ್ಪನ್ನಗಳ ಬಗ್ಗೆ BIS ಗೆ ಹೇಗೆ ದೂರು ನೀಡುವುದು?" },
          { label: "ಗುಣಮಟ್ಟದ ಗುರುತುಗಳು", query: "ಭಾರತದಲ್ಲಿನ ಅಧಿಕೃತ ಗುಣಮಟ್ಟದ ಪ್ರಮಾಣೀಕರಣ ಗುರುತುಗಳನ್ನು (ISI, ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್, CRS) ವಿವರಿಸಿ." },
        ],
      },
      manufacturer: {
        label: "ಉತ್ಪಾದಕ (Manufacturer)",
        tagline: "BIS ಸ್ಕೀಮ್ 1 ಫ್ಯಾಕ್ಟರಿ ಆಡಿಟ್, ಇನ್-ಹೌಸ್ ಲ್ಯಾಬ್ ನಿಯಮಗಳು ಮತ್ತು QCO ಆದೇಶಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
        description: "ಉತ್ಪಾದಕ (ಸ್ಕೀಮ್ 1 ಮತ್ತು ಪರೀಕ್ಷೆ)",
        quickActions: [
          { label: "ಅನ್ವಯವಾಗುವ ಮಾನದಂಡ", query: "ನನ್ನ ಉತ್ಪನ್ನಕ್ಕೆ ಯಾವ ಭಾರತೀಯ ಮಾನದಂಡ ಅನ್ವಯಿಸುತ್ತದೆ?" },
          { label: "ಕಡ್ಡಾಯ QCO ಆದೇಶಗಳು", query: "ಯಾವ ಉತ್ಪನ್ನಗಳಿಗೆ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶಗಳು (QCO) ಕಡ್ಡಾಯವಾಗಿವೆ?" },
          { label: "ಆಡಿಟ್ ಸಿದ್ಧತೆ", query: "BIS ಫ್ಯಾಕ್ಟರಿ ಆಡಿಟ್‌ಗೆ ಯಾವ ಪರೀಕ್ಷಾ ಉಪಕರಣಗಳು ಬೇಕಾಗುತ್ತವೆ?" },
          { label: "ಆಯ್ಕೆ 1 vs ಆಯ್ಕೆ 2", query: "ಸ್ಕೀಮ್ 1 ರ ಸಾಮಾನ್ಯ ಮತ್ತು ಸರಳ ಪ್ರಕ್ರಿಯೆಯ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?" },
        ],
      },
      jeweller: {
        label: "ಚಿನ್ನದ ವ್ಯಾಪಾರಿ (Jeweller)",
        tagline: "ಉಚಿತ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ನೋಂದಣಿ, 6-ಅಂಕಿಯ HUID ಮತ್ತು AHC ಕೇಂದ್ರಗಳ ಮಾರ್ಗದರ್ಶಿ.",
        description: "ಚಿನ್ನದ ವ್ಯಾಪಾರಿ (HUID ಮತ್ತು ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್)",
        quickActions: [
          { label: "6-ಅಂಕಿಯ HUID ನಿಯಮಗಳು", query: "ಚಿನ್ನಾಭರಣಗಳ ಮೇಲೆ 6-ಅಂಕಿಯ HUID ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ನಿಯಮಗಳೇನು?" },
          { label: "ಉಚಿತ ನೋಂದಣಿ", query: "Manakonline ನಲ್ಲಿ ವ್ಯಾಪಾರಿ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ನೋಂದಣಿಯ ಉಚಿತ ಪ್ರಕ್ರಿಯೆ ಏನು?" },
          { label: "AHC ಕೇಂದ್ರ ಸಲ್ಲಿಕೆ", query: "ವ್ಯಾಪಾರಿಗಳು ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಕೇಂದ್ರಗಳಿಗೆ ಚಿನ್ನವನ್ನು ಹೇಗೆ ಸಲ್ಲಿಸುತ್ತಾರೆ?" },
          { label: "ಶುದ್ಧತೆಯ ಶ್ರೇಣಿಗಳು (IS 1417)", query: "IS 1417 ರ ಅಡಿಯಲ್ಲಿ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್‌ಗೆ ಯಾವ ಕ್ಯಾರೆಟ್ ಶ್ರೇಣಿಗಳು (14K ನಿಂದ 24K) ಮಾನ್ಯವಾಗಿವೆ?" },
        ],
      },
      student: {
        label: "ವಿದ್ಯಾರ್ಥಿ / ಸಂಶೋಧಕ",
        tagline: "BIS ಅನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಮಾನದಂಡಗಳ ರಚನೆ, ಗುಣಮಟ್ಟ ಚಳವಳಿ ಮತ್ತು ಗ್ರಾಹಕ ರಕ್ಷಣೆ.",
        description: "ವಿದ್ಯಾರ್ಥಿ (ಮಾನದಂಡಗಳು ಮತ್ತು ಗುಣಮಟ್ಟ)",
        quickActions: [
          { label: "BIS ಎಂದರೇನು?", query: "ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬ್ಯೂರೋ ಎಂದರೇನು ಮತ್ತು BIS ಕಾಯ್ದೆ 2016 ರ ಅಡಿಯಲ್ಲಿ ಅದರ ಪಾತ್ರವೇನು?" },
          { label: "ಮಾನದಂಡಗಳ ರಚನೆ", query: "BIS ಸಮಿತಿಗಳು ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ಹೇಗೆ ರಚಿಸುತ್ತವೆ ಮತ್ತು ಪ್ರಕಟಿಸುತ್ತವೆ?" },
          { label: "ಪ್ರಮಾಣೀಕರಣದ ವಿಧಗಳು", query: "ಉತ್ಪನ್ನ ಪ್ರಮಾಣೀಕರಣ (ISI) ಮತ್ತು CRS ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?" },
          { label: "ಸಿಟಿಜನ್ಸ್ ಚಾರ್ಟರ್", query: "BIS ಸಿಟಿಜನ್ಸ್ ಚಾರ್ಟರ್ 2024 ರಲ್ಲಿ ಗ್ರಾಹಕರಿಗೆ ಯಾವ ಹಕ್ಕುಗಳನ್ನು ನೀಡಲಾಗಿದೆ?" },
        ],
      },
      researcher: {
        label: "ಸಂಶೋಧಕ (Researcher)",
        tagline: "ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಕ್ಯಾಟಲಾಗ್, ತಾಂತ್ರಿಕ ಸಮಿತಿಗಳು ಮತ್ತು ISO ಜೋಡಣೆಯನ್ನು ಅನ್ವೇಷಿಸಿ.",
        description: "ತಾಂತ್ರಿಕ ಸಂಶೋಧಕ (ಕ್ಯಾಟಲಾಗ್ ಮತ್ತು ISO)",
        quickActions: [
          { label: "ಕ್ಯಾಟಲಾಗ್ ಹುಡುಕಾಟ", query: "ತಾಂತ್ರಿಕ ಸಮಿತಿಯ ಪ್ರಕಾರ ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಕ್ಯಾಟಲಾಗ್ ಅನ್ನು ಹೇಗೆ ಹುಡುಕುವುದು?" },
          { label: "ಮಾನದಂಡಗಳ ಮೆಟಾಡೇಟಾ", query: "ಭಾರತೀಯ ಮಾನದಂಡಗಳಿಗಾಗಿ ಯಾವ ಮೆಟಾಡೇಟಾವನ್ನು ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ?" },
          { label: "ಗೆಜೆಟ್ QCO ಆದೇಶಗಳು", query: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ಅಧಿಸೂಚನೆಗಳು ಎಲ್ಲಿ ಪ್ರಕಟವಾಗುತ್ತವೆ?" },
          { label: "ISO/IEC ಜೋಡಣೆ", query: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಮಾನದಂಡಗಳನ್ನು ಭಾರತೀಯ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಹೇಗೆ ಜೋಡಿಸಲಾಗುತ್ತದೆ?" },
        ],
      },
      general: {
        label: "ಸಾಮಾನ್ಯ ನಾಗರಿಕ",
        tagline: "BIS ಸಾಥಿ ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಕುರಿತು ನಿಖರ ಉತ್ತರಗಳು.",
        description: "ಸಾಮಾನ್ಯ ನಾಗರಿಕ (ಮಾನದಂಡಗಳು ಮತ್ತು ಗುಣಮಟ್ಟ)",
        quickActions: [
          { label: "ಮಾನದಂಡ ಹುಡುಕಿ", query: "ನಿರ್ದಿಷ್ಟ ಉತ್ಪನ್ನಕ್ಕೆ ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಮಾನದಂಡವನ್ನು ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?" },
          { label: "ISI ಮಾರ್ಕ್ ಪರಿಶೀಲಿಸಿ", query: "ಉತ್ಪನ್ನದಲ್ಲಿರುವ ISI ಮಾರ್ಕ್ ಅಸಲಿಯೇ ಅಥವಾ ನಕಲಿಯೇ ಎಂದು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?" },
          { label: "ಚಿನ್ನದ HUID ಪರಿಶೀಲಿಸಿ", query: "6-ಅಂಕಿಯ HUID ಎಂದರೇನು ಮತ್ತು ಅಸಲಿ ಹಾಲ್‌ಮಾರ್ಕ್ ಚಿನ್ನವನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?" },
          { label: "50% MSME ರಿಯಾಯಿತಿ", query: "BIS ಪರವಾನಗಿಗಾಗಿ ಸಣ್ಣ ಉದ್ಯಮಗಳಿಗೆ ಯಾವ ಶುಲ್ಕ ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ?" },
        ],
      },
    },

    languageHeader: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Language)",
    tickerLabel: "ಲೈವ್ ಗೆಜೆಟ್ ಟಿಕ್ಕರ್",
    tickerItems: [
      "QCO ಆದೇಶ: ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ಉತ್ಪನ್ನಗಳಿಗೆ IS 6911 / IS 1786 ಅಡಿಯಲ್ಲಿ ಕಡ್ಡಾಯ ISI ಮಾರ್ಕಿಂಗ್ ಅಗತ್ಯವಿದೆ.",
      "MSME ಪರಿಹಾರ: Manakonline ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸಣ್ಣ ಉದ್ಯಮಗಳಿಗೆ 50% ಶುಲ್ಕ ರಿಯಾಯಿತಿ ಸಕ್ರಿಯವಾಗಿದೆ.",
      "ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಅಪ್ಡೇಟ್: 14K ನಿಂದ 24K ಚಿನ್ನಾಭರಣಗಳಿಗೆ 6-ಅಂಕಿಯ HUID ಕಡ್ಡಾಯವಾಗಿದೆ.",
      "ಗ್ರಾಹಕರ ಎಚ್ಚರಿಕೆ: ಖರೀದಿಸುವ ಮುನ್ನ BIS Care ಆಪ್‌ನಲ್ಲಿ CML ಪರವಾನಗಿ ಸಂಖ್ಯೆ ಮತ್ತು HUID ಪರಿಶೀಲಿಸಿ.",
    ],

    heroTitle: "ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬ್ಯೂರೋ ಅಧಿಕೃತ AI ಸಹಾಯಕ",
    heroSubtitle: "ಭಾರತೀಯ ಮಾನದಂಡಗಳು, ISI ಪ್ರಮಾಣೀಕರಣ, 6-ಅಂಕಿಯ HUID ಮತ್ತು ಲ್ಯಾಬ್‌ಗಳ ಹುಡುಕಾಟದ ಅಧಿಕೃತ ಮಾರ್ಗದರ್ಶನ.",
    badgeSource: "100% ಮೂಲ-ಆಧಾರಿತ",
    badgeQco: "ಸಕ್ರಿಯ QCO ಗಳಿವೆ",
    badgeCare: "BIS Care 2.0 ಸಿದ್ಧ",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "ಹೊಸ ಸಮಾಲೋಚನೆ",
    consultationsTitle: "ಸಮಾಲೋಚನೆ ಇತಿಹಾಸ",
    searchHistoryPlaceholder: "ಇತಿಹಾಸ ಹುಡುಕಿ...",
    noPastChats: "ಯಾವುದೇ ಹಿಂದಿನ ಸಮಾಲೋಚನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    clearHistory: "ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ",
    inputPlaceholder: "BIS ಸಾಥಿಯನ್ನು ಮಾನದಂಡಗಳು, ಪರವಾನಗಿ, HUID ಅಥವಾ ಲ್ಯಾಬ್‌ಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    micListening: "ಕೇಳುತ್ತಿದೆ... ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ",
    micError: "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.",
    includeChecklist: "ಹಂತ-ಹಂತದ ಪರಿಶೀಲನಾ ಪಟ್ಟಿಯನ್ನು ಸೇರಿಸಿ",
    send: "ಕಳುಹಿಸಿ",
    suggestedQuestions: "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು",
    sourceConfidence: "ಮೂಲ ವಿಶ್ವಾಸಾರ್ಹತೆ",
    confHigh: "ಉನ್ನತ (ಪರಿಶೀಲಿಸಲಾಗಿದೆ)",
    confMed: "ಮಧ್ಯಮ",
    confLow: "ಶಾಸನಬದ್ಧ ಸೂಚನೆ",
    citationsTitle: "ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ಮೂಲಗಳು",
    actionCopy: "ನಕಲಿಸಿ",
    actionCopied: "ನಕಲಿಸಲಾಗಿದೆ!",
    actionListen: "ಕೇಳಿ (TTS)",
    actionStop: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
    actionDownload: "ಡೌನ್‌ಲೋಡ್",
    actionPrint: "ಪ್ರಿಂಟ್",
    actionShare: "ಹಂಚಿಕೊಳ್ಳಿ",
    checklistTitle: "ಕಾರ್ಯವಿಧಾನದ ಅನುಸರಣಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    statutoryNotice: "ಅಧಿಕೃತ BIS ಮಾರ್ಗದರ್ಶನ",
    connectionError: "BIS ಸಾಥಿ ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಪೋರ್ಟ್ 8000 ಪರಿಶೀಲಿಸಿ.",

    findStandardTitle: "ನನ್ನ ಮಾನದಂಡ ಹುಡುಕಿ — ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಕ್ಯಾಟಲಾಗ್",
    findStandardSubtitle: "ಅನ್ವಯವಾಗುವ ಮಾನದಂಡ (IS) ಮತ್ತು QCO ಆದೇಶಗಳನ್ನು ಹುಡುಕಲು ಉತ್ಪನ್ನದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
    findStandardSearchPlaceholder: "ಉದಾ. ಕುಡಿಯುವ ನೀರು, ಪ್ರೆಶರ್ ಕುಕ್ಕರ್, ಫ್ಯಾನ್, ಆಟಿಕೆಗಳು, ಚಿನ್ನ, ಸ್ಟೀಲ್...",
    findStandardSearchBtn: "ಮಾನದಂಡ ಹುಡುಕಿ",
    findStandardSearching: "741+ ಮಾನದಂಡಗಳಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    colStandard: "ಮಾನದಂಡ ಮತ್ತು ಶೀರ್ಷಿಕೆ",
    colStatus: "ಕಡ್ಡಾಯ ಸ್ಥಿತಿ",
    colMatchScore: "ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್",
    colAction: "ಕ್ರಮ",
    qcoMandatory: "ಕಡ್ಡಾಯ QCO",
    voluntaryStandard: "ಐಚ್ಛಿಕ ಮಾನದಂಡ",
    btnAskBisAbout: "BIS ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ",
    noStandardsFound: "ಯಾವುದೇ ಮಾನದಂಡ ಹೊಂದಾಣಿಕೆಯಾಗಿಲ್ಲ. 'ನೀರು', 'ಕೇಬಲ್', 'ಸಿಮೆಂಟ್' ನಂತಹ ಪದಗಳನ್ನು ಹುಡುಕಿ.",
    standardsCount: "ಕ್ಯಾಟಲಾಗ್‌ನಲ್ಲಿ {count} ಸಂಬಂಧಿತ ಮಾನದಂಡಗಳು ಕಂಡುಬಂದಿವೆ",

    labTitle: "BIS LIMS ಪ್ರಯೋಗಾಲಯಗಳ ಹುಡುಕಾಟ ನೆಟ್‌ವರ್ಕ್",
    labSubtitle: "ಸಿಟಿಜನ್ಸ್ ಚಾರ್ಟರ್ ಗಡುವಿನೊಂದಿಗೆ ಭಾರತದಾದ್ಯಂತ ಅಧಿಕೃತ BIS ಮತ್ತು NABL ಲ್ಯಾಬ್‌ಗಳನ್ನು ಹುಡುಕಿ.",
    labSearchProductPlaceholder: "ಉತ್ಪನ್ನ ಅಥವಾ ವಿಭಾಗದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ...",
    labSearchLocationPlaceholder: "ನಗರ ಅಥವಾ ರಾಜ್ಯದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ...",
    labSearchBtn: "ಲ್ಯಾಬ್ ಹುಡುಕಿ",
    labSearching: "ಲ್ಯಾಬ್‌ಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    labDisciplineAll: "ಎಲ್ಲಾ ವಿಭಾಗಗಳು",
    labDisciplineChemical: "ರಾಸಾಯನಿಕ & ಪಾಲಿಮರ್‌ಗಳು",
    labDisciplineElectrical: "ಎಲೆಕ್ಟ್ರಿಕಲ್ & ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್",
    labDisciplineMechanical: "ಮೆಕ್ಯಾನಿಕಲ್ & ಲೋಹಗಳು",
    labDisciplineCivil: "ಸಿವಿಲ್ & ನಿರ್ಮಾಣ",
    labDisciplineFood: "ಆಹಾರ & ಮೈಕ್ರೋಬಯಾಲಜಿ",
    labTat: "ಪೂರ್ಣಗೊಳಿಸುವ ಸಮಯ (TAT)",
    labAddress: "ವಿಳಾಸ",
    labContact: "ಸಂಪರ್ಕ & ಇಮೇಲ್",
    labScope: "ಪ್ರಮುಖ ಪರೀಕ್ಷಾ ವ್ಯಾಪ್ತಿ",
    labOfficialLims: "ಅಧಿಕೃತ LIMS ಪೋರ್ಟಲ್",
    labResultsCount: "{count} ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್‌ಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲಾಗುತ್ತಿದೆ",

    verifyTitle: "ಅಧಿಕೃತ ಗುರುತುಗಳ ಪರಿಶೀಲನಾ ಮಾರ್ಗದರ್ಶಿ",
    verifySubtitle: "BIS Care ಆಪ್‌ನಲ್ಲಿ ಅಸಲಿ ISI ಮಾರ್ಕ್, 6-ಅಂಕಿಯ HUID ಮತ್ತು CRS ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಗುರುತುಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ ಎಂದು ತಿಳಿಯಿರಿ.",
    verifyTabIsi: "ISI ಮಾರ್ಕ್ (ಸ್ಕೀಮ್ 1)",
    verifyTabHuid: "ಚಿನ್ನದ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ (HUID)",
    verifyTabCrs: "CRS ನೋಂದಣಿ",
    verifyTabGrievance: "ದೂರು ದಾಖಲಿಸಿ",
    verifyIsiHeading: "ISI ಮಾರ್ಕ್ ಮತ್ತು CML ಪರವಾನಗಿ ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ",
    verifyIsiDesc: "ಪ್ರತಿಯೊಂದು ಅಸಲಿ ಉತ್ಪನ್ನದ ಮೇಲೆ ಮೇಲೆ IS ಮಾನದಂಡ ಸಂಖ್ಯೆ ಮತ್ತು ಕೆಳಗೆ CML ಪರವಾನಗಿ ಸಂಖ್ಯೆ ಇರುತ್ತದೆ. BIS Care ಆಪ್‌ನಲ್ಲಿ ಇದನ್ನು ಪರಿಶೀಲಿಸಿ.",
    verifyHuidHeading: "6-ಅಂಕಿಯ HUID ಚಿನ್ನದ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್",
    verifyHuidDesc: "ಆಭರಣಗಳ ಮೇಲೆ BIS ಲೋಗೋ, ಕ್ಯಾರೆಟ್ ಶುದ್ಧತೆ ಮತ್ತು 6-ಅಂಕಿಯ HUID ಕೋಡ್ ಇರುತ್ತದೆ. ಆಪ್‌ನಲ್ಲಿ ಶುದ್ಧತೆಯನ್ನು ತಕ್ಷಣ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    verifyCrsHeading: "ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ವಸ್ತುಗಳಿಗೆ CRS ನೋಂದಣಿ",
    verifyCrsDesc: "ಮೊಬೈಲ್, ಲ್ಯಾಪ್‌ಟಾಪ್ ಉತ್ಪನ್ನಗಳಲ್ಲಿ 'Registration No. R-XXXXXXXX' ನೊಂದಿಗೆ CRS ಲೋಗೋ ಇರುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ.",
    verifyGrievanceHeading: "ನಕಲಿ ಗುರುತುಗಳ ವಿರುದ್ಧ ದೂರು ನೀಡುವುದು",
    verifyGrievanceDesc: "ನಕಲಿ ISI ಮಾರ್ಕ್ ಅಥವಾ ತಪ್ಪು ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಕಂಡುಬಂದರೆ BIS Care ಆಪ್ ಅಥವಾ cmed@bis.gov.in ಮೂಲಕ ದೂರು ನೀಡಿ.",
    verifyDownloadCareApp: "ಅಧಿಕೃತ BIS Care ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",

    footerDisclaimer: "ಶಾಸನಬದ್ಧ ಹಕ್ಕು ನಿರಾಕರಣೆ: BIS ಸಾಥಿ ಎಂಬುದು ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬ್ಯೂರೋ ಕಾಯ್ದೆ 2016 ರ ಆಧಾರದ ಮೇಲೆ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ AI ಸಹಾಯಕವಾಗಿದೆ. ಅಧಿಕೃತ ಅರ್ಜಿಗಳಿಗಾಗಿ manakonline.in ಗೆ ಭೇಟಿ ನೀಡಿ.",
    footerCopyright: "© 2026 ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬ್ಯೂರೋ (BIS), ಭಾರತ ಸರ್ಕಾರ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    footerLinks: [
      { label: "BIS ಅಧಿಕೃತ ಪೋರ್ಟಲ್", url: "https://www.bis.gov.in" },
      { label: "Manakonline ಪೋರ್ಟಲ್", url: "https://www.manakonline.in" },
      { label: "LIMS ಪೋರ್ಟಲ್", url: "https://lims.bis.gov.in" },
      { label: "ಸಿಟಿಜನ್ಸ್ ಚಾರ್ಟರ್", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // MALAYALAM (ml) — മലയാളം
  // ───────────────────────────────────────────────────────────────────
  ml: {
    govIndia: "ഭാരത സർക്കാർ | GOVERNMENT OF INDIA",
    ministry: "ഉപഭോക്തൃകാര്യ, ഭക്ഷ്യ, പൊതുവിതരണ മന്ത്രാലയം",
    fontScale: "ഫോണ്ട്:",
    voiceReadout: "ശബ്ദ വായന",
    voiceOn: "(ഓൺ)",
    helpline: "ഹെൽപ്പ്‌ലൈൻ: 1912",

    bisTitle: "ബിഐഎസ് സാഥി",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "ആശയവിനിമയ ചരിത്രം",

    tabAskBis: "BIS-നോട് ചോദിക്കുക",
    tabFindStandard: "എന്റെ മാനദണ്ഡം കണ്ടെത്തുക",
    tabLabs: "ലബോറട്ടറികൾ (LIMS)",
    tabVerifyMarks: "മാർക്കുകളും HUID ഉം പരിശോധിക്കുക",

    personaHeader: "നിങ്ങളുടെ പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക",
    personas: {
      msme: {
        label: "MSME (ചെറുകിട വ്യവസായങ്ങൾ)",
        tagline: "50% ഫീസ് ഇളവോടും പരിശോധനാ പിന്തുണയോടും കൂടി നിങ്ങളുടെ ഉൽപ്പന്നം BIS-സജ്ജമാക്കുക.",
        description: "MSME (ഉൽപ്പന്ന സർട്ടിഫിക്കേഷനും 50% ഇളവും)",
        quickActions: [
          { label: "ബാധകമായ മാനദണ്ഡം", query: "MSME ഉൽപ്പന്നങ്ങൾക്ക് ബാധകമായ ഇന്ത്യൻ മാനദണ്ഡം എങ്ങനെ കണ്ടെത്താം?" },
          { label: "ഓപ്ഷൻ 2 ലളിതമായ പ്രക്രിയ", query: "മാനുഫാക്ചറിംഗ് ലൈസൻസ് നേടുന്നതിനുള്ള ഓപ്ഷൻ 2 ലളിതമായ രീതി വിശദീകരിക്കുക." },
          { label: "50% ഫീസ് ഇളവുകൾ", query: "സ്കീം 1 ന് കീഴിൽ ചെറുകിട സംരംഭങ്ങൾക്ക് എന്തൊക്കെ ഫീസ് ഇളവുകൾ ലഭ്യമാണ്?" },
          { label: "അംഗീകൃത ലാബുകൾ", query: "MSME ഉൽപ്പന്നങ്ങൾ BIS അംഗീകൃത ലാബുകളിൽ എവിടെ പരിശോധിക്കാം?" },
        ],
      },
      consumer: {
        label: "ഉപഭോക്താവ് (Consumer)",
        tagline: "വാങ്ങുന്നതിന് മുമ്പ് പരിശോധിക്കുക. ISI മാർക്ക്, 6-അക്ക HUID പരിശോധിച്ച് പരാതി നൽകുക.",
        description: "ഉപഭോക്താവ് (അവകാശങ്ങൾ, പരിശോധന & പരാതി)",
        quickActions: [
          { label: "ISI & CML പരിശോധന", query: "BIS Care ആപ്പിൽ ഉൽപ്പന്നത്തിന്റെ ISI മാർക്കും CML ലൈസൻസ് നമ്പറും എങ്ങനെ പരിശോധിക്കാം?" },
          { label: "സ്വർണ്ണ HUID പരിശോധന", query: "6-അക്ക HUID എന്താണ്, സ്വർണ്ണത്തിന്റെ പരിശുദ്ധി എങ്ങനെ പരിശോധിക്കാം?" },
          { label: "വ്യാജ മാർക്ക് പരാതി", query: "വ്യാജ ISI മാർക്ക് അല്ലെങ്കിൽ ഗുണനിലവാരമില്ലാത്ത ഉൽപ്പന്നങ്ങൾക്കെതിരെ BIS-ൽ എങ്ങനെ പരാതിപ്പെടാം?" },
          { label: "ഗുണനിലവാര അടയാളങ്ങൾ", query: "ഇന്ത്യയിലെ ഔദ്യോഗിക ഗുണനിലവാര സർട്ടിഫിക്കേഷൻ അടയാളങ്ങൾ (ISI, ഹാൾമാർക്കിംഗ്, CRS) വിശദീകരിക്കുക." },
        ],
      },
      manufacturer: {
        label: "നിർമ്മാതാവ് (Manufacturer)",
        tagline: "BIS സ്കീം 1 ഫാക്ടറി ഓഡിറ്റ്, ഇൻ-ഹൗസ് ലാബ് നിയമങ്ങൾ, QCO ഉത്തരവുകൾ മനസ്സിലാക്കുക.",
        description: "നിർമ്മാതാവ് (സ്കീം 1 ഉം പരിശോധനയും)",
        quickActions: [
          { label: "ബാധകമായ മാനദണ്ഡം", query: "എന്റെ ഉൽപ്പന്ന വിഭാഗത്തിന് ഏത് ഇന്ത്യൻ മാനദണ്ഡമാണ് ബാധകമാകുന്നത്?" },
          { label: "നിർബന്ധിത QCO ഉത്തരവുകൾ", query: "ഏതൊക്കെ ഉൽപ്പന്നങ്ങൾക്കാണ് ക്വാളിറ്റി കൺട്രോൾ ഓർഡറുകൾ (QCO) നിർബന്ധമാക്കിയിട്ടുള്ളത്?" },
          { label: "ഫാക്ടറി ഓഡിറ്റ് തയ്യാറെടുപ്പ്", query: "BIS ഫാക്ടറി ഓഡിറ്റിനായി ഏതൊക്കെ പരിശോധനാ ഉപകരണങ്ങൾ ആവശ്യമാണ്?" },
          { label: "ഓപ്ഷൻ 1 vs ഓപ്ഷൻ 2", query: "സ്കീം 1 ന് കീഴിലുള്ള സാധാരണ, ലളിതമായ രീതികൾ തമ്മിലുള്ള വ്യത്യാസമെന്താണ്?" },
        ],
      },
      jeweller: {
        label: "സ്വർണ്ണ വ്യാപാരി (Jeweller)",
        tagline: "സൗജന്യ ഹാൾമാർക്കിംഗ് രജിസ്ട്രേഷൻ, 6-അക്ക HUID, AHC സെന്റർ ഗൈഡ്.",
        description: "സ്വർണ്ണ വ്യാപാരി (HUID ഉം ഹാൾമാർക്കിംഗും)",
        quickActions: [
          { label: "6-അക്ക HUID നിയമങ്ങൾ", query: "സ്വർണ്ണാഭരണങ്ങളിൽ 6-അക്ക HUID ഹാൾമാർക്കിംഗിന്റെ നിയമപരമായ ചട്ടങ്ങൾ എന്തൊക്കെയാണ്?" },
          { label: "സൗജന്യ രജിസ്ട്രേഷൻ", query: "Manakonline-ൽ വ്യാപാരി ഹാൾമാർക്കിംഗ് രജിസ്ട്രേഷന്റെ സൗജന്യ രീതി എന്താണ്?" },
          { label: "AHC സെന്റർ സമർപ്പണം", query: "വ്യാപാരികൾ ഹാൾമാർക്കിംഗ് സെന്ററുകളിൽ സ്വർണ്ണം എങ്ങനെ സമർപ്പിക്കുന്നു?" },
          { label: "ശുദ്ധി ഗ്രേഡുകൾ (IS 1417)", query: "IS 1417 പ്രകാരം ഹാൾമാർക്കിംഗിനായി ഏതൊക്കെ കാരറ്റ് ഗ്രേഡുകൾ (14K മുതൽ 24K വരെ) അനുവദനീയമാണ്?" },
        ],
      },
      student: {
        label: "വിദ്യാർത്ഥി / ഗവേഷകൻ",
        tagline: "BIS ലളിതമായി മനസ്സിലാക്കുക. മാനദണ്ഡ രൂപീകരണം, ഗുണനിലവാര പ്രസ്ഥാനം, ഉപഭോക്തൃ സംരക്ഷണം.",
        description: "വിദ്യാർത്ഥി (മാനദണ്ഡങ്ങളും ഗുണനിലവാരവും)",
        quickActions: [
          { label: "എന്താണ് BIS?", query: "ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് എന്താണ്, BIS ആക്ട് 2016 ന് കീഴിൽ അതിന്റെ പങ്ക് എന്താണ്?" },
          { label: "മാനദണ്ഡ രൂപീകരണം", query: "BIS കമ്മിറ്റികൾ ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ എങ്ങനെ തയ്യാറാക്കുകയും പ്രസിദ്ധീകരിക്കുകയും ചെയ്യുന്നു?" },
          { label: "സർട്ടിഫിക്കേഷൻ തരങ്ങൾ", query: "ഉൽപ്പന്ന സർട്ടിഫിക്കേഷനും (ISI) CRS ഉം തമ്മിലുള്ള വ്യത്യാസമെന്താണ്?" },
          { label: "സിറ്റിസൺസ് ചാർട്ടർ", query: "BIS സിറ്റിസൺസ് ചാർട്ടർ 2024-ൽ ഉപഭോക്താക്കൾക്ക് എന്തൊക്കെ അവകാശങ്ങൾ നൽകിയിട്ടുണ്ട്?" },
        ],
      },
      researcher: {
        label: "ഗവേഷകൻ (Researcher)",
        tagline: "ഇന്ത്യൻ മാനദണ്ഡങ്ങളുടെ കാറ്റലോഗ്, സാങ്കേതിക സമിതികൾ, ISO സംയോജനം എന്നിവ പരിശോധിക്കുക.",
        description: "സാങ്കേതിക ഗവേഷകൻ (കാറ്റലോഗ് & ISO)",
        quickActions: [
          { label: "കാറ്റലോഗ് തിരയൽ", query: "സാങ്കേതിക സമിതി തിരിച്ച് ഇന്ത്യൻ മാനദണ്ഡങ്ങളുടെ കാറ്റലോഗ് എങ്ങനെ തിരയാം?" },
          { label: "മാനദണ്ഡ മെറ്റാഡാറ്റ", query: "ഇന്ത്യൻ മാനദണ്ഡങ്ങൾക്കായി എന്തൊക്കെ മെറ്റാഡാറ്റ സൂക്ഷിക്കുന്നുണ്ട്?" },
          { label: "ഗസറ്റ് QCO ഉത്തരവുകൾ", query: "ഔദ്യോഗിക ഗസറ്റ് വിജ്ഞാപനങ്ങൾ എവിടെയാണ് പ്രസിദ്ധീകരിക്കുന്നത്?" },
          { label: "ISO/IEC സംയോജനം", query: "അന്താരാഷ്ട്ര മാനദണ്ഡങ്ങൾ ഇന്ത്യൻ മാനദണ്ഡങ്ങളുമായി എങ്ങനെ പൊരുത്തപ്പെടുത്തുന്നു?" },
        ],
      },
      general: {
        label: "സാധാരണ പൗരൻ",
        tagline: "BIS സാഥിക്ക് ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും? ഇന്ത്യൻ മാനദണ്ഡങ്ങളിൽ കൃത്യമായ ഉത്തരങ്ങൾ.",
        description: "സാധാരണ പൗരൻ (മാനദണ്ഡങ്ങളും ഗുണനിലവാരവും)",
        quickActions: [
          { label: "മാനദണ്ഡം കണ്ടെത്തുക", query: "ഒരു നിർദ്ദിഷ്ട ഉൽപ്പന്നത്തിന് ബാധകമായ ഇന്ത്യൻ മാനദണ്ഡം എങ്ങനെ കണ്ടെത്താം?" },
          { label: "ISI മാർക്ക് പരിശോധിക്കുക", query: "ഉൽപ്പന്നത്തിലെ ISI മാർക്ക് യഥാർത്ഥമാണോ അല്ലയോ എന്ന് എങ്ങനെ പരിശോധിക്കാം?" },
          { label: "സ്വർണ്ണ HUID പരിശോധിക്കുക", query: "6-അക്ക HUID എന്താണ്, യഥാർത്ഥ ഹാൾമാർക്ക് സ്വർണ്ണം എങ്ങനെ പരിശോധിക്കാം?" },
          { label: "50% MSME ഇളവ്", query: "BIS ലൈസൻസിനായി ചെറുകിട സംരംഭങ്ങൾക്ക് എന്തൊക്കെ ഫീസ് ഇളവുകൾ ലഭിക്കും?" },
        ],
      },
    },

    languageHeader: "ഭാഷ തിരഞ്ഞെടുക്കുക (Select Language)",
    tickerLabel: "തത്സമയ ഗസറ്റ് ടിക്കർ",
    tickerItems: [
      "QCO ഉത്തരവ്: സ്റ്റെയിൻലെസ് സ്റ്റീൽ ഉൽപ്പന്നങ്ങൾക്ക് IS 6911 / IS 1786 പ്രകാരം നിർബന്ധിത ISI മാർക്കിംഗ് ആവശ്യമാണ്.",
      "MSME ആശ്വാസം: Manakonline പോർട്ടലിൽ ചെറുകിട സംരംഭങ്ങൾക്ക് 50% ഫീസ് ഇളവ് സജീവമാണ്.",
      "ഹാൾമാർക്കിംഗ് അപ്‌ഡേറ്റ്: 14K മുതൽ 24K സ്വർണ്ണാഭരണങ്ങൾക്ക് 6-അക്ക HUID നിർബന്ധമാണ്.",
      "ഉപഭോക്തൃ ജാഗ്രത: വാങ്ങുന്നതിന് മുമ്പ് BIS Care ആപ്പിൽ CML ലൈസൻസ് നമ്പറും HUID ഉം പരിശോധിക്കുക.",
    ],

    heroTitle: "ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് ഔദ്യോഗിക AI സഹായി",
    heroSubtitle: "ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ, ISI സർട്ടിഫിക്കേഷൻ, 6-അക്ക HUID, ലബോറട്ടറി കണ്ടെത്തൽ എന്നിവയിൽ വിശ്വസനീയമായ മാർഗ്ഗനിർദ്ദേശം.",
    badgeSource: "100% ഉറവിട-പിന്തുണയുള്ളത്",
    badgeQco: "സജീവ QCO കൾ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്",
    badgeCare: "BIS Care 2.0 സജ്ജം",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "പുതിയ സംഭാഷണം",
    consultationsTitle: "സംഭാഷണ ചരിത്രം",
    searchHistoryPlaceholder: "ചരിത്രം തിരയുക...",
    noPastChats: "മുമ്പത്തെ സംഭാഷണങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    clearHistory: "എല്ലാം മായ്ക്കുക",
    inputPlaceholder: "BIS സാഥിയോട് മാനദണ്ഡങ്ങൾ, ലൈസൻസ്, HUID അല്ലെങ്കിൽ ലാബുകളെക്കുറിച്ച് ചോദിക്കുക...",
    micListening: "കേൾക്കുന്നു... നിങ്ങളുടെ ചോദ്യം സംസാരിക്കുക",
    micError: "ശബ്ദം തിരിച്ചറിയുന്നതിൽ പിശക്. ദയവായി ടൈപ്പ് ചെയ്യുക.",
    includeChecklist: "ഘട്ടം ഘട്ടമായുള്ള ചെക്ക്‌ലിസ്റ്റ് ഉൾപ്പെടുത്തുക",
    send: "അയക്കുക",
    suggestedQuestions: "നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ",
    sourceConfidence: "ഉറവിട വിശ്വാസ്യത",
    confHigh: "ഉയർന്നത് (പരിശോധിച്ചു)",
    confMed: "ഇടത്തരം",
    confLow: "നിയമപരമായ അറിയിപ്പ്",
    citationsTitle: "പരിശോധിച്ച ഔദ്യോഗിക ഉറവിടങ്ങൾ",
    actionCopy: "പകർത്തുക",
    actionCopied: "പകർത്തി!",
    actionListen: "കേൾക്കുക (TTS)",
    actionStop: "ശബ്ദം നിർത്തുക",
    actionDownload: "ഡൗൺലോഡ്",
    actionPrint: "പ്രിന്റ് ചെയ്യുക",
    actionShare: "പങ്കിടുക",
    checklistTitle: "നടപടിക്രമ പാലിക്കൽ ചെക്ക്‌ലിസ്റ്റ്",
    statutoryNotice: "ഔദ്യോഗിക BIS മാർഗ്ഗനിർദ്ദേശം",
    connectionError: "BIS സാഥി സെർവറുമായി ബന്ധപ്പെടാൻ കഴിഞ്ഞില്ല. പോർട്ട് 8000 പരിശോധിക്കുക.",

    findStandardTitle: "എന്റെ മാനദണ്ഡം കണ്ടെത്തുക — ഇന്ത്യൻ മാനദണ്ഡ കാറ്റലോഗ്",
    findStandardSubtitle: "ബാധകമായ ഇന്ത്യൻ മാനദണ്ഡവും (IS) QCO ഉത്തരവുകളും കണ്ടെത്താൻ ഉൽപ്പന്നത്തിന്റെ പേര് നൽകുക.",
    findStandardSearchPlaceholder: "ഉദാ. കുടിവെള്ളം, പ്രഷർ കുക്കർ, ഫാൻ, കളിപ്പാട്ടങ്ങൾ, സ്വർണ്ണം, സ്റ്റീൽ...",
    findStandardSearchBtn: "മാനദണ്ഡം തിരയുക",
    findStandardSearching: "741+ മാനദണ്ഡങ്ങളിൽ തിരയുന്നു...",
    colStandard: "മാനദണ്ഡവും ശീർഷകവും",
    colStatus: "നിർബന്ധിത പദവി",
    colMatchScore: "പൊരുത്ത സ്കോർ",
    colAction: "നടപടി",
    qcoMandatory: "നിർബന്ധിത QCO",
    voluntaryStandard: "ഐച്ഛിക മാനദണ്ഡം",
    btnAskBisAbout: "BIS മാർഗ്ഗനിർദ്ദേശം തേടുക",
    noStandardsFound: "മാനദണ്ഡങ്ങളൊന്നും പൊരുത്തപ്പെടുന്നില്ല. 'വെള്ളം', 'കേബിളുകൾ', 'സിമന്റ്' പോലുള്ള പദങ്ങൾ പരീക്ഷിക്കുക.",
    standardsCount: "കാറ്റലോഗിൽ {count} അനുയോജ്യമായ മാനദണ്ഡങ്ങൾ കണ്ടെത്തി",

    labTitle: "BIS LIMS ലബോറട്ടറി കണ്ടെത്തൽ ശൃംഖല",
    labSubtitle: "സിറ്റിസൺസ് ചാർട്ടർ സമയപരിധിയോടെ ഇന്ത്യയിലുടനീളമുള്ള ഔദ്യോഗിക BIS, NABL അംഗീകൃത ലാബുകൾ കണ്ടെത്തുക.",
    labSearchProductPlaceholder: "ഉൽപ്പന്നം അല്ലെങ്കിൽ വിഭാഗം അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക...",
    labSearchLocationPlaceholder: "നഗരം അല്ലെങ്കിൽ സംസ്ഥാനം അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക...",
    labSearchBtn: "ലാബ് തിരയുക",
    labSearching: "ലാബുകൾ തിരയുന്നു...",
    labDisciplineAll: "എല്ലാ വിഭാഗങ്ങളും",
    labDisciplineChemical: "കെമിക്കൽ & പോളിമറുകൾ",
    labDisciplineElectrical: "ഇലക്ട്രിക്കൽ & ഇലക്ട്രോണിക്സ്",
    labDisciplineMechanical: "മെക്കാനിക്കൽ & ലോഹങ്ങൾ",
    labDisciplineCivil: "സിവിൽ & നിർമ്മാണം",
    labDisciplineFood: "ഭക്ഷണം & മൈക്രോബയോളജി",
    labTat: "പൂർത്തിയാക്കൽ സമയം (TAT)",
    labAddress: "വിലാസം",
    labContact: "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ & ഇമെയിൽ",
    labScope: "പ്രധാന പരിശോധനാ പരിധി",
    labOfficialLims: "ഔദ്യോഗിക LIMS പോർട്ടൽ",
    labResultsCount: "{count} അംഗീകൃത ലാബുകൾ കാണിക്കുന്നു",

    verifyTitle: "ഔദ്യോഗിക അടയാളങ്ങൾ പരിശോധനാ ഗൈഡ്",
    verifySubtitle: "BIS Care ആപ്പിൽ യഥാർത്ഥ ISI മാർക്ക്, 6-അക്ക HUID, CRS ഇലക്ട്രോണിക്സ് അടയാളങ്ങൾ എങ്ങനെ പരിശോധിക്കാമെന്ന് മനസ്സിലാക്കുക.",
    verifyTabIsi: "ISI മാർക്ക് (സ്കീം 1)",
    verifyTabHuid: "സ്വർണ്ണ ഹാൾമാർക്കിംഗ് (HUID)",
    verifyTabCrs: "CRS രജിസ്ട്രേഷൻ",
    verifyTabGrievance: "പരാതി നൽകുക",
    verifyIsiHeading: "ISI മാർക്കും CML ലൈസൻസും എങ്ങനെ പരിശോധിക്കാം",
    verifyIsiDesc: "ഓരോ യഥാർത്ഥ ഉൽപ്പന്നത്തിലും മുകളിൽ IS മാനദണ്ഡ നമ്പറും താഴെ CML ലൈസൻസ് നമ്പറും ഉണ്ടാകും. BIS Care ആപ്പിൽ ഇത് പരിശോധിക്കുക.",
    verifyHuidHeading: "6-അക്ക HUID സ്വർണ്ണ ഹാൾമാർക്കിംഗ്",
    verifyHuidDesc: "ആഭരണങ്ങളിൽ BIS ലോഗോ, കാരറ്റ് പരിശുദ്ധി, 6-അക്ക HUID കോഡ് എന്നിവ ഉണ്ടാകും. ആപ്പിൽ പരിശുദ്ധി ഉടനടി സ്ഥിരീകരിക്കുക.",
    verifyCrsHeading: "ഇലക്ട്രോണിക്സ് ഉൽപ്പന്നങ്ങൾക്കുള്ള CRS രജിസ്ട്രേഷൻ",
    verifyCrsDesc: "മൊബൈൽ, ലാപ്ടോപ്പ് ഉൽപ്പന്നങ്ങളിൽ 'Registration No. R-XXXXXXXX' സഹിതം CRS ലോഗോ ഉണ്ടായിരിക്കണം.",
    verifyGrievanceHeading: "വ്യാജ അടയാളങ്ങൾക്കെതിരെ പരാതി നൽകൽ",
    verifyGrievanceDesc: "വ്യാജ ISI മാർക്കോ തെറ്റായ ഹാൾമാർക്കിംഗോ ശ്രദ്ധയിൽപ്പെട്ടാൽ BIS Care ആപ്പ് അല്ലെങ്കിൽ cmed@bis.gov.in വഴി പരാതിപ്പെടുക.",
    verifyDownloadCareApp: "ഔദ്യോഗിക BIS Care ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക",

    footerDisclaimer: "നിയമപരമായ നിരാകരണം: ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് ആക്ട് 2016-നെ അടിസ്ഥാനമാക്കി വികസിപ്പിച്ച AI സഹായിയാണ് BIS സാഥി. ഔദ്യോഗിക അപേക്ഷകൾക്കായി manakonline.in സന്ദർശിക്കുക.",
    footerCopyright: "© 2026 ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് (BIS), ഭാരത സർക്കാർ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    footerLinks: [
      { label: "BIS ഔദ്യോഗിക പോർട്ടൽ", url: "https://www.bis.gov.in" },
      { label: "Manakonline പോർട്ടൽ", url: "https://www.manakonline.in" },
      { label: "LIMS പോർട്ടൽ", url: "https://lims.bis.gov.in" },
      { label: "സിറ്റിസൺസ് ചാർട്ടർ", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // PUNJABI (pa) — ਪੰਜਾਬੀ
  // ───────────────────────────────────────────────────────────────────
  pa: {
    govIndia: "ਭਾਰਤ ਸਰਕਾਰ | GOVERNMENT OF INDIA",
    ministry: "ਉਪਭੋਗਤਾ ਮਾਮਲੇ, ਖੁਰਾਕ ਅਤੇ ਜਨਤਕ ਵੰਡ ਮੰਤਰਾਲਾ",
    fontScale: "ਫੌਂਟ:",
    voiceReadout: "ਆਵਾਜ਼ ਪੜ੍ਹਨਾ",
    voiceOn: "(ਚਾਲੂ)",
    helpline: "ਹੈਲਪਲਾਈਨ: 1912",

    bisTitle: "ਬੀਆਈਐਸ ਸਾਥੀ",
    bisHindiTitle: "BIS Saathi",
    bisMotto: "मानक: पथप्रदर्शक:",
    sihBadge: "",
    toggleSidebar: "ਸਲਾਹ-ਮਸ਼ਵਰਾ ਇਤਿਹਾਸ",

    tabAskBis: "BIS ਨੂੰ ਪੁੱਛੋ",
    tabFindStandard: "ਮੇਰਾ ਸਟੈਂਡਰਡ ਲੱਭੋ",
    tabLabs: "ਪ੍ਰਯੋਗਸ਼ਾਲਾਵਾਂ (LIMS)",
    tabVerifyMarks: "ਮਾਰਕ ਅਤੇ HUID ਤਸਦੀਕ ਕਰੋ",

    personaHeader: "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਚੁਣੋ",
    personas: {
      msme: {
        label: "MSME (ਛੋਟੇ ਉਦਯੋਗ)",
        tagline: "50% ਫੀਸ ਛੋਟ ਅਤੇ ਟੈਸਟਿੰਗ ਸਹਾਇਤਾ ਨਾਲ ਆਪਣੇ ਉਤਪਾਦ ਨੂੰ BIS-ਤਿਆਰ ਬਣਾਓ।",
        description: "MSME (ਉਤਪਾਦ ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ 50% ਛੋਟ)",
        quickActions: [
          { label: "ਲਾਗੂ ਸਟੈਂਡਰਡ ਲੱਭੋ", query: "MSME ਉਤਪਾਦਾਂ ਲਈ ਲਾਗੂ ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਕਿਵੇਂ ਲੱਭਣਾ ਹੈ?" },
          { label: "ਵਿਕਲਪ 2 ਸਰਲ ਪ੍ਰਕਿਰਿਆ", query: "ਮੈਨੂਫੈਕਚਰਿੰਗ ਲਾਇਸੈਂਸ ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਵਿਕਲਪ 2 ਸਰਲ ਪ੍ਰਕਿਰਿਆ ਦੱਸੋ।" },
          { label: "50% ਫੀਸ ਛੋਟ", query: "ਸਕੀਮ 1 ਅਧੀਨ ਛੋਟੇ ਉਦਯੋਗਾਂ ਲਈ ਕਿਹੜੀਆਂ ਫੀਸ ਛੋਟਾਂ ਉਪਲਬਧ ਹਨ?" },
          { label: "ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਲੈਬਾਂ", query: "MSME ਉਤਪਾਦਾਂ ਦੀ ਟੈਸਟਿੰਗ BIS ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਲੈਬਾਂ ਵਿੱਚ ਕਿੱਥੇ ਕਰਵਾ ਸਕਦੇ ਹਨ?" },
        ],
      },
      consumer: {
        label: "ਖਪਤਕਾਰ (Consumer)",
        tagline: "ਖਰੀਦਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਕਰੋ। ISI ਮਾਰਕ, 6-ਅੰਕਾਂ ਦਾ HUID ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ।",
        description: "ਖਪਤਕਾਰ (ਅਧਿਕਾਰ, ਤਸਦੀਕ ਅਤੇ ਸ਼ਿਕਾਇਤ)",
        quickActions: [
          { label: "ISI ਅਤੇ CML ਤਸਦੀਕ", query: "BIS Care ਐਪ 'ਤੇ ਉਤਪਾਦ ਦੇ ISI ਮਾਰਕ ਅਤੇ CML ਲਾਇਸੈਂਸ ਨੰਬਰ ਦੀ ਤਸਦੀਕ ਕਿਵੇਂ ਕਰੀਏ?" },
          { label: "ਸੋਨੇ ਦਾ HUID ਤਸਦੀਕ", query: "6-ਅੰਕਾਂ ਦਾ HUID ਕੀ ਹੈ ਅਤੇ ਖਪਤਕਾਰ ਸੋਨੇ ਦੀ ਸ਼ੁੱਧਤਾ ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਕਰਨ?" },
          { label: "ਨਕਲੀ ਮਾਰਕ ਦੀ ਸ਼ਿਕਾਇਤ", query: "ਨਕਲੀ ISI ਮਾਰਕ ਜਾਂ ਘਟੀਆ ਉਤਪਾਦਾਂ ਵਿਰੁੱਧ BIS ਵਿੱਚ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰੀਏ?" },
          { label: "ਲਾਜ਼ਮੀ ਗੁਣਵੱਤਾ ਮਾਰਕ", query: "ਭਾਰਤ ਵਿੱਚ ਅਧਿਕਾਰਤ ਗੁਣਵੱਤਾ ਪ੍ਰਮਾਣੀਕਰਨ ਚਿੰਨ੍ਹ (ISI, ਹਾਲਮਾਰਕਿੰਗ, CRS) ਸਮਝਾਓ।" },
        ],
      },
      manufacturer: {
        label: "ਨਿਰਮਾਤਾ (Manufacturer)",
        tagline: "BIS ਸਕੀਮ 1 ਫੈਕਟਰੀ ਆਡਿਟ, ਇਨ-ਹਾਊਸ ਲੈਬ ਨਿਯਮ ਅਤੇ QCO ਆਦੇਸ਼ ਸਮਝੋ।",
        description: "ਨਿਰਮਾਤਾ (ਸਕੀਮ 1 ਅਤੇ ਟੈਸਟਿੰਗ)",
        quickActions: [
          { label: "ਲਾਗੂ ਸਟੈਂਡਰਡ", query: "ਮੇਰੀ ਉਤਪਾਦ ਸ਼੍ਰੇਣੀ 'ਤੇ ਕਿਹੜਾ ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਲਾਗੂ ਹੁੰਦਾ ਹੈ?" },
          { label: "ਲਾਜ਼ਮੀ QCO ਆਦੇਸ਼", query: "ਕਿਹੜੇ ਉਤਪਾਦਾਂ 'ਤੇ ਕੁਆਲਿਟੀ ਕੰਟਰੋਲ ਆਰਡਰ (QCO) ਲਾਜ਼ਮੀ ਹਨ?" },
          { label: "ਫੈਕਟਰੀ ਆਡਿਟ ਤਿਆਰੀ", query: "BIS ਫੈਕਟਰੀ ਆਡਿਟ ਲਈ ਕਿਹੜੇ ਟੈਸਟਿੰਗ ਉਪਕਰਣ ਲੋੜੀਂਦੇ ਹਨ?" },
          { label: "ਵਿਕਲਪ 1 ਬਨਾਮ ਵਿਕਲਪ 2", query: "ਸਕੀਮ 1 ਅਧੀਨ ਆਮ ਅਤੇ ਸਰਲ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਕੀ ਅੰਤਰ ਹੈ?" },
        ],
      },
      jeweller: {
        label: "ਸੁਨਿਆਰੇ (Jeweller)",
        tagline: "ਜ਼ੀਰੋ-ਫੀਸ ਹਾਲਮਾਰਕਿੰਗ ਰਜਿਸਟ੍ਰੇਸ਼ਨ, 6-ਅੰਕਾਂ ਦਾ HUID ਅਤੇ AHC ਸੈਂਟਰ ਗਾਈਡ।",
        description: "ਸੁਨਿਆਰੇ (HUID ਅਤੇ ਹਾਲਮਾਰਕਿੰਗ)",
        quickActions: [
          { label: "6-ਅੰਕਾਂ ਦੇ HUID ਨਿਯਮ", query: "ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ 'ਤੇ 6-ਅੰਕਾਂ ਦੇ HUID ਹਾਲਮਾਰਕਿੰਗ ਦੇ ਕਾਨੂੰਨੀ ਨਿਯਮ ਕੀ ਹਨ?" },
          { label: "ਜ਼ੀਰੋ-ਫੀਸ ਰਜਿਸਟ੍ਰੇਸ਼ਨ", query: "Manakonline 'ਤੇ ਜਵੈਲਰ ਹਾਲਮਾਰਕਿੰਗ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਦੀ ਮੁਫ਼ਤ ਪ੍ਰਕਿਰਿਆ ਕੀ ਹੈ?" },
          { label: "AHC ਸੈਂਟਰ ਜਮ੍ਹਾਂ ਕਰਵਾਉਣਾ", query: "ਜਵੈਲਰ ਹਾਲਮਾਰਕਿੰਗ ਸੈਂਟਰਾਂ 'ਤੇ ਸੋਨਾ ਕਿਵੇਂ ਜਮ੍ਹਾਂ ਕਰਵਾਉਂਦੇ ਹਨ?" },
          { label: "ਸ਼ੁੱਧਤਾ ਗ੍ਰੇਡ (IS 1417)", query: "IS 1417 ਅਧੀਨ ਹਾਲਮਾਰਕਿੰਗ ਲਈ ਕਿਹੜੇ ਕੈਰੇਟ ਗ੍ਰੇਡ (14K ਤੋਂ 24K) ਪ੍ਰਵਾਨਿਤ ਹਨ?" },
        ],
      },
      student: {
        label: "ਵਿਦਿਆਰਥੀ / ਖੋਜਕਰਤਾ",
        tagline: "BIS ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਸਮਝੋ। ਸਟੈਂਡਰਡ ਨਿਰਮਾਣ, ਗੁਣਵੱਤਾ ਲਹਿਰ ਅਤੇ ਖਪਤਕਾਰ ਸੁਰੱਖਿਆ।",
        description: "ਵਿਦਿਆਰਥੀ (ਸਟੈਂਡਰਡ ਅਤੇ ਗੁਣਵੱਤਾ)",
        quickActions: [
          { label: "BIS ਕੀ ਹੈ?", query: "ਬਿਊਰੋ ਆਫ਼ ਇੰਡੀਅਨ ਸਟੈਂਡਰਡਜ਼ ਕੀ ਹੈ ਅਤੇ BIS ਐਕਟ 2016 ਅਧੀਨ ਇਸਦੀ ਕੀ ਭੂਮਿਕਾ ਹੈ?" },
          { label: "ਸਟੈਂਡਰਡ ਨਿਰਮਾਣ", query: "BIS ਕਮੇਟੀਆਂ ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਕਿਵੇਂ ਤਿਆਰ ਅਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਦੀਆਂ ਹਨ?" },
          { label: "ਸਰਟੀਫਿਕੇਸ਼ਨ ਦੀਆਂ ਕਿਸਮਾਂ", query: "ਉਤਪਾਦ ਪ੍ਰਮਾਣੀਕਰਨ (ISI) ਅਤੇ CRS ਵਿੱਚ ਕੀ ਅੰਤਰ ਹੈ?" },
          { label: "ਸਿਟੀਜ਼ਨ ਚਾਰਟਰ", query: "BIS ਸਿਟੀਜ਼ਨ ਚਾਰਟਰ 2024 ਵਿੱਚ ਖਪਤਕਾਰਾਂ ਨੂੰ ਕਿਹੜੇ ਅਧਿਕਾਰ ਦਿੱਤੇ ਗਏ ਹਨ?" },
        ],
      },
      researcher: {
        label: "ਖੋਜਕਰਤਾ (Researcher)",
        tagline: "ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਕੈਟਾਲਾਗ, ਤਕਨੀਕੀ ਕਮੇਟੀਆਂ ਅਤੇ ISO ਇਕਸਾਰਤਾ ਦੀ ਖੋਜ ਕਰੋ।",
        description: "ਤਕਨੀਕੀ ਖੋਜਕਰਤਾ (ਕੈਟਾਲਾਗ ਅਤੇ ISO)",
        quickActions: [
          { label: "ਕੈਟਾਲਾਗ ਖੋਜ", query: "ਤਕਨੀਕੀ ਕਮੇਟੀ ਅਨੁਸਾਰ ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਕੈਟਾਲਾਗ ਕਿਵੇਂ ਖੋਜਣਾ ਹੈ?" },
          { label: "ਸਟੈਂਡਰਡ ਮੈਟਾਡੇਟਾ", query: "ਭਾਰਤੀ ਸਟੈਂਡਰਡਾਂ ਲਈ ਕਿਹੜਾ ਮੈਟਾਡੇਟਾ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?" },
          { label: "ਗਜ਼ਟ QCO ਆਦੇਸ਼", query: "ਸਰਕਾਰੀ ਗਜ਼ਟ ਨੋਟੀਫਿਕੇਸ਼ਨ ਕਿੱਥੇ ਪ੍ਰਕਾਸ਼ਿਤ ਹੁੰਦੇ ਹਨ?" },
          { label: "ISO/IEC ਇਕਸਾਰਤਾ", query: "ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਟੈਂਡਰਡਾਂ ਨੂੰ ਭਾਰਤੀ ਸਟੈਂਡਰਡਾਂ ਨਾਲ ਕਿਵੇਂ ਮੇਲਿਆ ਜਾਂਦਾ ਹੈ?" },
        ],
      },
      general: {
        label: "ਆਮ ਨਾਗਰਿਕ",
        tagline: "BIS ਸਾਥੀ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ? ਭਾਰਤੀ ਸਟੈਂਡਰਡਾਂ 'ਤੇ ਸਹੀ ਜਵਾਬ।",
        description: "ਆਮ ਨਾਗਰਿਕ (ਸਟੈਂਡਰਡ ਅਤੇ ਗੁਣਵੱਤਾ)",
        quickActions: [
          { label: "ਸਟੈਂਡਰਡ ਲੱਭੋ", query: "ਕਿਸੇ ਖਾਸ ਉਤਪਾਦ ਲਈ ਲਾਗੂ ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਕਿਵੇਂ ਲੱਭਣਾ ਹੈ?" },
          { label: "ISI ਮਾਰਕ ਜਾਂਚੋ", query: "ਉਤਪਾਦ 'ਤੇ ISI ਮਾਰਕ ਅਸਲੀ ਹੈ ਜਾਂ ਨਹੀਂ ਇਹ ਕਿਵੇਂ ਤਸਦੀਕ ਕਰੀਏ?" },
          { label: "ਸੋਨੇ ਦਾ HUID ਜਾਂਚੋ", query: "6-ਅੰਕਾਂ ਦਾ HUID ਕੀ ਹੈ ਅਤੇ ਅਸਲੀ ਹਾਲਮਾਰਕ ਸੋਨੇ ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਕਰੀਏ?" },
          { label: "50% MSME ਛੋਟ", query: "BIS ਲਾਇਸੈਂਸ ਲਈ ਛੋਟੇ ਉਦਯੋਗਾਂ ਨੂੰ ਕਿਹੜੀ ਫੀਸ ਛੋਟ ਮਿਲਦੀ ਹੈ?" },
        ],
      },
    },

    languageHeader: "ਭਾਸ਼ਾ ਚੁਣੋ (Select Language)",
    tickerLabel: "ਲਾਈਵ ਗਜ਼ਟ ਟਿੱਕਰ",
    tickerItems: [
      "QCO ਆਦੇਸ਼: ਸਟੇਨਲੈਸ ਸਟੀਲ ਉਤਪਾਦਾਂ 'ਤੇ IS 6911 / IS 1786 ਅਧੀਨ ਲਾਜ਼ਮੀ ISI ਮਾਰਕਿੰਗ ਜ਼ਰੂਰੀ ਹੈ।",
      "MSME ਰਾਹਤ: Manakonline ਪੋਰਟਲ 'ਤੇ ਛੋਟੇ ਉਦਯੋਗਾਂ ਲਈ 50% ਫੀਸ ਛੋਟ ਸਰਗਰਮ ਹੈ।",
      "ਹਾਲਮਾਰਕਿੰਗ ਅੱਪਡੇਟ: 14K ਤੋਂ 24K ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ ਲਈ 6-ਅੰਕਾਂ ਦਾ HUID ਲਾਜ਼ਮੀ ਹੈ।",
      "ਖਪਤਕਾਰ ਚੇਤਾਵਨੀ: ਖਰੀਦਦਾਰੀ ਤੋਂ ਪਹਿਲਾਂ BIS Care ਐਪ 'ਤੇ CML ਲਾਇਸੈਂਸ ਨੰਬਰ ਅਤੇ HUID ਦੀ ਜਾਂਚ ਕਰੋ।",
    ],

    heroTitle: "ਬਿਊਰੋ ਆਫ਼ ਇੰਡੀਅਨ ਸਟੈਂਡਰਡਜ਼ ਅਧਿਕਾਰਤ AI ਸਹਾਇਕ",
    heroSubtitle: "ਭਾਰਤੀ ਸਟੈਂਡਰਡ, ISI ਸਰਟੀਫਿਕੇਸ਼ਨ, 6-ਅੰਕਾਂ ਦਾ HUID ਅਤੇ ਲੈਬਾਂ ਦੀ ਖੋਜ ਬਾਰੇ ਅਧਿਕਾਰਤ ਮਾਰਗਦਰਸ਼ਨ।",
    badgeSource: "100% ਸਰੋਤ-ਅਧਾਰਿਤ",
    badgeQco: "ਸਰਗਰਮ QCO ਸ਼ਾਮਲ",
    badgeCare: "BIS Care 2.0 ਤਿਆਰ",
    badgeStack: "FastAPI + ChromaDB",

    newConsultation: "ਨਵਾਂ ਸਲਾਹ-ਮਸ਼ਵਰਾ",
    consultationsTitle: "ਸਲਾਹ-ਮਸ਼ਵਰਾ ਇਤਿਹਾਸ",
    searchHistoryPlaceholder: "ਇਤਿਹਾਸ ਖੋਜੋ...",
    noPastChats: "ਕੋਈ ਪਿਛਲਾ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਨਹੀਂ ਮਿਲਿਆ",
    clearHistory: "ਸਭ ਸਾਫ਼ ਕਰੋ",
    inputPlaceholder: "BIS ਸਾਥੀ ਨੂੰ ਸਟੈਂਡਰਡ, ਸਰਟੀਫਿਕੇਸ਼ਨ, HUID ਜਾਂ ਲੈਬਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
    micListening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਆਪਣਾ ਸਵਾਲ ਬੋਲੋ",
    micError: "ਆਵਾਜ਼ ਪਛਾਣਨ ਵਿੱਚ ਤਰੁੱਟੀ। ਕਿਰਪਾ ਕਰਕੇ ਟਾਈਪ ਕਰੋ।",
    includeChecklist: "ਕਦਮ-ਦਰ-ਕਦਮ ਚੈੱਕਲਿਸਟ ਸ਼ਾਮਲ ਕਰੋ",
    send: "ਭੇਜੋ",
    suggestedQuestions: "ਸੁਝਾਏ ਗਏ ਸਵਾਲ",
    sourceConfidence: "ਸਰੋਤ ਭਰੋਸੇਯੋਗਤਾ",
    confHigh: "ਉੱਚ (ਤਸਦੀਕਸ਼ੁਦਾ)",
    confMed: "ਦਰਮਿਆਨਾ",
    confLow: "ਕਾਨੂੰਨੀ ਨੋਟਿਸ",
    citationsTitle: "ਤਸਦੀਕਸ਼ੁਦਾ ਅਧਿਕਾਰਤ ਸਰੋਤ",
    actionCopy: "ਕਾਪੀ ਕਰੋ",
    actionCopied: "ਕਾਪੀ ਹੋ ਗਿਆ!",
    actionListen: "ਸੁਣੋ (TTS)",
    actionStop: "ਆਵਾਜ਼ ਰੋਕੋ",
    actionDownload: "ਡਾਊਨਲੋਡ",
    actionPrint: "ਪ੍ਰਿੰਟ",
    actionShare: "ਸਾਂਝਾ ਕਰੋ",
    checklistTitle: "ਪ੍ਰਕਿਰਿਆ ਸੰਬੰਧੀ ਪਾਲਣਾ ਚੈੱਕਲਿਸਟ",
    statutoryNotice: "ਅਧਿਕਾਰਤ BIS ਮਾਰਗਦਰਸ਼ਨ",
    connectionError: "BIS ਸਾਥੀ ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਪੋਰਟ 8000 ਦੀ ਜਾਂਚ ਕਰੋ।",

    findStandardTitle: "ਮੇਰਾ ਸਟੈਂਡਰਡ ਲੱਭੋ — ਭਾਰਤੀ ਸਟੈਂਡਰਡ ਕੈਟਾਲਾਗ",
    findStandardSubtitle: "ਲਾਗੂ ਸਟੈਂਡਰਡ (IS) ਅਤੇ QCO ਆਦੇਸ਼ ਲੱਭਣ ਲਈ ਉਤਪਾਦ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ।",
    findStandardSearchPlaceholder: "ਜਿਵੇਂ: ਪੀਣ ਵਾਲਾ ਪਾਣੀ, ਪ੍ਰੈਸ਼ਰ ਕੁੱਕਰ, ਪੱਖਾ, ਖਿਡੌਣੇ, ਸੋਨਾ, ਸਟੀਲ...",
    findStandardSearchBtn: "ਸਟੈਂਡਰਡ ਲੱਭੋ",
    findStandardSearching: "741+ ਸਟੈਂਡਰਡਾਂ ਵਿੱਚ ਖੋਜ ਜਾਰੀ ਹੈ...",
    colStandard: "ਸਟੈਂਡਰਡ ਅਤੇ ਸਿਰਲੇਖ",
    colStatus: "ਲਾਜ਼ਮੀ ਸਥਿਤੀ",
    colMatchScore: "ਮੈਚ ਸਕੋਰ",
    colAction: "ਕਾਰਵਾਈ",
    qcoMandatory: "ਲਾਜ਼ਮੀ QCO",
    voluntaryStandard: "ਵਿਕਲਪਿਕ ਸਟੈਂਡਰਡ",
    btnAskBisAbout: "BIS ਤੋਂ ਮਾਰਗਦਰਸ਼ਨ ਲਵੋ",
    noStandardsFound: "ਕੋਈ ਸਟੈਂਡਰਡ ਨਹੀਂ ਮਿਲਿਆ। 'ਪਾਣੀ', 'ਕੇਬਲ', 'ਸੀਮੈਂਟ' ਵਰਗੇ ਸ਼ਬਦ ਅਜ਼ਮਾਓ।",
    standardsCount: "ਕੈਟਾਲਾਗ ਵਿੱਚ {count} ਸੰਬੰਧਿਤ ਸਟੈਂਡਰਡ ਮਿਲੇ",

    labTitle: "BIS LIMS ਪ੍ਰਯੋਗਸ਼ਾਲਾ ਖੋਜ ਨੈੱਟਵਰਕ",
    labSubtitle: "ਸਿਟੀਜ਼ਨ ਚਾਰਟਰ ਸਮਾਂ-ਸੀਮਾਵਾਂ ਨਾਲ ਭਾਰਤ ਭਰ ਵਿੱਚ ਅਧਿਕਾਰਤ BIS ਅਤੇ NABL ਲੈਬਾਂ ਲੱਭੋ।",
    labSearchProductPlaceholder: "ਉਤਪਾਦ ਜਾਂ ਵਿਸ਼ੇ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ...",
    labSearchLocationPlaceholder: "ਸ਼ਹਿਰ ਜਾਂ ਰਾਜ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ...",
    labSearchBtn: "ਲੈਬ ਲੱਭੋ",
    labSearching: "ਲੈਬਾਂ ਲੱਭੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...",
    labDisciplineAll: "ਸਾਰੇ ਵਿਸ਼ੇ",
    labDisciplineChemical: "ਕੈਮੀਕਲ ਅਤੇ ਪੌਲੀਮਰ",
    labDisciplineElectrical: "ਇਲੈਕਟ੍ਰੀਕਲ ਅਤੇ ਇਲੈਕਟ੍ਰਾਨਿਕਸ",
    labDisciplineMechanical: "ਮਕੈਨੀਕਲ ਅਤੇ ਧਾਤਾਂ",
    labDisciplineCivil: "ਸਿਵਲ ਅਤੇ ਉਸਾਰੀ",
    labDisciplineFood: "ਭੋਜਨ ਅਤੇ ਮਾਈਕ੍ਰੋਬਾਇਓਲੋਜੀ",
    labTat: "ਕੰਮ ਮੁਕੰਮਲ ਹੋਣ ਦਾ ਸਮਾਂ (TAT)",
    labAddress: "ਪਤਾ",
    labContact: "ਸੰਪਰਕ ਅਤੇ ਈਮੇਲ",
    labScope: "ਮੁੱਖ ਟੈਸਟਿੰਗ ਦਾਇਰਾ",
    labOfficialLims: "ਅਧਿਕਾਰਤ LIMS ਪੋਰਟਲ",
    labResultsCount: "{count} ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਲੈਬਾਂ ਦਿਖਾਈਆਂ ਜਾ ਰਹੀਆਂ ਹਨ",

    verifyTitle: "ਅਧਿਕਾਰਤ ਮਾਰਕ ਤਸਦੀਕ ਗਾਈਡ",
    verifySubtitle: "BIS Care ਐਪ 'ਤੇ ਅਸਲੀ ISI ਮਾਰਕ, 6-ਅੰਕਾਂ ਦਾ HUID ਅਤੇ CRS ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਮਾਰਕ ਕਿਵੇਂ ਤਸਦੀਕ ਕਰਨਾ ਹੈ ਸਿੱਖੋ।",
    verifyTabIsi: "ISI ਮਾਰਕ (ਸਕੀਮ 1)",
    verifyTabHuid: "ਸੋਨੇ ਦੀ ਹਾਲਮਾਰਕਿੰਗ (HUID)",
    verifyTabCrs: "CRS ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    verifyTabGrievance: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    verifyIsiHeading: "ISI ਮਾਰਕ ਅਤੇ CML ਲਾਇਸੈਂਸ ਕਿਵੇਂ ਤਸਦੀਕ ਕਰੀਏ",
    verifyIsiDesc: "ਹਰੇਕ ਅਸਲੀ ਉਤਪਾਦ 'ਤੇ ਉੱਪਰ IS ਸਟੈਂਡਰਡ ਨੰਬਰ ਅਤੇ ਹੇਠਾਂ CML ਲਾਇਸੈਂਸ ਨੰਬਰ ਹੁੰਦਾ ਹੈ। BIS Care ਐਪ ਵਿੱਚ ਇਸਦੀ ਜਾਂਚ ਕਰੋ।",
    verifyHuidHeading: "6-ਅੰਕਾਂ ਦਾ HUID ਸੋਨੇ ਦੀ ਹਾਲਮਾਰਕਿੰਗ",
    verifyHuidDesc: "ਗਹਿਣਿਆਂ 'ਤੇ BIS ਲੋਗੋ, ਕੈਰੇਟ ਸ਼ੁੱਧਤਾ ਅਤੇ 6-ਅੰਕਾਂ ਦਾ HUID ਕੋਡ ਹੁੰਦਾ ਹੈ। ਐਪ ਵਿੱਚ ਸ਼ੁੱਧਤਾ ਦੀ ਤੁਰੰਤ ਪੁਸ਼ਟੀ ਕਰੋ।",
    verifyCrsHeading: "ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਲਈ CRS ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    verifyCrsDesc: "ਮੋਬਾਈਲ, ਲੈਪਟਾਪ ਉਤਪਾਦਾਂ 'ਤੇ 'Registration No. R-XXXXXXXX' ਨਾਲ CRS ਲੋਗੋ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
    verifyGrievanceHeading: "ਨਕਲੀ ਮਾਰਕਾਂ ਵਿਰੁੱਧ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨਾ",
    verifyGrievanceDesc: "ਨਕਲੀ ISI ਮਾਰਕ ਜਾਂ ਗਲਤ ਹਾਲਮਾਰਕਿੰਗ ਦਿਖਣ 'ਤੇ BIS Care ਐਪ ਜਾਂ cmed@bis.gov.in ਰਾਹੀਂ ਸ਼ਿਕਾਇਤ ਕਰੋ।",
    verifyDownloadCareApp: "ਅਧਿਕਾਰਤ BIS Care ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ",

    footerDisclaimer: "ਕਾਨੂੰਨੀ ਬੇਦਾਅਵਾ: BIS ਸਾਥੀ ਬਿਊਰੋ ਆਫ਼ ਇੰਡੀਅਨ ਸਟੈਂਡਰਡਜ਼ ਐਕਟ 2016 'ਤੇ ਅਧਾਰਤ AI ਸਹਾਇਕ ਹੈ। ਅਧਿਕਾਰਤ ਅਰਜ਼ੀਆਂ ਲਈ manakonline.in 'ਤੇ ਜਾਓ।",
    footerCopyright: "© 2026 ਬਿਊਰੋ ਆਫ਼ ਇੰਡੀਅਨ ਸਟੈਂਡਰਡਜ਼ (BIS), ਭਾਰਤ ਸਰਕਾਰ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
    footerLinks: [
      { label: "BIS ਅਧਿਕਾਰਤ ਪੋਰਟਲ", url: "https://www.bis.gov.in" },
      { label: "Manakonline ਪੋਰਟਲ", url: "https://www.manakonline.in" },
      { label: "LIMS ਪੋਰਟਲ", url: "https://lims.bis.gov.in" },
      { label: "ਸਿਟੀਜ਼ਨ ਚਾਰਟਰ", url: "https://www.bis.gov.in/index.php/citizens-charter/" },
    ],
  },
};
