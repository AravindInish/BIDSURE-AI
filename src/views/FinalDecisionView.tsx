import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  Printer,
  Sparkles,
  Building
} from 'lucide-react';
import { VendorBid, Tender } from '../types';

interface FinalDecisionViewProps {
  currentTender: Tender;
  currentBid: VendorBid;
  onConfirmDecision: (decision: 'Qualified' | 'Disqualified' | 'Needs Clarification', remarks: string) => void;
  onNavigateToReport: () => void;
}

export const FinalDecisionView: React.FC<FinalDecisionViewProps> = ({
  currentTender,
  currentBid,
  onConfirmDecision,
  onNavigateToReport,
}) => {
  const [decision, setDecision] = useState<'Qualified' | 'Disqualified' | 'Needs Clarification'>('Needs Clarification');
  const [remarks, setRemarks] = useState(
    'Bid is provisionally acceptable on technical competence and turnover capacity (₹14.2 Cr vs ₹10 Cr min). Vendor must submit a written undertaking from OEM extending warranty from 12 to 24 months within 48 hours before financial opening.'
  );
  const [isSigned, setIsSigned] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Officer remarks are mandatory under GFR-2017.');
      return;
    }
    if (!isSigned) {
      alert('Please check the digital signature token box to certify this decision.');
      return;
    }
    onConfirmDecision(decision, remarks);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0B5D3B]" />
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Procurement Officer Final Determination
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory bid qualification certification under GeM Tender: <strong>{currentTender.tenderId}</strong>
            </p>
          </div>

          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-mono font-semibold self-start">
            DSC Token: GOV-9842 (Active)
          </span>
        </div>

        {/* Prominent Statutory AI Disclaimer */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Statutory Mandate:</strong> AI recommendations are strictly advisory decision-support mechanisms. In accordance with General Financial Rules (GFR) 2017 and CVC procurement guidelines, final bid qualification or disqualification is made exclusively under the statutory authority of authorized procurement officers.
          </div>
        </div>
      </div>

      {/* Summary Scorecard of Evaluated Bid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Summary Verification Findings
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Overall Compliance</span>
            <span className="text-2xl font-bold text-[#0B5D3B] font-mono">
              {currentBid.complianceScore}%
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Risk Rating</span>
            <span className="text-2xl font-bold text-amber-600 font-mono">
              {currentBid.riskLevel}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Clauses Passed</span>
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {currentBid.passedCount} / 22
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block">Critical Discrepancies</span>
            <span className="text-2xl font-bold text-red-600 font-mono">
              1 Flag
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Bidder Name: {currentBid.vendorName}</span>
            <span className="font-mono text-slate-500">GSTIN: {currentBid.gstin}</span>
          </div>
          <div className="text-slate-600">
            Identified Anomaly: OEM Authorization warranty duration (12 months offered vs 24 months mandated in Clause 4.2).
          </div>
        </div>
      </div>

      {/* Decision Selection & Signoff Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
            Select Official Qualification Determination
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Qualified */}
            <label
              onClick={() => setDecision('Qualified')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                decision === 'Qualified'
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-6 h-6 mb-1 ${decision === 'Qualified' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="text-sm">Technically Qualified</span>
              <span className="text-[10px] text-slate-500 mt-1">
                Meets all eligibility criteria; advance to financial bid opening
              </span>
            </label>

            {/* Needs Clarification */}
            <label
              onClick={() => setDecision('Needs Clarification')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                decision === 'Needs Clarification'
                  ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <AlertTriangle className={`w-6 h-6 mb-1 ${decision === 'Needs Clarification' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="text-sm">Needs Clarification</span>
              <span className="text-[10px] text-slate-500 mt-1">
                Issue 48-hr GeM notice for minor technical undertaking
              </span>
            </label>

            {/* Disqualified */}
            <label
              onClick={() => setDecision('Disqualified')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                decision === 'Disqualified'
                  ? 'border-red-600 bg-red-50/80 text-red-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <XCircle className={`w-6 h-6 mb-1 ${decision === 'Disqualified' ? 'text-red-600' : 'text-slate-400'}`} />
              <span className="text-sm">Disqualified</span>
              <span className="text-[10px] text-slate-500 mt-1">
                Failed mandatory criteria; reject bid with formal justification
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
            Procurement Officer Remarks & Statutory Justification
          </label>
          <textarea
            rows={4}
            required
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
            placeholder="Document rationale, committee deliberations, and compliance reference..."
          />
        </div>

        {/* Digital Signature Confirmation */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-800 select-none">
            <input
              type="checkbox"
              checked={isSigned}
              onChange={(e) => setIsSigned(e.target.checked)}
              className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
            />
            <span>
              I, <strong>Shri Vikram Sharma (Senior Procurement Officer, ID: GOV-9842)</strong>, hereby certify that I have independently audited the AI verification findings, examined documentary evidence, and authoritatively recorded this procurement decision under GeM guidelines and GFR 2017.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Decision will be permanently logged with cryptographic SHA-256 hash.
          </div>

          <div className="flex items-center gap-3">
            {isSubmitted && (
              <button
                type="button"
                onClick={onNavigateToReport}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Generate Official Report</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitted}
              className="px-6 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#06452D] disabled:opacity-50 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSubmitted ? 'Decision Sealed & Certified' : 'Confirm & Sign Decision'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
