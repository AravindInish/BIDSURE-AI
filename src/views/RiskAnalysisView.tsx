import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  ExternalLink,
  Search,
  Eye,
  ArrowRight,
  HelpCircle,
  Layers
} from 'lucide-react';
import { VendorBid, RiskFactor, ConsistencyCheck, Tender } from '../types';

interface RiskAnalysisViewProps {
  currentTender: Tender;
  currentBid: VendorBid;
  onInspectDocument: (docName: string) => void;
  onProceedToDecision: () => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  currentTender,
  currentBid,
  onInspectDocument,
  onProceedToDecision,
}) => {
  const [evidenceModalItem, setEvidenceModalItem] = useState<any | null>(null);

  const consistencyItems = currentBid.consistencyChecks || currentBid.contradictions || [];
  const riskNarrative = currentBid.aiRiskExplanation || currentBid.aiRiskSummary || 'Comprehensive risk analysis indicates low systemic risk with minor documentation nuances.';

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'text-emerald-700 bg-emerald-50 border-emerald-300';
      case 'MEDIUM':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'HIGH':
      case 'CRITICAL':
        return 'text-red-800 bg-red-50 border-red-300';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Risk & Inconsistency Intelligence
            </h2>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getRiskColor(
                currentBid.riskLevel
              )}`}
            >
              {currentBid.riskLevel} Risk ({currentBid.riskScore}/100)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cross-document contradiction analysis, expiry tracking, and requirement-to-evidence validation for <strong>{currentBid.vendorName}</strong>
          </p>
        </div>

        <button
          onClick={onProceedToDecision}
          className="px-4 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Officer Decision</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Section: Risk Score Breakdown & AI Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Dial Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Composite Risk Index
              </span>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>

            <div className="my-4 text-center">
              <div className="text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
                {currentBid.riskScore}
                <span className="text-lg text-slate-400 font-normal">/100</span>
              </div>
              <div className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {currentBid.riskLevel} RISK CLASSIFICATION
              </div>
            </div>

            {/* Visual Risk Breakdown Bars */}
            <div className="space-y-3 pt-2">
              {currentBid.riskBreakdown.map((r, idx) => (
                <div key={r.id || idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{r.name || r.factor}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {r.score} / {r.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        r.score <= 5 ? 'bg-emerald-600' : r.score <= 8 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(r.score / r.maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            GFR Risk Threshold: Bids with score &gt; 50 require Tender Committee escalation.
          </div>
        </div>

        {/* AI Risk Explanation Narrative Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Risk Assessment Narrative</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                Cross-Correlated
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-2">
              <p className="font-semibold">
                &ldquo;{riskNarrative}&rdquo;
              </p>
              <p className="text-[11px] text-amber-800">
                Primary risk attribution stems from the OEM Authorization Certificate where warranty coverage is cited as 12 months rather than the required 24 months. Past PSU delivery track record is positive with zero adverse CVC flags.
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  Missing Docs Risk
                </span>
                <span className="text-base font-bold text-emerald-700 font-mono">
                  10 / 25
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">0 Missing, 1 Minor</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  Expiry Risk
                </span>
                <span className="text-base font-bold text-emerald-700 font-mono">
                  5 / 25
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">All licenses active</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  Data Inconsistency
                </span>
                <span className="text-base font-bold text-amber-700 font-mono">
                  10 / 25
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Name suffix variance</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Debarment Status: <strong>CLEARED</strong> (No GeM / CVC blacklisting record)</span>
            <span className="text-emerald-700 font-semibold">PAN Solvency: Verified</span>
          </div>
        </div>
      </div>

      {/* Cross-Document Consistency Check Table (Contradiction Detection) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Cross-Document Consistency Check
              </h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                Contradiction Detection
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated cross-referencing between statutory certificates, balance sheets, and vendor declarations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Comparison Item</th>
                <th className="py-3 px-4 font-semibold">Value in Document A</th>
                <th className="py-3 px-4 font-semibold">Value in Document B</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consistencyItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{item.parameter || item.comparisonItem}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Rule: {item.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 bg-slate-50 p-1.5 rounded border border-slate-200">
                      {item.doc1Value || item.docAValue}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-800" />
                      <span>{item.doc1Name || item.docAName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 bg-slate-50 p-1.5 rounded border border-slate-200">
                      {item.doc2Value || item.docBValue}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-800" />
                      <span>{item.doc2Name || item.docBName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        item.severity === 'LOW'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : item.severity === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-red-50 text-red-900 border-red-300'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-relaxed max-w-xs">
                    {item.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement-to-Evidence Mapping Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Requirement-to-Evidence Traceability Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct linkage between tender clauses, submitted vendor proof, and verification audit trail
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Tender Requirement</th>
                <th className="py-3 px-4 font-semibold">Submitted Document</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Evidence Extracted</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentBid.complianceResults.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{req.requirementTitle}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {req.clauseRef} • {req.category}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span>{req.supportingDocument}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {req.pageReference}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'COMPLIANT'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : req.status === 'NEEDS_REVIEW'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-red-50 text-red-900 border-red-300'
                      }`}
                    >
                      {req.status === 'COMPLIANT' ? 'PASS' : req.status === 'NEEDS_REVIEW' ? 'REVIEW' : 'FAIL'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 max-w-xs truncate">
                    {req.extractedValue}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {req.aiConfidence}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEvidenceModalItem(req)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#0B5D3B] text-[#06452D] hover:text-white font-semibold text-xs border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Evidence</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Modal Popup */}
      {evidenceModalItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Documentary Evidence Audit
                </h3>
                <p className="text-xs text-slate-500">
                  {evidenceModalItem.clauseRef} — {evidenceModalItem.requirementTitle}
                </p>
              </div>
              <button
                onClick={() => setEvidenceModalItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Extracted Proof String
                </span>
                <p className="text-slate-900 font-mono font-bold text-sm">
                  &ldquo;{evidenceModalItem.extractedValue}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Source File</span>
                  <span className="font-medium text-slate-800">{evidenceModalItem.supportingDocument}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Page Location</span>
                  <span className="font-medium text-slate-800">{evidenceModalItem.pageReference}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <strong className="block text-emerald-900 mb-0.5">AI Contextual Reasoning:</strong>
                {evidenceModalItem.aiExplanation}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  onInspectDocument(evidenceModalItem.supportingDocument);
                  setEvidenceModalItem(null);
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Document Viewer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setEvidenceModalItem(null)}
                className="px-4 py-2 rounded-lg bg-[#0B5D3B] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
