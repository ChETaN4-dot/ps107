"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Send, Mic, Square,
  Play, Pause, StopCircle,
  ExternalLink, Search,
  MapPin, Phone,
  Loader2, Info,
  Volume2,
  Plus, MessageSquare, Trash2, History,
  Check, CheckSquare, Clock, Copy, Filter
} from "lucide-react";
import {
  UI_TRANSLATIONS,
  LANGUAGES,
  LanguageType,
  PersonaType,
  BROWSER_LANG_MAP
} from "./i18n";

// =====================================================================
// DATA CONTRACTS & TYPES
// =====================================================================
interface Citation {
  chunk_id?: string;
  document_id?: string;
  source_title: string;
  source_url: string;
  section: string;
  excerpt?: string;
  category?: string;
  authority: string;
  relevance_score: number;
}
interface ChecklistItem {
  id: string; title: string; description: string; mandatory: boolean; reference_clause?: string;
}
interface Checklist { title: string; category: string; steps: ChecklistItem[]; }
interface StandardRecommendation {
  standard_number: string; title: string; year?: string; status: string;
  category: string; match_reason: string; confidence: number; source_url: string; qco_mandatory: boolean;
  lifecycle_status?: string; superseded_by?: string; revision_of?: string;
  amendment_count?: number; latest_amendment?: string; qco_status?: string;
  qco_reference?: string; applicability_role?: string; verification_timestamp?: string;
  verification_source?: string; is_current_verified?: boolean; live_verification_available?: boolean;
}
interface LabRecommendation {
  lab_name: string; location: string; lab_type: string; discipline?: string;
  scope_highlights: string; address: string; contact: string; tat_days?: string; official_url: string;
}
interface Message {
  id: string; role: "user" | "assistant"; content: string;
  confidence?: number; confidence_level?: "HIGH" | "MEDIUM" | "LOW";
  intent?: string; category?: string; citations?: Citation[];
  checklist?: Checklist; suggested_followups?: string[];
  multilingual_notice?: string; timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  persona: PersonaType;
  language: LanguageType;
  messages: Message[];
  updatedAt: string;
}

type ModeType = "ask_bis" | "find_my_standard" | "laboratories" | "verify_marks";
type MicStateType = "IDLE" | "LISTENING" | "PROCESSING" | "TRANSCRIBING" | "ERROR";

const PERSONA_META: Record<PersonaType, { iconName: string; defaultQuery: string }> = {
  msme: { iconName: "factory", defaultQuery: "How can an MSME find the applicable Indian Standard for manufactured products?" },
  consumer: { iconName: "shopping_bag", defaultQuery: "How do I verify if an ISI mark and CML licence number on a product is genuine?" },
  manufacturer: { iconName: "precision_manufacturing", defaultQuery: "How do I identify which Indian Standard applies to my manufactured product category?" },
  jeweller: { iconName: "diamond", defaultQuery: "What are the statutory requirements for 6-digit alphanumeric HUID hallmarking on gold jewellery?" },
  student: { iconName: "school", defaultQuery: "What is the Bureau of Indian Standards and what is its statutory role under the BIS Act, 2016?" },
  researcher: { iconName: "biotech", defaultQuery: "How can I search the catalog of Indian Standards by technical committee or division?" },
  general: { iconName: "groups", defaultQuery: "How do I find the applicable Indian Standard for a specific product?" },
};

const OFFICIAL_BIS_LABS: LabRecommendation[] = [
  {
    lab_name: "BIS Central Laboratory (BCL), Sahibabad",
    location: "Sahibabad, Ghaziabad, Uttar Pradesh (Delhi NCR)",
    lab_type: "Central Laboratory (BIS Owned)",
    discipline: "All Disciplines",
    scope_highlights: "Comprehensive testing across Chemical, Electrical, Mechanical, and Microbiological disciplines. Packaged drinking water (IS 14543/13428), electrical appliances, cables, food products, toys (IS 9873), pressure cookers, and steel.",
    address: "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad - 201010, Uttar Pradesh",
    contact: "cl@bis.gov.in | +91-120-4177100 / 0120-2770030",
    tat_days: "7 - 21 Days (Citizen's Charter)",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Western Regional Laboratory (WRL), Mumbai",
    location: "Mumbai, Maharashtra",
    lab_type: "Regional Laboratory (BIS Owned)",
    discipline: "Chemical & Polymers",
    scope_highlights: "Petroleum products, plastics, polymers, textiles, cement, domestic electrical appliances, switchgear, and chemical safety parameters.",
    address: "Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (East), Mumbai - 400093, Maharashtra",
    contact: "wrl@bis.gov.in | +91-22-28329295",
    tat_days: "10 - 20 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Southern Regional Laboratory (SRL), Chennai",
    location: "Chennai, Tamil Nadu",
    lab_type: "Regional Laboratory (BIS Owned)",
    discipline: "Electrical & Electronics",
    scope_highlights: "Submersible pumps (IS 14220), induction motors, electric cables, packaged drinking water, cement, and domestic consumer durables.",
    address: "CIT Campus, IV Cross Road, Taramani, Chennai - 600113, Tamil Nadu",
    contact: "srl@bis.gov.in | +91-44-22541442",
    tat_days: "10 - 20 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Eastern Regional Laboratory (ERL), Kolkata",
    location: "Kolkata, West Bengal",
    lab_type: "Regional Laboratory (BIS Owned)",
    discipline: "Mechanical & Metallurgy",
    scope_highlights: "Structural steel, iron rebars (IS 1786), galvanised sheets, cement, packaged drinking water, and heavy industrial chemical testing.",
    address: "1/14, C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata - 700054, West Bengal",
    contact: "erl@bis.gov.in | +91-33-23207080",
    tat_days: "10 - 20 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Northern Regional Laboratory (NRL), Mohali",
    location: "Mohali / Chandigarh, Punjab",
    lab_type: "Regional Laboratory (BIS Owned)",
    discipline: "Mechanical & Safety",
    scope_highlights: "Domestic pressure cookers (IS 2347), LPG cylinders, auto components, electrical switches, helmets (IS 4151), and agricultural pumps.",
    address: "Plot No. 4-A, Sector 27-B, Madhya Marg, Chandigarh / Mohali - 160019, Punjab",
    contact: "nrl@bis.gov.in | +91-172-2650290",
    tat_days: "10 - 20 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Bengaluru Branch Laboratory (BNBO)",
    location: "Bengaluru, Karnataka",
    lab_type: "Branch Laboratory (BIS Owned)",
    discipline: "Electrical & Electronics",
    scope_highlights: "Electronics, Information Technology equipment, mobile phones, power adapters, and electrical equipment compliance testing under Scheme II (CRS).",
    address: "Peenya Industrial Area, 1st Stage, Bengaluru - 560058, Karnataka",
    contact: "bnbo@bis.gov.in | +91-80-28394955",
    tat_days: "7 - 15 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Patna Branch Laboratory (PABO)",
    location: "Patna, Bihar",
    lab_type: "Branch Laboratory (BIS Owned)",
    discipline: "Food & Drinking Water",
    scope_highlights: "Packaged drinking water, packaged natural mineral water, food grain testing, cement, and routine chemical evaluation.",
    address: "Patliputra Industrial Estate, Patna - 800013, Bihar",
    contact: "pabo@bis.gov.in | +91-612-2262305",
    tat_days: "7 - 15 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "BIS Guwahati Branch Laboratory (GBO)",
    location: "Guwahati, Assam",
    lab_type: "Branch Laboratory (BIS Owned)",
    discipline: "Civil & Building Materials",
    scope_highlights: "Packaged drinking water, building materials (cement, aggregates), tea testing, and regional conformity assessment for North-Eastern states.",
    address: "Nedfi House, 4th Floor, G.S. Road, Dispur, Guwahati - 781006, Assam",
    contact: "gbo@bis.gov.in | +91-361-2232935",
    tat_days: "7 - 15 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "National Test House (NTH), Alipore",
    location: "Kolkata, West Bengal",
    lab_type: "LRS Recognized National Lab",
    discipline: "Mechanical & Metallurgy",
    scope_highlights: "Heavy engineering, high voltage transformers, metallurgical mechanical testing, calibration, structural steel, and paint coatings.",
    address: "11/1 Judges Court Road, Alipore, Kolkata - 700027, West Bengal",
    contact: "nth-alipore@gov.in | +91-33-24791557",
    tat_days: "15 - 30 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "National Test House (NTH), Ghaziabad",
    location: "Ghaziabad, Uttar Pradesh (Delhi NCR)",
    lab_type: "LRS Recognized National Lab",
    discipline: "Chemical & Polymers",
    scope_highlights: "Chemical assays, polymers, packaged drinking water, toxic metals, agricultural inputs, pesticides, and microbial sterility.",
    address: "Kamla Nehru Nagar, Ghaziabad - 201002, Uttar Pradesh",
    contact: "nth-gzb@gov.in | +91-120-2789851",
    tat_days: "10 - 20 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "Central Power Research Institute (CPRI)",
    location: "Bengaluru, Karnataka / Bhopal / Noida",
    lab_type: "LRS Recognized Apex Power Body",
    discipline: "Electrical & Electronics",
    scope_highlights: "Power & distribution transformers, switchgear, solar PV inverters (IS 16221), smart energy meters (IS 16444), circuit breakers, and dielectric oil.",
    address: "Prof. Sir C.V. Raman Road, Sadashivanagar, Bengaluru - 560080, Karnataka",
    contact: "cpri@cpri.in | +91-80-22072210",
    tat_days: "15 - 30 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "Electrical Research & Development Association (ERDA)",
    location: "Vadodara, Gujarat / Rabale, Mumbai",
    lab_type: "LRS Recognized Electrical Lab",
    discipline: "Electrical & Electronics",
    scope_highlights: "Energy meters, distribution transformers, electric cables, insulators, lightning arresters, and solar power equipment testing.",
    address: "ERDA Road, GIDC, Makarpura Industrial Estate, Vadodara - 390010, Gujarat",
    contact: "erda@erda.org | +91-265-3043128",
    tat_days: "15 - 25 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "Shriram Institute for Industrial Research (SIIR)",
    location: "Delhi NCR / Gurugram, Haryana",
    lab_type: "LRS Recognized Research Lab",
    discipline: "Chemical & Polymers",
    scope_highlights: "Safety of toys (IS 9873 Parts 1-9), phthalates, heavy metals, food contact materials, medical plastics, and RoHS testing.",
    address: "19, University Road, Delhi - 110007",
    contact: "sirdl@shriraminstitute.org | +91-11-27667267",
    tat_days: "7 - 15 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "Automotive Research Association of India (ARAI)",
    location: "Pune, Maharashtra",
    lab_type: "LRS Recognized Automotive Apex Lab",
    discipline: "Automotive & Batteries",
    scope_highlights: "Traction battery packs for electric vehicles (IS 17855 / AIS 038/156), protective helmets (IS 4151), automotive safety glass, and lighting devices.",
    address: "Survey No. 102, Vetal Hill, Off Paud Road, Kothrud, Pune - 411038, Maharashtra",
    contact: "director@araiindia.com | +91-20-30231111",
    tat_days: "15 - 30 Days",
    official_url: "https://lims.bis.gov.in"
  },
  {
    lab_name: "CEG Test House and Research Centre",
    location: "Jaipur, Rajasthan",
    lab_type: "LRS Recognized Civil Lab",
    discipline: "Civil & Building Materials",
    scope_highlights: "Portland pozzolana cement (IS 1489), ordinary portland cement (IS 269), TMT rebars, bitumen, concrete, and soil mechanics testing.",
    address: "B-11 (G), Malviya Industrial Area, Jaipur - 302017, Rajasthan",
    contact: "info@cegtesthouse.com | +91-141-2751801",
    tat_days: "7 - 14 Days",
    official_url: "https://lims.bis.gov.in"
  }
];

// =====================================================================
// STRUCTURED MARKDOWN & TYPOGRAPHY RENDERING ENGINE
// =====================================================================

// Protected acronyms & statutory identifiers that must remain in exact casing
const PROTECTED_STATUTORY_TOKENS = new Set([
  "IS", "HUID", "CML", "QCO", "BIS", "LIMS", "CRS", "FMCS", "MSME",
  "DPIIT", "NTH", "CPRI", "ERDA", "ARAI", "SIT", "AHC", "ISO", "IEC", "TMT", "PVC", "AIS", "NABL"
]);

function normalizePresentationCasing(text: string): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  const letters = text.replace(/[^a-zA-Z]/g, "");
  const uppercaseLetters = text.replace(/[^A-Z]/g, "");

  // Detect shouting ALL-CAPS (more than 2 words and >70% caps)
  if (words.length >= 2 && letters.length > 8 && uppercaseLetters.length / letters.length > 0.70) {
    return words.map((w, idx) => {
      const cleanW = w.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      if (PROTECTED_STATUTORY_TOKENS.has(cleanW) || /^IS\d+/.test(cleanW) || /^\d+/.test(cleanW)) {
        return w;
      }
      if (idx === 0) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      }
      return w.toLowerCase();
    }).join(" ");
  }
  return text;
}

function parseInlineSpans(text: string) {
  if (!text) return null;

  // Clean unicode quotes and artifacts
  let clean = text.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

  // If the whole text was wrapped in **...**, strip outer wrap to avoid whole paragraph bolding
  if (clean.startsWith("**") && clean.endsWith("**") && clean.indexOf("**", 2) === clean.length - 2) {
    clean = clean.slice(2, -2);
  }

  // Tokenize Bold (**...**), Italic (*...*), Links ([...](...)), URLs (https://...), IS Standards (IS XXXX)
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|IS\s+\d+(?::\d{4})?(?:\s*(?:Part\s*\d+|\([^\)]+\)))?)/g;
  const parts = clean.split(tokenRegex);

  return parts.map((part, pIdx) => {
    if (!part) return null;

    // 1. Bold Token (**...**)
    if (part.startsWith("**") && part.endsWith("**")) {
      const rawBold = part.slice(2, -2).trim();
      const boldText = normalizePresentationCasing(rawBold);

      // Check for Mandatory requirement label
      if (/^✓?\s*mandatory/i.test(boldText)) {
        return (
          <span key={pIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#138808]/15 text-[#138808] border border-[#138808]/30 mr-1.5 align-baseline">
            <span>✓</span>
            <span>{boldText.replace(/^✓\s*/, "")}</span>
          </span>
        );
      }
      // Check for Supporting guidance label
      if (/supporting/i.test(boldText)) {
        return (
          <span key={pIdx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 mr-1.5 align-baseline">
            {boldText}
          </span>
        );
      }
      // Check for Optional / Related label
      if (/optional|related/i.test(boldText)) {
        return (
          <span key={pIdx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#667085]/15 text-[#667085] dark:text-[#98A2B3] border border-[#667085]/30 mr-1.5 align-baseline">
            {boldText}
          </span>
        );
      }
      // Standard numbers (IS XXXX)
      if (/^IS\s+\d+/i.test(boldText)) {
        return (
          <code key={pIdx} className="font-mono font-semibold text-[#101828] dark:text-white px-1.5 py-0.5 rounded bg-[#FAF9F6] dark:bg-[#1F2430] border border-[#E7E2D9] dark:border-[#242C3D] text-[12px] mx-0.5">
            {boldText}
          </code>
        );
      }

      // Selective semibold emphasis (NOT heavy black 800)
      return (
        <strong key={pIdx} className="font-semibold text-[#101828] dark:text-white">
          {boldText}
        </strong>
      );
    }

    // 2. Italic Token (*...*)
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      const italicContent = part.slice(1, -1).trim();
      return (
        <em key={pIdx} className="italic text-[#475467] dark:text-[#D0D5DD]">
          {italicContent}
        </em>
      );
    }

    // 3. Link Token ([title](url))
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, title, url] = match;
        return (
          <a
            key={pIdx}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-[#2563EB] hover:text-[#1d4ed8] font-medium hover:underline inline-flex items-center gap-0.5 mx-0.5"
          >
            <span>{title}</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        );
      }
    }

    // 4. Raw URL Token (https://... or http://...)
    if (/^https?:\/\//i.test(part)) {
      return (
        <a
          key={pIdx}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-[#2563EB] hover:text-[#1d4ed8] font-medium hover:underline inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#2563EB]/10 text-[11px] mx-1"
        >
          <span>Official BIS Portal</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      );
    }

    // 5. Standard identifier in plain text
    if (/^IS\s+\d+/i.test(part)) {
      return (
        <code key={pIdx} className="font-mono font-semibold text-[#101828] dark:text-white px-1.5 py-0.5 rounded bg-[#FAF9F6] dark:bg-[#1F2430] border border-[#E7E2D9] dark:border-[#242C3D] text-[12px] mx-0.5">
          {part}
        </code>
      );
    }

    // Plain text segment with casing normalization
    return normalizePresentationCasing(part);
  });
}

interface AstBlock {
  type: "heading" | "blockquote" | "table" | "bullet_list" | "numbered_list" | "paragraph";
  level?: number;
  text?: string;
  items?: string[];
  rows?: string[][];
  headers?: string[];
}

function parseMarkdownToBlocks(content: string): AstBlock[] {
  if (!content) return [];
  const lines = content.split(/\r?\n/);
  const blocks: AstBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Heading (#, ##, ###, ####)
    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        blocks.push({ type: "heading", level, text });
        i++;
        continue;
      }
    }

    // 2. Blockquote / Key Takeaway (> ...)
    if (trimmed.startsWith(">")) {
      let quoteText = trimmed.replace(/^>\s*/, "");
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteText += " " + lines[i].trim().replace(/^>\s*/, "");
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteText });
      continue;
    }

    // 3. Table (| ... |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (l: string) => l.split("|").slice(1, -1).map(c => c.trim());
        const headers = parseRow(tableLines[0]);
        const isSeparator = (l: string) => /^\|(\s*:?-+:?\s*\|)+$/.test(l);
        const rows = tableLines.slice(1).filter(l => !isSeparator(l)).map(parseRow);
        blocks.push({ type: "table", headers, rows });
        continue;
      }
    }

    // 4. Numbered List (1. , 2. )
    if (/^\s*\d+\.\s+/.test(rawLine)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "numbered_list", items });
      continue;
    }

    // 5. Bullet List (- , * , • )
    if (/^\s*[-*•]\s+/.test(rawLine)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "bullet_list", items });
      continue;
    }

    // 6. Regular Paragraph (gather consecutive non-empty lines)
    const paraLines: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*[-*•]\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: paraLines.join(" ") });
  }

  return blocks;
}

function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const blocks = parseMarkdownToBlocks(content);

  return (
    <div className="space-y-3.5 text-[14px] leading-relaxed text-[#101828] dark:text-[#FAF9F6] font-normal font-sans">
      {blocks.map((block, idx) => {
        // 1. Headings
        if (block.type === "heading") {
          const rawHeader = block.text || "";
          if (block.level === 4) {
            return (
              <h5 key={idx} className="font-semibold text-[#667085] dark:text-[#98A2B3] text-[12px] uppercase tracking-wider flex items-center space-x-1.5 pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                <span>{normalizePresentationCasing(rawHeader)}</span>
              </h5>
            );
          }
          if (block.level === 3) {
            return (
              <h4 key={idx} className="font-bold text-[#101828] dark:text-[#FAF9F6] text-[15px] flex items-center space-x-2 pt-2 border-b border-[#E7E2D9]/60 dark:border-[#242C3D]/60 pb-1.5">
                <span className="w-1.5 h-3.5 rounded-full bg-[#FF7A00] inline-block"></span>
                <span>{normalizePresentationCasing(rawHeader)}</span>
              </h4>
            );
          }
          if (block.level === 2) {
            return (
              <h3 key={idx} className="font-bold text-[#101828] dark:text-[#FAF9F6] text-[17px] flex items-center space-x-2 pt-2.5 border-b border-[#E7E2D9] dark:border-[#242C3D] pb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                <span>{normalizePresentationCasing(rawHeader)}</span>
              </h3>
            );
          }
          return (
            <h2 key={idx} className="font-bold text-[#101828] dark:text-white text-[19px] pt-2">
              {normalizePresentationCasing(rawHeader)}
            </h2>
          );
        }

        // 2. Blockquote / Key Takeaway Card
        if (block.type === "blockquote") {
          const rawText = block.text || "";
          const isKeyTakeaway = /key takeaway/i.test(rawText);
          const cleanText = rawText.replace(/^\*\*key takeaway:?\*\*:?\s*/i, "").replace(/^key takeaway:?\s*/i, "");

          return (
            <div key={idx} className={`p-3.5 rounded-xl text-[13px] flex items-start space-x-2.5 my-2.5 border ${
              isKeyTakeaway
                ? "bg-[#FF7A00]/5 dark:bg-[#FF7A00]/10 border-[#FF7A00]/40 text-[#101828] dark:text-[#FAF9F6]"
                : "bg-[#FAF9F6] dark:bg-[#1E2330] border-l-4 border-[#FF7A00] border-y-[#E7E2D9] border-r-[#E7E2D9] dark:border-y-[#242C3D] dark:border-r-[#242C3D] text-[#101828] dark:text-[#FAF9F6]"
            }`}>
              <div className="flex-shrink-0 mt-0.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold">★</span>
              </div>
              <div className="flex-1 font-normal leading-relaxed">
                <span className="block font-bold text-[11px] text-[#FF7A00] uppercase tracking-wider mb-1">Key Takeaway</span>
                {parseInlineSpans(cleanText)}
              </div>
            </div>
          );
        }

        // 3. Table
        if (block.type === "table" && block.headers && block.rows) {
          return (
            <div key={idx} className="overflow-x-auto my-3 rounded-xl border border-[#E7E2D9] dark:border-[#242C3D] shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#FAF9F6] dark:bg-[#1E2330] text-[#101828] dark:text-[#FAF9F6] font-semibold border-b border-[#E7E2D9] dark:border-[#242C3D]">
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-3.5 py-2.5 font-semibold uppercase tracking-wider text-[11px] text-[#475467] dark:text-[#98A2B3]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2D9] dark:divide-[#242C3D]">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white dark:bg-[#161B26]" : "bg-[#FAF9F6]/60 dark:bg-[#1E2330]/50"}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2.5 text-[#101828] dark:text-[#FAF9F6] font-normal leading-normal">
                          {parseInlineSpans(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 4. Numbered List
        if (block.type === "numbered_list" && block.items) {
          return (
            <div key={idx} className="space-y-2 my-2">
              {block.items.map((item, sIdx) => (
                <div key={sIdx} className="flex items-start space-x-2.5 text-[14px] text-[#101828] dark:text-[#FAF9F6] font-normal">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-bold text-[11px] flex-shrink-0 mt-0.5 border border-[#2563EB]/25">
                    {sIdx + 1}
                  </span>
                  <div className="flex-1 leading-relaxed">
                    {parseInlineSpans(item)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // 5. Bullet List
        if (block.type === "bullet_list" && block.items) {
          return (
            <ul key={idx} className="space-y-1.5 pl-1 my-1.5">
              {block.items.map((item, bIdx) => (
                <li key={bIdx} className="flex items-start space-x-2.5 text-[14px] text-[#101828] dark:text-[#FAF9F6] font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 flex-shrink-0"></span>
                  <span className="flex-1 leading-relaxed font-normal">
                    {parseInlineSpans(item)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        // 6. Paragraph
        return (
          <p key={idx} className="text-[14px] text-[#101828] dark:text-[#FAF9F6] font-normal leading-relaxed">
            {parseInlineSpans(block.text || "")}
          </p>
        );
      })}
    </div>
  );
}

// =====================================================================
// MAIN HOME COMPONENT
// =====================================================================
export default function Home() {
  const [darkMode, setDarkMode]                 = useState(false);
  const [sidebarOpen, setSidebarOpen]           = useState(true);
  const [fontSizeScale, setFontSizeScale]       = useState<number>(100);
  const [mode, setMode]                         = useState<ModeType>("ask_bis");
  const [persona, setPersona]                   = useState<PersonaType>("msme");
  const [language, setLanguage]                 = useState<LanguageType>("en");

  // Interactive Click Dropdown States
  const [personaDropdownOpen, setPersonaDropdownOpen]   = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const personaDropdownRef                              = useRef<HTMLDivElement>(null);
  const languageDropdownRef                             = useRef<HTMLDivElement>(null);

  // Chat sessions & history persistence
  const [sessions, setSessions]                 = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [sessionSearchQuery, setSessionSearchQuery] = useState("");
  const [messages, setMessages]                 = useState<Message[]>([]);
  const [input, setInput]                       = useState("");
  const [includeChecklist, setIncludeChecklist] = useState(false);
  const [isLoading, setIsLoading]               = useState(false);
  const [checkedSteps, setCheckedSteps]         = useState<Record<string, boolean>>({});
  const [copiedMessageId, setCopiedMessageId]   = useState<string|null>(null);

  // Standard Recommender
  const [productDesc, setProductDesc]           = useState("");
  const [isRecommending, setIsRecommending]     = useState(false);
  const [recommendations, setRecommendations]   = useState<StandardRecommendation[]>([]);

  // Laboratories Search
  const [labSearchProduct, setLabSearchProduct] = useState("");
  const [labSearchLocation, setLabSearchLocation] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [isSearchingLabs, setIsSearchingLabs]   = useState(false);
  const [labResults, setLabResults]             = useState<LabRecommendation[]>(OFFICIAL_BIS_LABS);

  // Audio Voice TTS
  const [voiceAutoSpeak, setVoiceAutoSpeak]     = useState(false);
  const [micState, setMicState]                 = useState<MicStateType>("IDLE");
  const [playingMessageId, setPlayingMessageId] = useState<string|null>(null);
  const [isAudioPaused, setIsAudioPaused]       = useState(false);
  const [spokenExcerpt, setSpokenExcerpt]       = useState<string>("");
  const [isTranslatingHistory, setIsTranslatingHistory] = useState<boolean>(false);

  const messagesEndRef        = useRef<HTMLDivElement>(null);
  const searchInputRef        = useRef<HTMLInputElement>(null);
  const audioPlayerRef        = useRef<HTMLAudioElement|null>(null);
  const speechRecognitionRef  = useRef<any>(null);
  const speechQueueRef        = useRef<string[]>([]);
  const currentChunkIndexRef  = useRef<number>(0);
  const isSpeechCancelledRef  = useRef<boolean>(false);

  // Dynamic Translation Dictionary according to selected language
  const t = useMemo(() => UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en, [language]);

  // Current Localized Persona Info
  const currentPersona = useMemo(() => {
    const pDict = t.personas[persona] || t.personas.msme;
    const meta = PERSONA_META[persona] || PERSONA_META.msme;
    return {
      id: persona,
      label: pDict.label,
      tagline: pDict.tagline,
      description: pDict.description,
      iconName: meta.iconName,
      quickActions: pDict.quickActions.map(qa => ({
        label: qa.label,
        iconName: meta.iconName,
        query: qa.query
      }))
    };
  }, [persona, t]);

  // Click Outside Listener for Popover Menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaDropdownRef.current && !personaDropdownRef.current.contains(event.target as Node)) {
        setPersonaDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── 1. Load Sessions & Theme from LocalStorage ───────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Theme
    const savedTheme = localStorage.getItem("bis_saathi_theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Voice setting
    const savedVoice = localStorage.getItem("bis_saathi_voice_auto_speak");
    if (savedVoice) setVoiceAutoSpeak(savedVoice === "true");

    // Chat sessions
    const savedSessions = localStorage.getItem("bis_saathi_chats_v2");
    if (savedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        if (parsed.length > 0) {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
          setPersona(parsed[0].persona || "msme");
          setLanguage(parsed[0].language || "en");
          return;
        }
      } catch {}
    }

    // Initialize clean first session
    startNewChat();
  }, []);

  // ── 2. Save Sessions to LocalStorage on Change ──────────────────────
  const saveSessionState = (updatedMessages: Message[], activePersona: PersonaType, activeLang: LanguageType) => {
    if (!currentSessionId) return;

    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === currentSessionId);
      const firstUserMsg = updatedMessages.find(m => m.role === "user");
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 32) + "..." : t.newConsultation;

      const updatedSession: ChatSession = {
        id: currentSessionId,
        title,
        persona: activePersona,
        language: activeLang,
        messages: updatedMessages,
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      let newSessions: ChatSession[];
      if (existingIdx >= 0) {
        newSessions = [...prev];
        newSessions[existingIdx] = updatedSession;
      } else {
        newSessions = [updatedSession, ...prev];
      }

      localStorage.setItem("bis_saathi_chats_v2", JSON.stringify(newSessions));
      return newSessions;
    });
  };

  // ── 3. Start New Chat ──────────────────────────────────────────────
  const startNewChat = () => {
    handleStopAudio();
    const newId = "session-" + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: t.newConsultation,
      persona,
      language,
      messages: [],
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setCurrentSessionId(newId);
    setMessages([]);
    setSessions(prev => {
      const updated = [newSession, ...prev.filter(s => s.id !== newId)];
      localStorage.setItem("bis_saathi_chats_v2", JSON.stringify(updated));
      return updated;
    });
    setMode("ask_bis");
  };

  const switchSession = (session: ChatSession) => {
    handleStopAudio();
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setPersona(session.persona);
    setLanguage(session.language);
    setMode("ask_bis");
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleStopAudio();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      localStorage.setItem("bis_saathi_chats_v2", JSON.stringify(filtered));
      if (sessionId === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
          setMessages(filtered[0].messages);
          setPersona(filtered[0].persona);
          setLanguage(filtered[0].language);
        } else {
          startNewChat();
        }
      }
      return filtered;
    });
  };

  const clearAllSessions = () => {
    if (confirm("Are you sure you want to clear all consultation history?")) {
      handleStopAudio();
      localStorage.removeItem("bis_saathi_chats_v2");
      startNewChat();
    }
  };

  // ── 4. Theme & Font Size Handlers ──────────────────────────────────
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
      localStorage.setItem("bis_saathi_theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleFontSizeChange = (delta: number) => {
    setFontSizeScale(prev => {
      const next = Math.min(120, Math.max(85, prev + delta));
      document.documentElement.style.fontSize = `${next}%`;
      return next;
    });
  };

  // ── 5. Auto Scroll ─────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── 6. Audio TTS (Sarvam / Web Speech API) ─────────────────────────
  // ── 6. Audio TTS (Sarvam / Web Speech API) ─────────────────────────
  const splitTextIntoSpeechChunks = (text: string): string[] => {
    const clean = text
      .replace(/###/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/[`_~>#]/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/[^\s]+/g, "official BIS portal")
      .replace(/\s+/g, " ")
      .trim();

    if (!clean) return [];

    // Split on natural sentence boundaries (Hindi danda ।, period ., question mark ?, exclamation !, semicolon ;, newline)
    const rawSentences = clean.split(/(?<=[.!?|।;\n])\s+/);
    const chunks: string[] = [];
    let current = "";

    for (const s of rawSentences) {
      const sentence = s.trim();
      if (!sentence) continue;
      if (current.length + sentence.length + 1 > 160) {
        if (current) chunks.push(current.trim());
        if (sentence.length > 160) {
          const subParts = sentence.split(/(?<=[,，、])\s+/);
          let subCurrent = "";
          for (const sp of subParts) {
            if (subCurrent.length + sp.length + 1 > 160) {
              if (subCurrent) chunks.push(subCurrent.trim());
              subCurrent = sp;
            } else {
              subCurrent = subCurrent ? `${subCurrent} ${sp}` : sp;
            }
          }
          if (subCurrent) current = subCurrent;
          else current = "";
        } else {
          current = sentence;
        }
      } else {
        current = current ? `${current} ${sentence}` : sentence;
      }
    }
    if (current.trim()) {
      chunks.push(current.trim());
    }

    return chunks.length > 0 ? chunks : [clean];
  };

  const getBestBrowserVoice = (targetLang: LanguageType): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const bcpTag = BROWSER_LANG_MAP[targetLang] || "hi-IN";
    const primaryCode = bcpTag.split("-")[0].toLowerCase();

    // 1. Exact match (e.g. "hi-IN" or "ta-IN")
    let voice = voices.find(v => v.lang.toLowerCase() === bcpTag.toLowerCase());
    if (voice) return voice;

    // 2. Prefix / locale match (e.g. starts with "hi", "ta", "mr")
    voice = voices.find(v => v.lang.toLowerCase().startsWith(primaryCode));
    if (voice) return voice;

    // 3. Fallback: Name includes language keywords
    const langKeywords: Record<LanguageType, string[]> = {
      en: ["english", "indian english", "india"],
      hi: ["hindi", "india", "bharat"],
      hinglish: ["hindi", "india", "english"],
      mr: ["marathi", "india"],
      bn: ["bengali", "bangla", "india"],
      gu: ["gujarati", "india"],
      ta: ["tamil", "india"],
      te: ["telugu", "india"],
      kn: ["kannada", "india"],
      ml: ["malayalam", "india"],
      pa: ["punjabi", "india"]
    };

    const keywords = langKeywords[targetLang] || ["india"];
    voice = voices.find(v => {
      const name = v.name.toLowerCase();
      return keywords.some(k => name.includes(k));
    });
    if (voice) return voice;

    return voices.find(v => v.default) || voices[0] || null;
  };

  const fallbackBrowserTTS = (text: string, targetLang?: LanguageType) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlayingMessageId(null);
      setIsAudioPaused(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      isSpeechCancelledRef.current = false;
      const langToUse = targetLang || language;
      const chunks = splitTextIntoSpeechChunks(text);
      if (chunks.length === 0) {
        setPlayingMessageId(null);
        setIsAudioPaused(false);
        return;
      }

      speechQueueRef.current = chunks;
      currentChunkIndexRef.current = 0;

      const speakNextChunk = () => {
        if (isSpeechCancelledRef.current) return;
        const idx = currentChunkIndexRef.current;
        const queue = speechQueueRef.current;

        if (idx >= queue.length) {
          setPlayingMessageId(null);
          setIsAudioPaused(false);
          setSpokenExcerpt("");
          return;
        }

        const chunkText = queue[idx];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = BROWSER_LANG_MAP[langToUse] || "hi-IN";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const bestVoice = getBestBrowserVoice(langToUse);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        utterance.onstart = () => {
          setIsAudioPaused(false);
          setSpokenExcerpt(chunkText.slice(0, 100) + (chunkText.length > 100 ? "..." : ""));
        };

        utterance.onend = () => {
          if (!isSpeechCancelledRef.current) {
            currentChunkIndexRef.current += 1;
            speakNextChunk();
          }
        };

        utterance.onerror = (e) => {
          console.warn("TTS chunk playback:", e);
          if (!isSpeechCancelledRef.current && currentChunkIndexRef.current + 1 < queue.length) {
            currentChunkIndexRef.current += 1;
            speakNextChunk();
          } else {
            setPlayingMessageId(null);
            setIsAudioPaused(false);
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNextChunk();
    } catch (err) {
      console.error("Browser TTS error:", err);
      setPlayingMessageId(null);
      setIsAudioPaused(false);
    }
  };

  const handleSpeakMessage = async (msg: Message, targetLang?: LanguageType) => {
    handleStopAudio();
    const langToUse = targetLang || language;
    setPlayingMessageId(msg.id);
    setIsAudioPaused(false);
    setSpokenExcerpt(msg.content.slice(0, 120) + "...");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/speech/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: msg.content,
          language: langToUse,
          persona,
          speaker: "ritu"
        }),
      });

      if (!res.ok) throw new Error("Backend speech synthesis failed");
      const data = await res.json();
      if (data.audio_base64 && !data.fallback_to_browser) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
        audioPlayerRef.current = audio;
        audio.onplay = () => setIsAudioPaused(false);
        audio.onpause = () => setIsAudioPaused(true);
        audio.onended = () => {
          setPlayingMessageId(null);
          setIsAudioPaused(false);
          setSpokenExcerpt("");
        };
        audio.onerror = () => fallbackBrowserTTS(data.spoken_text || msg.content, langToUse);
        await audio.play();
      } else {
        fallbackBrowserTTS(data.spoken_text || msg.content, langToUse);
      }
    } catch {
      fallbackBrowserTTS(msg.content, langToUse);
    }
  };

  const handlePauseAudio = () => {
    if (audioPlayerRef.current && !audioPlayerRef.current.paused) {
      audioPlayerRef.current.pause();
      setIsAudioPaused(true);
    } else if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  };

  const handleResumeAudio = () => {
    if (audioPlayerRef.current && audioPlayerRef.current.paused) {
      audioPlayerRef.current.play();
      setIsAudioPaused(false);
    } else if (typeof window !== "undefined" && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    }
  };

  const handleStopAudio = () => {
    isSpeechCancelledRef.current = true;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    speechQueueRef.current = [];
    currentChunkIndexRef.current = 0;
    setPlayingMessageId(null);
    setIsAudioPaused(false);
    setSpokenExcerpt("");
  };

  // ── 7. Speech-to-Text STT ──────────────────────────────────────────
  const startRecording = async () => {
    if (micState === "LISTENING") {
      try { speechRecognitionRef.current?.stop(); } catch {}
      setMicState("IDLE");
      return;
    }
    if (typeof window === "undefined") return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      speechRecognitionRef.current = recognition;
      recognition.lang = BROWSER_LANG_MAP[language] || "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setMicState("LISTENING");
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setMicState("IDLE");
        handleSend(transcript, true);
      };
      recognition.onerror = () => setMicState("IDLE");
      recognition.onend = () => setMicState("IDLE");

      try {
        recognition.start();
      } catch {
        setMicState("IDLE");
      }
    } else {
      alert("Speech recognition is not supported in this browser. Please type your query.");
    }
  };

  // ── 8. Language Change & Instant Chat Translation ───────────────────
  const handleLanguageChange = async (newLang: LanguageType) => {
    if (newLang === language) {
      setLanguageDropdownOpen(false);
      return;
    }
    handleStopAudio();
    const oldLang = language;
    setLanguage(newLang);
    setLanguageDropdownOpen(false);

    if (messages.length === 0) {
      saveSessionState([], persona, newLang);
      return;
    }

    setIsTranslatingHistory(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/translate-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({ id: m.id, role: m.role, content: m.content })),
          target_language: newLang,
          source_language: oldLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        const translatedList: Array<{ id: string; content: string }> = data.messages || data.translated_messages || [];
        if (translatedList.length > 0) {
          const mapTranslated = new Map<string, string>();
          translatedList.forEach(tm => mapTranslated.set(tm.id, tm.content));

          const updatedMessages = messages.map(m => {
            const translatedContent = mapTranslated.get(m.id);
            if (translatedContent) {
              return { ...m, content: translatedContent };
            }
            return m;
          });

          setMessages(updatedMessages);
          saveSessionState(updatedMessages, persona, newLang);
        } else {
          saveSessionState(messages, persona, newLang);
        }
      } else {
        saveSessionState(messages, persona, newLang);
      }
    } catch (err) {
      console.warn("Language transfer error:", err);
      saveSessionState(messages, persona, newLang);
    } finally {
      setIsTranslatingHistory(false);
    }
  };

  // ── 8. Chat Send Message Handler ───────────────────────────────────
  const handleSend = async (overrideText?: string, autoSpeak?: boolean) => {
    const text = (overrideText || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    if (!overrideText) setInput("");
    setIsLoading(true);

    try {
      const historyPayload = updatedWithUser.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          persona,
          language,
          mode: "ask_bis",
          history: historyPayload,
          include_checklist: includeChecklist
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const assistantMsg: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
        confidence_level: data.confidence_level,
        intent: data.intent,
        category: data.category,
        citations: data.citations || [],
        checklist: data.checklist,
        suggested_followups: data.suggested_followups || [],
        multilingual_notice: data.multilingual_notice,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalMessages = [...updatedWithUser, assistantMsg];
      setMessages(finalMessages);
      saveSessionState(finalMessages, persona, language);

      if (autoSpeak || voiceAutoSpeak) {
        setTimeout(() => handleSpeakMessage(assistantMsg), 200);
      }
    } catch {
      const errorMsg: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: `⚠️ **${t.statutoryNotice}:** ${t.connectionError}`,
        confidence: 0,
        confidence_level: "LOW",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const finalMessages = [...updatedWithUser, errorMsg];
      setMessages(finalMessages);
      saveSessionState(finalMessages, persona, language);
    } finally {
      setIsLoading(false);
    }
  };

  // ── 9. Copy to Clipboard ───────────────────────────────────────────
  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // ── 10. Standard Recommender ─────────────────────────────────────────
  const handleRecommendStandards = async (customQuery?: string) => {
    const q = (customQuery || productDesc || input).trim();
    if (!q || isRecommending) return;
    setIsRecommending(true);
    setRecommendations([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/recommend-standard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_description: q, top_k: 8, persona }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setMode("find_my_standard");
    } catch {
      setRecommendations([]);
    } finally {
      setIsRecommending(false);
    }
  };

  // ── 11. Lab Recommender ─────────────────────────────────────────────
  const handleSearchLabs = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchingLabs(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/recommend-labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_or_material: labSearchProduct.trim(),
          location: labSearchLocation.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const returned = data.recommended_labs || [];
      setLabResults(returned.length > 0 ? returned : OFFICIAL_BIS_LABS);
    } catch {
      setLabResults(OFFICIAL_BIS_LABS);
    } finally {
      setIsSearchingLabs(false);
    }
  };

  // Filtered Lab results by discipline
  const filteredLabResults = useMemo(() => {
    if (selectedDiscipline === "All") return labResults;
    return labResults.filter(l => l.discipline?.toLowerCase().includes(selectedDiscipline.toLowerCase()) || l.scope_highlights.toLowerCase().includes(selectedDiscipline.toLowerCase()));
  }, [labResults, selectedDiscipline]);

  // Filtered Sessions for search
  const filteredSessions = useMemo(() => {
    if (!sessionSearchQuery.trim()) return sessions;
    const q = sessionSearchQuery.toLowerCase();
    return sessions.filter(s => s.title.toLowerCase().includes(q) || s.persona.toLowerCase().includes(q));
  }, [sessions, sessionSearchQuery]);

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0C111D] text-[#101828] dark:text-[#FAF9F6] antialiased h-screen flex flex-col font-sans selection:bg-[#E7E2D9] dark:selection:bg-[#242C3D] overflow-hidden">
      {/* ================= 1. SUBTLE TRICOLOR MICRO-ACCENT RIBBON ================= */}
      <div className="tricolor-ribbon h-1 w-full opacity-90 flex-shrink-0"></div>

      {/* ================= 2. SOVEREIGN TOP UTILITY BAR (Royal Midnight Navy) ================= */}
      <div className="bg-gradient-to-r from-[#060D1A] via-[#0F172A] to-[#060D1A] text-slate-200 text-[11px] border-b border-slate-800/80 shadow-inner flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-2 font-medium tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="radar-ring absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
              <span className="font-extrabold text-white tracking-tight">{t.govIndia}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-300 hidden md:inline">{t.ministry}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-200">
            {/* Font Scaler */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-700/60 shadow-sm">
              <span className="text-[10px] text-slate-400 mr-1">{t.fontScale}</span>
              <button onClick={() => handleFontSizeChange(-5)} className="px-1 hover:text-white font-medium hover:bg-slate-700/50 rounded transition-colors">A-</button>
              <span className="text-slate-600">|</span>
              <button onClick={() => { setFontSizeScale(100); document.documentElement.style.fontSize = "100%"; }} className="px-1 hover:text-white font-semibold hover:bg-slate-700/50 rounded transition-colors">A</button>
              <span className="text-slate-600">|</span>
              <button onClick={() => handleFontSizeChange(5)} className="px-1 hover:text-white font-bold hover:bg-slate-700/50 rounded transition-colors">A+</button>
            </div>

            {/* Screen Reader Voice Toggle */}
            <button
              onClick={() => {
                const n = !voiceAutoSpeak;
                setVoiceAutoSpeak(n);
                localStorage.setItem("bis_saathi_voice_auto_speak", String(n));
              }}
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg border transition-all ${
                voiceAutoSpeak ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold" : "border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{voiceAutoSpeak ? "volume_up" : "record_voice_over"}</span>
              <span>{t.voiceReadout} {voiceAutoSpeak ? t.voiceOn : ""}</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <a className="hover:text-orange-400 transition-colors flex items-center space-x-1 text-slate-200 font-bold" href="https://www.bis.gov.in" target="_blank" rel="noreferrer">
              <span>bis.gov.in</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>

            <span className="text-slate-700">|</span>

            <span className="text-orange-400 font-extrabold flex items-center space-x-1">
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>{t.helpline}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3. INSTITUTIONAL HEADER & NAVIGATION ================= */}
      <header className="glass-header bg-white/95 dark:bg-[#0B101D]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              title={t.toggleSidebar}
            >
              <span className="material-symbols-outlined text-[20px]">{sidebarOpen ? "menu_open" : "menu"}</span>
            </button>

            {/* Emblem & Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 border border-orange-200/70 dark:border-orange-500/20 flex flex-col items-center justify-center p-0.5 shadow-sm overflow-hidden flex-shrink-0">
                <svg className="w-6 h-6 text-[#FF6B00] dark:text-[#FFA800]" fill="currentColor" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="4"></circle>
                  <circle cx="50" cy="50" fill="none" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <circle cx="50" cy="50" fill="currentColor" r="3"></circle>
                  <g stroke="currentColor" strokeWidth="2">
                    <line x1="50" x2="50" y1="5" y2="40"></line>
                    <line x1="50" x2="50" y1="60" y2="95"></line>
                    <line x1="50" x2="40" y1="50" y2="50"></line>
                    <line x1="60" x2="95" y1="50" y2="50"></line>
                    <line x1="18" x2="43" y1="18" y2="43"></line>
                    <line x1="57" x2="82" y1="57" y2="82"></line>
                    <line x1="82" x2="57" y1="18" y2="43"></line>
                    <line x1="43" x2="18" y1="57" y2="82"></line>
                  </g>
                </svg>
                <span className="text-[6.5px] font-bold text-[#FF6B00] dark:text-[#FFA800] leading-none mt-0.5 font-serif">सत्यमेव जयते</span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">{t.bisTitle}</span>
                  <span className="hidden sm:inline text-slate-400 text-sm font-normal">|</span>
                  <span className="hidden sm:inline text-lg font-extrabold text-[#FF6B00] dark:text-[#FFA800]">{t.bisHindiTitle}</span>
                </div>
                <div className="hidden sm:flex text-xs text-slate-500 dark:text-slate-400 items-center space-x-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Bureau of Indian Standards</span>
                  <span>•</span>
                  <span className="italic font-serif text-orange-600 dark:text-orange-400 font-bold">{t.bisMotto}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#FAF9F6] dark:bg-[#1E2330] p-1.5 rounded-2xl border border-[#E7E2D9] dark:border-[#242C3D] shadow-inner">
            <button
              onClick={() => setMode("ask_bis")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
                mode === "ask_bis"
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA800] text-white shadow-md shadow-orange-500/25 scale-[1.02]"
                  : "text-[#667085] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>{t.tabAskBis}</span>
            </button>

            <button
              onClick={() => setMode("find_my_standard")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
                mode === "find_my_standard"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                  : "text-[#667085] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">rule</span>
              <span>{t.tabFindStandard}</span>
            </button>

            <button
              onClick={() => setMode("laboratories")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
                mode === "laboratories"
                  ? "bg-gradient-to-r from-[#10B981] to-[#0D9488] text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
                  : "text-[#667085] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">biotech</span>
              <span>{t.tabLabs}</span>
            </button>

            <button
              onClick={() => setMode("verify_marks")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
                mode === "verify_marks"
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-md shadow-purple-500/25 scale-[1.02]"
                  : "text-[#667085] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{t.tabVerifyMarks}</span>
            </button>
          </nav>

          {/* Right Controls: Persona, Language, Theme */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Click-driven Persona dropdown — hidden on mobile */}
            <div className="relative hidden sm:block" ref={personaDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setPersonaDropdownOpen(prev => !prev);
                  setLanguageDropdownOpen(false);
                }}
                className="bg-[#FAF9F6] dark:bg-[#1E2330] hover:bg-white border border-[#E7E2D9] dark:border-[#242C3D] rounded-lg px-2.5 py-1.5 flex items-center space-x-1.5 text-xs font-bold text-[#101828] dark:text-[#FAF9F6] shadow-2xs transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
                <span>{currentPersona.label}</span>
                <span className={`material-symbols-outlined text-[15px] text-[#667085] transition-transform ${personaDropdownOpen ? "rotate-180" : ""}`}>
                  arrow_drop_down
                </span>
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#161B26] border border-[#E7E2D9] dark:border-[#242C3D] rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 font-bold text-[#667085] uppercase text-[10px] tracking-wider border-b border-[#E7E2D9] dark:border-[#242C3D] mb-1">
                    {t.personaHeader}
                  </div>
                  {(Object.keys(t.personas) as PersonaType[]).map(pKey => {
                    const pItem = t.personas[pKey];
                    const meta = PERSONA_META[pKey];
                    const isSelected = persona === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => {
                          setPersona(pKey);
                          setPersonaDropdownOpen(false);
                          saveSessionState(messages, pKey, language);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-[#FAF9F6] dark:bg-[#1F2430] font-bold text-[#101828] dark:text-[#FAF9F6]"
                            : "hover:bg-[#FAF9F6] dark:hover:bg-[#1F2430] text-[#101828] dark:text-[#FAF9F6]"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="material-symbols-outlined text-[16px] text-[#FF7A00]">{meta?.iconName || "groups"}</span>
                          <span>{pItem.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#138808]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Click-driven 11-Language Selector — hidden on mobile */}
            <div className="relative hidden sm:block" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setLanguageDropdownOpen(prev => !prev);
                  setPersonaDropdownOpen(false);
                }}
                className="bg-[#FAF9F6] dark:bg-[#1E2330] border border-[#E7E2D9] dark:border-[#242C3D] rounded-lg px-2.5 py-1.5 flex items-center space-x-1.5 text-xs font-bold text-[#101828] dark:text-[#FAF9F6] shadow-2xs transition-colors"
              >
                <span>{LANGUAGES.find(l => l.id === language)?.flag || "🇮🇳"}</span>
                <span>{LANGUAGES.find(l => l.id === language)?.nativeName || "English"}</span>
                <span className={`material-symbols-outlined text-[15px] text-[#667085] transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#161B26] border border-[#E7E2D9] dark:border-[#242C3D] rounded-xl shadow-xl py-1.5 z-50 text-xs max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 font-bold text-[#667085] uppercase text-[10px] tracking-wider border-b border-[#E7E2D9] dark:border-[#242C3D] mb-1">
                    {t.languageHeader}
                  </div>
                  {LANGUAGES.map(langItem => {
                    const isSelected = language === langItem.id;
                    return (
                      <button
                        key={langItem.id}
                        type="button"
                        onClick={() => {
                          handleLanguageChange(langItem.id);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                          isSelected
                            ? "font-bold text-[#101828] dark:text-[#FAF9F6] bg-[#FAF9F6] dark:bg-[#1F2430]"
                            : "hover:bg-[#FAF9F6] dark:hover:bg-[#1F2430] text-[#101828] dark:text-[#FAF9F6]"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{langItem.flag}</span>
                          <span>{langItem.nativeName}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#138808]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-[#101828] dark:text-[#FAF9F6] hover:bg-[#FAF9F6] dark:hover:bg-[#1F2430] rounded-lg border border-[#E7E2D9] dark:border-[#242C3D] transition-colors"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[18px]">{darkMode ? "light_mode" : "dark_mode"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= 4. STATUTORY GAZETTE TICKER (Midnight Indigo Ticker) ================= */}
      <div className="bg-gradient-to-r from-[#070D1C] via-[#101B38] to-[#070D1C] text-slate-100 border-b border-indigo-950/80 py-1.5 px-4 overflow-hidden relative shadow-inner flex-shrink-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FFA800] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full mr-3 flex-shrink-0 z-10 shadow-md shadow-orange-500/30">
            <span className="material-symbols-outlined text-[13px] animate-bounce">bolt</span>
            <span>{t.tickerLabel}</span>
          </div>

          <div className="overflow-hidden flex-1 relative whitespace-nowrap">
            <div className="marquee-track text-xs font-semibold text-slate-200 flex items-center space-x-8">
              {t.tickerItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="inline-flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? "bg-[#10B981] shadow-xs shadow-emerald-400" : "bg-[#FFA800] shadow-xs shadow-amber-400"}`}></span>
                    <span>{item}</span>
                  </span>
                  <span className="text-[#FF7A00] font-bold">•</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5. MAIN WORKSPACE WITH COLLAPSIBLE SIDEBAR ================= */}
      <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full flex overflow-hidden">

        {/* ── LEFT SIDEBAR: NEW CHAT & CONSULTATION HISTORY (Midnight Royal Slate) ─────────── */}
        {sidebarOpen && (
          <>
            {/* Mobile backdrop overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          <aside className="fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-72 md:w-64 lg:w-72 bg-gradient-to-b from-[#0A101D] via-[#0F172A] to-[#070B14] text-slate-100 border-r border-slate-800/80 flex flex-col flex-shrink-0 p-3.5 space-y-3.5 shadow-2xl h-full max-h-full min-h-0 overflow-y-auto sidebar-scroll">
            {/* New Chat Button (Vibrant Saffron Shimmer + Interactive Hover) */}
            <button
              onClick={startNewChat}
              className="group relative w-full bg-gradient-to-r from-[#FF6B00] via-[#FFA800] to-[#FF6B00] hover:from-[#EA580C] hover:via-[#F59E0B] hover:to-[#D97706] text-white py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 btn-shimmer cursor-pointer"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
              <span>+ {t.newConsultation}</span>
            </button>

            {/* Quick Mode Navigation in Sidebar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-0.5 flex items-center justify-between">
                <span>Navigation</span>
                <span className="text-[9px] font-mono text-slate-400">4 MODES</span>
              </div>

              {/* Ask BIS */}
              <button
                onClick={() => setMode("ask_bis")}
                className={`sidebar-interactive-item group w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 border cursor-pointer ${
                  mode === "ask_bis"
                    ? "bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm shadow-orange-500/20 font-black"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800/80 hover:border-slate-700/70 hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform duration-200 ${mode === "ask_bis" ? "text-orange-400" : "text-slate-400 group-hover:text-orange-400"}`}>smart_toy</span>
                  <span>{t.tabAskBis}</span>
                </div>
                {mode === "ask_bis" && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-xs shadow-orange-400"></span>}
              </button>

              {/* Find My Standard */}
              <button
                onClick={() => setMode("find_my_standard")}
                className={`sidebar-interactive-item group w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 border cursor-pointer ${
                  mode === "find_my_standard"
                    ? "bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-500/20 font-black"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800/80 hover:border-slate-700/70 hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform duration-200 ${mode === "find_my_standard" ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"}`}>rule</span>
                  <span>{t.tabFindStandard}</span>
                </div>
                {mode === "find_my_standard" && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-xs shadow-blue-400"></span>}
              </button>

              {/* Laboratories (LIMS) */}
              <button
                onClick={() => setMode("laboratories")}
                className={`sidebar-interactive-item group w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 border cursor-pointer ${
                  mode === "laboratories"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20 font-black"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800/80 hover:border-slate-700/70 hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform duration-200 ${mode === "laboratories" ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"}`}>biotech</span>
                  <span>{t.tabLabs}</span>
                </div>
                {mode === "laboratories" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400"></span>}
              </button>

              {/* Verify Marks & HUID */}
              <button
                onClick={() => setMode("verify_marks")}
                className={`sidebar-interactive-item group w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 border cursor-pointer ${
                  mode === "verify_marks"
                    ? "bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-sm shadow-purple-500/20 font-black"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800/80 hover:border-slate-700/70 hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform duration-200 ${mode === "verify_marks" ? "text-purple-400" : "text-slate-400 group-hover:text-purple-400"}`}>verified</span>
                  <span>{t.tabVerifyMarks}</span>
                </div>
                {mode === "verify_marks" && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-xs shadow-purple-400"></span>}
              </button>
            </div>

            {/* Session Search Bar with Hover & Focus Highlight */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="relative group">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                <input
                  type="text"
                  value={sessionSearchQuery}
                  onChange={e => setSessionSearchQuery(e.target.value)}
                  placeholder={t.searchHistoryPlaceholder}
                  className="w-full bg-slate-900/90 border border-slate-700/80 group-hover:border-orange-500/50 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Saved Chat Sessions */}
            <div className="flex-1 min-h-[140px] overflow-y-auto space-y-1.5 sidebar-scroll pr-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                <span>{t.consultationsTitle}</span>
                <span className="font-mono text-[9px] bg-slate-800/90 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-slate-700/50">{filteredSessions.length}</span>
              </div>

              {filteredSessions.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-900/40 rounded-xl border border-slate-800/50">
                  {t.noPastChats}
                </div>
              ) : (
                filteredSessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => switchSession(s)}
                    className={`sidebar-interactive-item group px-3 py-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all duration-200 border ${
                      s.id === currentSessionId
                        ? "bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-slate-900/60 text-white font-bold border-l-4 border-l-orange-500 border-orange-500/30 shadow-md"
                        : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800/80 hover:border-slate-700/70 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-orange-400 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{s.title || t.newConsultation}</span>
                    </div>
                    <button
                      onClick={(e) => deleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 p-1 rounded-md transition-all duration-200"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Bottom: Clear History & Grounding */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2 mt-auto">
              {sessions.length > 1 && (
                <button
                  onClick={clearAllSessions}
                  className="group w-full text-center text-[11px] text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 hover:border-rose-900/50 border border-transparent py-1.5 px-2 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>{t.clearHistory}</span>
                </button>
              )}
              <div className="group text-[11px] text-slate-300 bg-slate-900/90 hover:bg-slate-800/90 p-3 rounded-2xl space-y-1 border border-slate-800 hover:border-emerald-500/40 shadow-sm hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200 cursor-default">
                <div className="font-extrabold text-white flex items-center space-x-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10B981] group-hover:scale-110 transition-transform duration-200">verified_user</span>
                  <span>{t.badgeSource}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Grounded against 741 verified Indian Standards &amp; Gazette notifications.</p>
              </div>
            </div>
          </aside>
          </>
        )}

        {/* ── MAIN CONTENT AREA ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/40 dark:from-[#060A14] dark:via-[#0A0F1D] dark:to-[#060A14]">

          {/* ================= MODE 1: ASK BIS CHATBOT ================= */}
          {mode === "ask_bis" && (
            <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 space-y-4 custom-scroll">
                {/* Dynamic Chat History Translation Banner */}
                {isTranslatingHistory && (
                  <div className="max-w-3xl mx-auto flex items-center justify-center py-2.5 px-4 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-xl text-xs font-bold text-[#FF7A00] space-x-2 animate-pulse shadow-2xs">
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Updating consultation history to {LANGUAGES.find(l => l.id === language)?.nativeName || language}...</span>
                  </div>
                )}

                {messages.length === 0 ? (
                  /* Hero Empty State */
                  <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#161B26] border border-[#E7E2D9] dark:border-[#242C3D] flex items-center justify-center mx-auto shadow-2xs">
                      <span className="material-symbols-outlined text-[#101828] dark:text-[#FAF9F6] text-[32px]">smart_toy</span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] dark:text-white tracking-tight">
                        {t.heroTitle}
                      </h2>
                      <p className="text-sm text-[#667085] dark:text-[#98A2B3] max-w-lg mx-auto">
                        {currentPersona.tagline}
                      </p>
                    </div>

                    {/* Quick action grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                      {currentPersona.quickActions.map((qa, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setInput(qa.query); handleSend(qa.query); }}
                          className="civic-card-hover p-3 rounded-xl bg-white dark:bg-[#161B26] border border-[#E7E2D9] dark:border-[#242C3D] hover:border-[#101828] dark:hover:border-[#FF7A00] transition-all flex items-start space-x-3 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[#101828] dark:text-[#FF7A00] text-[20px] flex-shrink-0 mt-0.5">{qa.iconName}</span>
                          <div>
                            <span className="font-bold text-xs text-[#101828] dark:text-[#FAF9F6] block">{qa.label}</span>
                            <span className="text-[11px] text-[#667085] line-clamp-2">{qa.query}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Message Bubbles */
                  messages.map(msg => (
                    <div key={msg.id} className="max-w-3xl mx-auto space-y-3 animate-fade-in-up">
                      {msg.role === "user" ? (
                        /* User message (Deep Slate Indigo Gradient) */
                        <div className="flex justify-end">
                          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl rounded-tr-xs px-5 py-3.5 max-w-xl shadow-md border border-slate-700/60 text-sm space-y-1.5">
                            <div className="text-[10px] text-slate-300 font-mono flex items-center justify-between gap-4">
                              <span className="font-semibold text-orange-400">You ({currentPersona.label})</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        /* Assistant message (Glassmorphic Card with Saffron/Emerald micro-accent) */
                        <article className="glass-card bg-white/95 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl rounded-tl-xs p-5 sm:p-6 shadow-md space-y-4 text-[#0F172A] dark:text-[#F8FAFC] border-l-4 border-l-[#FF6B00]">
                          {/* Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center space-x-2">
                              <span className="material-symbols-outlined text-[#10B981] text-[20px]">verified</span>
                              <span className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-sm tracking-tight">{t.statutoryNotice}</span>
                            </div>

                            {msg.confidence_level && (
                              <span className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-3 py-0.5 rounded-full ${
                                msg.confidence_level === "HIGH"
                                  ? "text-[#059669] dark:text-[#34D399] bg-[#10B981]/15 border border-[#10B981]/40 pulse-glow-green"
                                  : msg.confidence_level === "MEDIUM"
                                  ? "text-[#D97706] dark:text-[#FBBF24] bg-[#F59E0B]/15 border border-[#F59E0B]/40 pulse-glow-amber"
                                  : "text-[#64748B] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                  msg.confidence_level === "HIGH" ? "bg-[#10B981]" : msg.confidence_level === "MEDIUM" ? "bg-[#F59E0B]" : "bg-[#64748B]"
                                }`}></span>
                                <span>
                                  {msg.confidence_level === "HIGH" ? t.confHigh : msg.confidence_level === "MEDIUM" ? t.confMed : t.confLow}
                                </span>
                              </span>
                            )}
                          </div>

                          {/* Multilingual Notice */}
                          {msg.multilingual_notice && (
                            <div className="text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-blue-50/70 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-200/60 dark:border-blue-800/60 flex items-center space-x-2">
                              <span className="material-symbols-outlined text-[16px] text-[#2563EB]">translate</span>
                              <span>{msg.multilingual_notice}</span>
                            </div>
                          )}

                          {/* Structured Content with Tables and Callouts */}
                          <FormattedMarkdown content={msg.content} />

                          {/* Actionable Procedural Checklist */}
                          {msg.checklist && msg.checklist.steps && (
                            <div className="pt-3 border-t border-[#E7E2D9] dark:border-[#242C3D] space-y-2">
                              <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center space-x-1.5">
                                <span className="material-symbols-outlined text-[16px] text-[#101828] dark:text-[#FF7A00]">checklist</span>
                                <span>{msg.checklist.title || t.checklistTitle}</span>
                              </h4>
                              <div className="space-y-2">
                                {msg.checklist.steps.map((step, sIdx) => {
                                  const stepKey = `${msg.id}-${step.id}`;
                                  const isChecked = !!checkedSteps[stepKey];
                                  return (
                                    <div
                                      key={step.id}
                                      onClick={() => setCheckedSteps(p => ({ ...p, [stepKey]: !isChecked }))}
                                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-3 ${
                                        isChecked
                                          ? "bg-[#138808]/5 border-[#138808]/30"
                                          : "bg-[#FAF9F6] dark:bg-[#1F2430] border-[#E7E2D9] dark:border-[#242C3D] hover:border-[#D5CEBE]"
                                      }`}
                                    >
                                      <div className="mt-0.5 flex-shrink-0">
                                        {isChecked ? (
                                          <CheckSquare className="w-4 h-4 text-[#138808]" />
                                        ) : (
                                          <Square className="w-4 h-4 text-[#667085]" />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <span className={`font-bold block ${isChecked ? "line-through text-[#667085]" : "text-[#101828] dark:text-[#FAF9F6]"}`}>
                                          Step {sIdx + 1}: {step.title}
                                        </span>
                                        <p className="text-[#667085] dark:text-[#98A2B3] mt-0.5">{step.description}</p>
                                        {step.reference_clause && (
                                          <span className="text-[10px] font-mono text-[#2563EB] font-semibold mt-1 block">
                                            Ref: {step.reference_clause}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Citations & Source Links */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="pt-3 border-t border-[#E7E2D9] dark:border-[#242C3D]">
                              <details className="group" open>
                                <summary className="text-xs font-bold text-[#101828] dark:text-[#FAF9F6] flex items-center justify-between cursor-pointer select-none py-1 hover:text-[#2563EB] transition-colors">
                                  <div className="flex items-center space-x-2">
                                    <span className="material-symbols-outlined text-[16px] text-[#2563EB]">menu_book</span>
                                    <span>{t.citationsTitle} · {msg.citations.length}</span>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#138808]/10 text-[#138808] border border-[#138808]/25">
                                      ✓ Verified
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-[#667085] font-mono group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                                  {msg.citations.map((c, cIdx) => (
                                    <div key={cIdx} className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#1F2430] border border-[#E7E2D9] dark:border-[#242C3D] text-xs flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors shadow-2xs">
                                      <div>
                                        <div className="flex items-center space-x-1.5 mb-1">
                                          <span className="text-[10px] font-bold text-[#138808] bg-[#138808]/10 px-1.5 py-0.5 rounded">✓ Official BIS source</span>
                                        </div>
                                        <div className="font-bold text-[#101828] dark:text-[#FAF9F6] line-clamp-1">{c.source_title}</div>
                                        <p className="text-[11px] text-[#667085] dark:text-[#98A2B3] italic line-clamp-2 mt-1 leading-relaxed bg-white/60 dark:bg-black/20 p-1.5 rounded-md border border-[#E7E2D9]/60 dark:border-[#242C3D]/60">
                                          &quot;{c.excerpt}&quot;
                                        </p>
                                      </div>
                                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#E7E2D9] dark:border-[#242C3D]">
                                        <span className="text-[10px] text-[#667085] dark:text-[#98A2B3] font-mono truncate max-w-[140px]">
                                          Sec: {c.section || "General"}
                                        </span>
                                        {c.source_url && (
                                          <a
                                            href={c.source_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#2563EB] hover:text-[#1d4ed8] font-bold text-[11px] flex items-center space-x-1 px-2 py-0.5 rounded bg-[#2563EB]/10 hover:bg-[#2563EB]/15 transition-colors"
                                          >
                                            <span>Open official BIS source</span>
                                            <ExternalLink className="w-3 h-3 ml-0.5" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          )}

                          {/* Action Bar (Audio + Copy + Followups) */}
                          <div className="pt-3 border-t border-[#E7E2D9] dark:border-[#242C3D] flex flex-wrap items-center justify-between gap-2">
                            {/* Voice TTS & Copy Controls */}
                            <div className="flex items-center space-x-2">
                              {playingMessageId === msg.id ? (
                                <div className="flex items-center space-x-2">
                                  {isAudioPaused ? (
                                    <button
                                      onClick={handleResumeAudio}
                                      className="bg-[#101828] text-[#FAF9F6] px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                      <span>Resume</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handlePauseAudio}
                                      className="bg-[#FF7A00] text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1"
                                    >
                                      <Pause className="w-3.5 h-3.5" />
                                      <span>Pause</span>
                                    </button>
                                  )}
                                  <button onClick={handleStopAudio} className="text-[#667085] hover:text-[#D92D20] p-1">
                                    <StopCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleSpeakMessage(msg)}
                                  className="bg-[#FAF9F6] dark:bg-[#1E2330] text-[#101828] dark:text-[#FAF9F6] hover:bg-[#E7E2D9] border border-[#E7E2D9] dark:border-[#242C3D] px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>{t.actionListen} ({language.toUpperCase()})</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="bg-[#FAF9F6] dark:bg-[#1E2330] text-[#667085] hover:text-[#101828] dark:text-[#98A2B3] dark:hover:text-white border border-[#E7E2D9] dark:border-[#242C3D] px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                                title="Copy response to clipboard"
                              >
                                {copiedMessageId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#138808]" />
                                    <span className="text-[#138808] font-bold">{t.actionCopied}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{t.actionCopy}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Suggested followups */}
                            {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {msg.suggested_followups.map((fu, fIdx) => (
                                  <button
                                    key={fIdx}
                                    onClick={() => { setInput(fu); handleSend(fu); }}
                                    className="bg-[#FAF9F6] dark:bg-[#1E2330] hover:bg-[#E7E2D9] border border-[#E7E2D9] dark:border-[#242C3D] text-[#101828] dark:text-[#FAF9F6] px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                                  >
                                    {fu}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </article>
                      )}
                    </div>
                  ))
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="max-w-3xl mx-auto bg-white dark:bg-[#161B26] border border-[#E7E2D9] dark:border-[#242C3D] rounded-2xl p-4 shadow-2xs flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-[#101828] typing-dot"></span>
                    <span className="w-2 h-2 rounded-full bg-[#101828] typing-dot"></span>
                    <span className="w-2 h-2 rounded-full bg-[#101828] typing-dot"></span>
                    <span className="text-xs text-[#667085] font-semibold">Synthesizing grounded BIS response with full provenance...</span>
                  </div>
                )}

                {/* Active Audio Waveform Banner */}
                {playingMessageId && (
                  <div className="max-w-3xl mx-auto bg-[#101828] text-[#FAF9F6] rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 h-4 flex-shrink-0">
                        <span className="w-1 bg-[#FF7A00] rounded-full h-3 eq-bar-1"></span>
                        <span className="w-1 bg-white rounded-full h-2 eq-bar-2"></span>
                        <span className="w-1 bg-[#138808] rounded-full h-4 eq-bar-3"></span>
                        <span className="w-1 bg-[#FF7A00] rounded-full h-2 eq-bar-4"></span>
                      </div>
                      <p className="text-[#FAF9F6] truncate italic text-xs font-medium">
                        {spokenExcerpt || "Playing BIS Saathi speech readout..."}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-[#98A2B3] flex-shrink-0 ml-3">
                      <span className="text-[11px] font-bold text-[#FF7A00]">{language.toUpperCase()}</span>
                      <button onClick={isAudioPaused ? handleResumeAudio : handlePauseAudio} className="text-white hover:text-[#FF7A00] p-0.5">
                        <span className="material-symbols-outlined text-[18px]">{isAudioPaused ? "play_circle" : "pause_circle"}</span>
                      </button>
                      <button onClick={handleStopAudio} className="text-white hover:text-[#D92D20] p-0.5">
                        <span className="material-symbols-outlined text-[18px]">stop_circle</span>
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Chat Input Dock */}
              <div className="p-3 sm:p-4 glass-header bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-lg">
                <div className="max-w-3xl mx-auto space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                    <label className="flex items-center space-x-2 cursor-pointer font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeChecklist}
                        onChange={e => setIncludeChecklist(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-orange-500 w-3.5 h-3.5"
                      />
                      <span>{t.includeChecklist}</span>
                    </label>
                    <span className="hidden sm:inline font-mono text-[10px] text-slate-400">Press Enter ↵ to send</span>
                  </div>

                  <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-orange-500 focus-within:ring-3 focus-within:ring-orange-500/20 p-2 sm:p-2.5 flex items-center gap-2 shadow-md transition-all">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                      placeholder={t.inputPlaceholder}
                      className="w-full border-0 p-1 text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:ring-0 text-sm bg-transparent font-medium"
                    />

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={startRecording}
                        className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative ${
                          micState === "LISTENING"
                            ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                        }`}
                        title="Voice Microphone (Speech-to-Text)"
                      >
                        {micState === "LISTENING" && (
                          <span className="radar-ring absolute inset-0 rounded-xl bg-red-500 opacity-60"></span>
                        )}
                        <Mic className="w-4 h-4 relative z-10" />
                      </button>

                      <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="bg-gradient-to-r from-[#FF6B00] to-[#FFA800] hover:from-[#EA580C] hover:to-[#F59E0B] text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40 shadow-md shadow-orange-500/25 btn-shimmer"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>
                            <span>Send</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-400">
                    {t.footerDisclaimer}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 2: FIND MY STANDARD ================= */}
          {mode === "find_my_standard" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scroll">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <span className="p-2 bg-[#FAF9F6] dark:bg-[#1E2330] border border-[#E7E2D9] dark:border-[#242C3D] text-[#FF7A00] rounded-xl inline-flex mb-1">
                    <span className="material-symbols-outlined text-[28px]">rule</span>
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#101828] dark:text-white">{t.findStandardTitle}</h2>
                  <p className="text-sm text-[#667085] dark:text-[#98A2B3] max-w-xl mx-auto">
                    {t.findStandardSubtitle}
                  </p>
                </div>

                {/* Standard Search Bar */}
                <div className="glass-card bg-white/95 dark:bg-[#111827]/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={productDesc}
                        onChange={e => setProductDesc(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleRecommendStandards(); }}
                        placeholder={t.findStandardSearchPlaceholder}
                        className="w-full text-sm pl-10 pr-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/70 text-[#0F172A] dark:text-[#F8FAFC] font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => handleRecommendStandards()}
                      disabled={isRecommending || !productDesc.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-2 flex-shrink-0 shadow-md shadow-blue-500/25 btn-shimmer"
                    >
                      {isRecommending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{t.findStandardSearchBtn}</span>}
                    </button>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Stainless steel bottle", "Gold jewellery", "Ceiling fan", "Pressure cooker", "Helmet", "Cement", "Cables", "Toys", "Packaged Drinking Water"].map(chip => (
                      <button
                        key={chip}
                        onClick={() => { setProductDesc(chip); handleRecommendStandards(chip); }}
                        className="text-xs bg-slate-100/80 dark:bg-slate-800/80 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-all font-medium"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Grid */}
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map((rec, rIdx) => (
                      <div
                        key={rIdx}
                        className="glass-card civic-card-hover bg-white/95 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-3.5 flex flex-col justify-between border-l-4 border-l-blue-600"
                      >
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2 justify-between">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {rec.lifecycle_status === "CURRENT_WITH_AMENDMENTS" ? (
                                <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full text-[11px] font-extrabold pulse-glow-green">
                                  <span className="material-symbols-outlined text-[14px]">verified</span>
                                  <span>✓ Current — Amds Included</span>
                                </span>
                              ) : rec.lifecycle_status === "CURRENT" || rec.is_current_verified ? (
                                <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full text-[11px] font-extrabold pulse-glow-green">
                                  <span className="material-symbols-outlined text-[14px]">verified</span>
                                  <span>✓ Current BIS Standard</span>
                                </span>
                              ) : rec.lifecycle_status === "SUPERSEDED" ? (
                                <span className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 px-3 py-1 rounded-full text-[11px] font-extrabold">
                                  <span className="material-symbols-outlined text-[14px]">block</span>
                                  <span>Superseded Standard</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 px-3 py-1 rounded-full text-[11px] font-extrabold">
                                  <span className="material-symbols-outlined text-[14px]">help</span>
                                  <span>Unverified Lifecycle</span>
                                </span>
                              )}

                              {rec.qco_mandatory && (
                                <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                                  <span>{t.qcoMandatory}</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 font-mono bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-900/60">
                              {t.colMatchScore}: {Math.round(rec.confidence * 100)}%
                            </span>
                          </div>

                          <h3 className="font-mono text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{rec.standard_number}</h3>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{rec.title}</p>
                          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{rec.match_reason}</p>

                          {rec.verification_source && (
                            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                              <span className="material-symbols-outlined text-[13px] text-emerald-600">verified_user</span>
                              <span>Source: {rec.verification_source}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <a
                            href={rec.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 text-center bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-xs py-2.5 rounded-xl font-extrabold transition-all shadow-sm"
                          >
                            View on Portal
                          </a>
                          <button
                            onClick={() => {
                              const q = `What are the manufacturing, testing, and licensing requirements under ${rec.standard_number}?`;
                              setMode("ask_bis");
                              handleSend(q);
                            }}
                            className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                            <span>{t.btnAskBisAbout}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card bg-white/95 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-sm">
                    <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
                      {t.noStandardsFound}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= MODE 3: LABORATORIES (LIMS) ================= */}
          {mode === "laboratories" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scroll">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <span className="p-2 bg-[#FAF9F6] dark:bg-[#1E2330] border border-[#E7E2D9] dark:border-[#242C3D] text-[#138808] rounded-xl inline-flex mb-1">
                    <span className="material-symbols-outlined text-[28px]">biotech</span>
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#101828] dark:text-white">{t.labTitle}</h2>
                  <p className="text-sm text-[#667085] dark:text-[#98A2B3] max-w-xl mx-auto">
                    {t.labSubtitle}
                  </p>
                </div>

                {/* Lab Search Filters */}
                <form onSubmit={handleSearchLabs} className="glass-card bg-white/95 dark:bg-[#111827]/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">Product or Material</label>
                      <input
                        type="text"
                        value={labSearchProduct}
                        onChange={e => setLabSearchProduct(e.target.value)}
                        placeholder={t.labSearchProductPlaceholder}
                        className="w-full p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/70 text-[#0F172A] dark:text-[#F8FAFC] font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">City / State</label>
                      <input
                        type="text"
                        value={labSearchLocation}
                        onChange={e => setLabSearchLocation(e.target.value)}
                        placeholder={t.labSearchLocationPlaceholder}
                        className="w-full p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/70 text-[#0F172A] dark:text-[#F8FAFC] font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isSearchingLabs}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-3 rounded-2xl font-extrabold flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/25 btn-shimmer"
                      >
                        {isSearchingLabs ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{t.labSearchBtn}</span>}
                      </button>
                    </div>
                  </div>

                  {/* Discipline Filter Chips */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Discipline:</span>
                    {[
                      { id: "All", label: t.labDisciplineAll },
                      { id: "Chemical & Polymers", label: t.labDisciplineChemical },
                      { id: "Electrical & Electronics", label: t.labDisciplineElectrical },
                      { id: "Mechanical & Metals", label: t.labDisciplineMechanical },
                      { id: "Civil & Construction", label: t.labDisciplineCivil },
                      { id: "Food & Drinking Water", label: t.labDisciplineFood },
                    ].map(d => (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => setSelectedDiscipline(d.id)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                          selectedDiscipline === d.id
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/30 scale-[1.02]"
                            : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Laboratories List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredLabResults.map((lab, idx) => (
                    <div key={idx} className="glass-card civic-card-hover bg-white/95 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-3.5 flex flex-col justify-between border-l-4 border-l-emerald-500">
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">{lab.lab_name}</h4>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full font-extrabold flex-shrink-0">
                            {lab.lab_type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{lab.address}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{lab.contact}</span>
                        </p>
                        {lab.tat_days && (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>{t.labTat}: {lab.tat_days}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed">
                          {t.labScope}: {lab.scope_highlights}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                        <a
                          href={lab.official_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-xl text-xs font-extrabold block transition-all shadow-sm shadow-emerald-500/20"
                        >
                          {t.labOfficialLims}
                        </a>
                        <button
                          onClick={() => {
                            const q = `Where can I get my products tested at ${lab.lab_name} and what are the sample submission steps?`;
                            setMode("ask_bis");
                            handleSend(q);
                          }}
                          className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          {t.btnAskBisAbout}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 4: VERIFY MARKS & HUID ================= */}
          {mode === "verify_marks" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scroll">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <span className="p-2 bg-[#FAF9F6] dark:bg-[#1E2330] border border-[#E7E2D9] dark:border-[#242C3D] text-[#138808] rounded-xl inline-flex mb-1">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#101828] dark:text-white">{t.verifyTitle}</h2>
                  <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
                    {t.verifySubtitle}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                  {/* Card 1: ISI Mark */}
                  <div className="glass-card civic-card-hover bg-white/95 dark:bg-[#111827]/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3 border-l-4 border-l-blue-600">
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center space-x-2.5">
                      <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">verified</span>
                      </span>
                      <span>{t.verifyIsiHeading}</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t.verifyIsiDesc}
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-800 dark:text-slate-200 pl-2">
                      <li>Official <strong className="text-blue-600 dark:text-blue-400">BIS Standard Mark (ISI logo)</strong>.</li>
                      <li>The specific <strong>IS Standard Number</strong> at the top (e.g. <em>IS 17526</em>).</li>
                      <li>A unique <strong>7 to 10-digit CML Licence Number</strong> at the bottom (e.g. <em>CM/L-XXXXXXXXXX</em>).</li>
                    </ul>
                  </div>

                  {/* Card 2: Gold HUID */}
                  <div className="glass-card civic-card-hover bg-white/95 dark:bg-[#111827]/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3 border-l-4 border-l-amber-500">
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center space-x-2.5">
                      <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">diamond</span>
                      </span>
                      <span>{t.verifyHuidHeading}</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t.verifyHuidDesc}
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-800 dark:text-slate-200 pl-2">
                      <li><strong className="text-amber-600 dark:text-amber-400">BIS Logo (Triangle)</strong>.</li>
                      <li><strong>Purity &amp; Fineness Mark</strong>: 22K916, 18K750, 14K585, etc.</li>
                      <li><strong>6-Digit Alphanumeric HUID</strong> (Hallmarking Unique ID laser-engraved at a recognized AHC).</li>
                    </ul>
                  </div>

                  {/* Card 3: CRS Electronics */}
                  <div className="glass-card civic-card-hover bg-white/95 dark:bg-[#111827]/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-3 border-l-4 border-l-emerald-600">
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center space-x-2.5">
                      <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">devices</span>
                      </span>
                      <span>{t.verifyCrsHeading}</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t.verifyCrsDesc}
                    </p>
                  </div>

                  {/* Card 4: Grievance & BIS Care App */}
                  <div className="glass-card civic-card-hover bg-white/95 dark:bg-[#111827]/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4 border-l-4 border-l-rose-500">
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center space-x-2.5">
                      <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">gavel</span>
                      </span>
                      <span>{t.verifyGrievanceHeading}</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t.verifyGrievanceDesc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 block mb-1">Verify License Details</span>
                        <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">Enter CML number on BIS Care App to inspect factory name, address, and validity status.</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 block mb-1">Verify Gold HUID</span>
                        <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">Enter 6-digit HUID code to inspect jeweller registration and purity certification.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= 6. INSTITUTIONAL CIVIC FOOTER (Deep Ink Navy) ================= */}
      <footer className="bg-[#101828] text-[#FAF9F6] border-t border-[#242C3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#98A2B3] gap-2">
            <p>{t.footerCopyright}</p>
            <p className="font-mono text-[#667085]">Bureau of Indian Standards · Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi</p>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR (md:hidden) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0B101D]/98 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex shadow-2xl">
        <button
          onClick={() => setMode("ask_bis")}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all ${mode === "ask_bis" ? "text-[#FF6B00]" : "text-slate-400 dark:text-slate-500"}`}
        >
          <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          <span className="text-[9px] font-bold">Ask BIS</span>
          {mode === "ask_bis" && <span className="w-4 h-0.5 rounded-full bg-[#FF6B00]" />}
        </button>
        <button
          onClick={() => setMode("find_my_standard")}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all ${mode === "find_my_standard" ? "text-[#2563EB]" : "text-slate-400 dark:text-slate-500"}`}
        >
          <span className="material-symbols-outlined text-[22px]">rule</span>
          <span className="text-[9px] font-bold">Standards</span>
          {mode === "find_my_standard" && <span className="w-4 h-0.5 rounded-full bg-[#2563EB]" />}
        </button>
        <button
          onClick={() => setMode("laboratories")}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all ${mode === "laboratories" ? "text-[#10B981]" : "text-slate-400 dark:text-slate-500"}`}
        >
          <span className="material-symbols-outlined text-[22px]">biotech</span>
          <span className="text-[9px] font-bold">Labs</span>
          {mode === "laboratories" && <span className="w-4 h-0.5 rounded-full bg-[#10B981]" />}
        </button>
        <button
          onClick={() => setMode("verify_marks")}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all ${mode === "verify_marks" ? "text-[#8B5CF6]" : "text-slate-400 dark:text-slate-500"}`}
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span className="text-[9px] font-bold">Verify</span>
          {mode === "verify_marks" && <span className="w-4 h-0.5 rounded-full bg-[#8B5CF6]" />}
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-slate-400 dark:text-slate-500 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">{darkMode ? "light_mode" : "dark_mode"}</span>
          <span className="text-[9px] font-bold">Theme</span>
        </button>
      </nav>
    </div>
  );
}
