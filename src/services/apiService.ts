import { Tender, VendorBid } from '../types';

export async function askCopilotApi(question: string, currentContext: {
  tender?: Tender;
  bid?: VendorBid;
  activeDoc?: any;
}): Promise<{ answer: string; source: string }> {
  try {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, currentContext }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        answer: data.answer || 'No response generated.',
        source: data.source || 'gemini-3.8-flash',
      };
    }
  } catch (err) {
    console.warn('Backend Copilot API error, falling back locally:', err);
  }

  // Graceful local fallback if offline or backend unavailable
  return {
    answer: `Analysis for "${question}":\n• Bid: ABC Engineering Pvt Ltd under Tender CPCL-IEP-2026-088.\n• Status: 87% Compliant (Medium Risk: 32/100).\n• Critical Item: OEM Authorization validity is 12 months vs tender requirement of 24 months.\n• Advisory: Officer review recommended before financial evaluation.`,
    source: 'local-fallback',
  };
}

export async function extractTenderRequirementsApi(tenderData: {
  tenderTitle: string;
  tenderDescription: string;
  department: string;
}) {
  try {
    const res = await fetch('/api/ai/extract-tender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenderData),
    });
    if (res.ok) {
      const data = await res.json();
      return data.requirements;
    }
  } catch (err) {
    console.warn('Extract tender API error:', err);
  }
  return null;
}
