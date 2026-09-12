import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      service: "BidSure AI Procurement Engine",
      version: "1.0.0",
      sihProblemStatement: "SIH26100",
    });
  });

  // Copilot Assistant endpoint
  app.post("/api/ai/copilot", async (req, res) => {
    try {
      const { question, currentContext } = req.body;
      const ai = getGeminiClient();

      if (ai) {
        const prompt = `You are BidSure Copilot, an AI decision-support assistant for Government e-Marketplace (GeM) procurement officers in India (Smart India Hackathon 2026 Problem SIH26100).
Your role is to assist procurement officers in analyzing vendor bids, tender requirement compliance, document inconsistencies, and risk flags.
IMPORTANT: You are strictly a decision-support system. You MUST NOT make the final procurement decision. Always remind the officer that final qualification or disqualification rests with an authorized procurement officer.

Current Context Data:
${JSON.stringify(currentContext || {}, null, 2)}

User Question: "${question}"

Provide a concise, highly objective, professional, and explainable answer with bullet points if appropriate. Reference specific documents, evidence values, or tender clauses from the context if available.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        return res.json({
          success: true,
          answer: response.text || "No response generated.",
          source: "gemini-3.8-flash",
        });
      }

      // Fallback deterministic copilot answers based on context
      const qLower = (question || "").toLowerCase();
      let answer = "";

      if (qLower.includes("failed") || qLower.includes("fail")) {
        answer = "Based on the submitted bid documents for ABC Engineering Pvt Ltd:\n• Critical Failure: No outright technical/eligibility failure was detected.\n• Warning / Needs Review: The OEM Authorization Certificate (Doc #OEM-2025-88) is flagged because the authorized scope is for 12 months, whereas tender clause 4.2 mandates a minimum 24-month validity and direct OEM warranty backing.";
      } else if (qLower.includes("risk") || qLower.includes("medium risk")) {
        answer = "The bid is categorized as MEDIUM RISK (Score: 32/100) due to:\n1. OEM Authorization Ambiguity (+12 risk points): Missing explicit 2-year warranty commitment.\n2. Cross-Document Name Variation (+5 risk points): GST document states 'ABC Engineering Pvt Ltd' while PAN records show 'ABC Engineering Private Limited' (verified as legal abbreviation, but flagged for MCA validation).\n3. Experience Work Order: Work completion certificate for Neyveli project lacks the supervising engineer's counter-signature (+8 risk points).";
      } else if (qLower.includes("missing")) {
        answer = "Document Checklist Analysis:\n• Submitted & Verified: GST, PAN, Udyam MSME, 3-Year Audited Balance Sheets, Technical Spec Sheet, Make-in-India 68% Declaration.\n• Flagged / Incomplete: OEM Direct Authorization Letter (insufficient duration clause).\n• Optional Pending: ISO 9001:2015 Recertification document is dated within 30 days of expiry.";
      } else if (qLower.includes("score") || qLower.includes("compliance score")) {
        answer = "Overall Compliance Score is 87/100 calculated across 5 weighted categories:\n• Eligibility (30% weight): 30/30 (100%)\n• Financial (25% weight): 25/25 (Turnover ₹14.2 Cr exceeds required ₹10 Cr)\n• Technical & OEM (20% weight): 12/20 (OEM letter duration shortfall)\n• Legal & Registrations (15% weight): 14/15 (Name variation flag)\n• Experience & Past Track Record (10% weight): 8/10 (Missing 1 counter-signature)";
      } else if (qLower.includes("compare")) {
        answer = "Comparison Summary across Active Bidders for Tender #CPCL-IEP-2026-088:\n1. ABC Engineering: Compliance 87%, Risk Medium, Price L1 pending, OEM Review needed.\n2. Bharat InfraTech: Compliance 92%, Risk Low, All docs verified, Turnover ₹22.4 Cr.\n3. Apex Machinery Works: Compliance 74%, Risk High, Missing EPFO clearance & financial shortfall.\n4. Kirloskar Heavy Eng: Compliance 89%, Risk Low, OEM Pass, Validated MSME.\n5. Delta Pumps & Controls: Compliance 68%, Risk High, Blacklist check flag.";
      } else {
        answer = `Regarding your inquiry: "${question}":\n• The current bid under review is from ABC Engineering Pvt Ltd against Tender CPCL-IEP-2026-088.\n• 18 of 22 requirements are Fully Compliant, 3 require Officer Verification, and 1 has an OEM duration discrepancy.\n• As an AI decision-support assistant, I recommend requesting a clarification letter from ABC Engineering regarding the OEM warranty period before proceeding to final financial bid opening.`;
      }

      return res.json({
        success: true,
        answer,
        source: "deterministic-engine",
      });
    } catch (err: any) {
      console.error("Copilot API Error:", err);
      res.status(500).json({ error: err?.message || "Internal server error" });
    }
  });

  // AI Extract Requirements endpoint
  app.post("/api/ai/extract-tender", async (req, res) => {
    try {
      const { tenderTitle, tenderDescription, department } = req.body;
      const ai = getGeminiClient();

      if (ai) {
        const prompt = `You are an expert procurement officer in the Government e-Marketplace (GeM) system.
Analyze the following tender document and extract structured eligibility requirements.
Tender Title: ${tenderTitle}
Department: ${department}
Description: ${tenderDescription}

Return a valid JSON array of structured requirements with:
- id: string
- category: one of ["Eligibility", "Financial", "Technical", "Legal", "Experience"]
- requirement: short title
- clauseReference: string (e.g. "Clause 4.1.2")
- expectedValue: string
- weight: number (e.g. 5 to 20)
- mandatory: boolean
- description: string`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        try {
          const parsed = JSON.parse(response.text || "[]");
          return res.json({ success: true, requirements: parsed });
        } catch (e) {
          // fallback
        }
      }

      // Default structured requirements
      res.json({
        success: true,
        requirements: [
          {
            id: "REQ-01",
            category: "Financial",
            requirement: "Minimum Annual Turnover",
            clauseReference: "Section 3.1(a)",
            expectedValue: "≥ ₹10.00 Crore (Avg. of last 3 FY)",
            weight: 20,
            mandatory: true,
            description: "Audited financial statements certified by a Chartered Accountant with valid UDIN.",
          },
          {
            id: "REQ-02",
            category: "Legal",
            requirement: "GST Registration Status",
            clauseReference: "Section 2.4",
            expectedValue: "Active GSTIN with no tax default",
            weight: 15,
            mandatory: true,
            description: "Valid GST Registration Certificate in the state of supply or operation.",
          },
          {
            id: "REQ-03",
            category: "Legal",
            requirement: "PAN & Income Tax Compliance",
            clauseReference: "Section 2.5",
            expectedValue: "Valid Permanent Account Number",
            weight: 10,
            mandatory: true,
            description: "ITR Acknowledgement for last 3 Assessment Years (AY 2023-24, 2024-25, 2025-26).",
          },
          {
            id: "REQ-04",
            category: "Technical",
            requirement: "OEM Authorization & Warranty",
            clauseReference: "Section 4.2",
            expectedValue: "Valid Manufacturer Authorization Letter (≥ 24 months)",
            weight: 20,
            mandatory: true,
            description: "Direct OEM authorization letter confirming supply rights and 24-month on-site warranty support.",
          },
          {
            id: "REQ-05",
            category: "Experience",
            requirement: "Past Performance / Similar Works",
            clauseReference: "Section 5.1",
            expectedValue: "At least 2 similar completed contracts (≥ ₹5 Cr each)",
            weight: 15,
            mandatory: false,
            description: "Work orders or satisfactory completion certificates from PSU or Government bodies.",
          },
          {
            id: "REQ-06",
            category: "Eligibility",
            requirement: "Make in India (MII) Local Content",
            clauseReference: "PPP-MII Order 2017",
            expectedValue: "Class-I Local Supplier (≥ 50% local content)",
            weight: 10,
            mandatory: true,
            description: "Self-declaration of local content percentage and manufacturing location.",
          },
          {
            id: "REQ-07",
            category: "Eligibility",
            requirement: "MSME / Udyam Registration",
            clauseReference: "MSMED Act 2006",
            expectedValue: "Valid Udyam Registration Certificate (if claiming exemption)",
            weight: 10,
            mandatory: false,
            description: "Udyam certificate for exemption from EMD and prior experience/turnover relaxation where applicable.",
          },
        ],
      });
    } catch (err: any) {
      console.error("Tender extraction error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BidSure AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
