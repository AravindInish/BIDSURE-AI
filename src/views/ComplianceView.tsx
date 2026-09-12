import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Scale,
  RefreshCw,
  Info,
  Edit2
} from 'lucide-react';
import { VendorBid, RequirementCompliance, Tender } from '../types';
import { getBidComplianceResults } from '../utils/complianceAdapter';

interface ComplianceViewProps {
  currentTender: Tender;
  currentBid: VendorBid;
  onAcceptResult: (complianceId: string) => void;
  onRequestManualReview: (complianceId: string) => void;
  onOverrideResult: (complianceId: string, newStatus: 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT', reason: string) => void;
  onInspectDocument: (docName: string) => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  currentTender,
  currentBid,
  onAcceptResult,
  onRequestManualReview,
  onOverrideResult,
  onInspectDocument,
}) => {
  const complianceResults = getBidComplianceResults(currentBid, currentTender);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(
    complianceResults.find((r) => r.status !== 'COMPLIANT')?.id || null
  );
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // Override modal state
  const [overrideModalReq, setOverrideModalReq] = useState<RequirementCompliance | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT'>('COMPLIANT');
  const [overrideReason, setOverrideReason] = useState('');

  const categories = ['ALL', 'Eligibility', 'Financial', 'Technical', 'Legal', 'Experience'];

  const filteredResults = complianceResults.filter((r) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return r.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  const handleOpenOverride = (req: RequirementCompliance) => {
    setOverrideModalReq(req);
    setOverrideStatus(req.status === 'COMPLIANT' ? 'NEEDS_REVIEW' : 'COMPLIANT');
    setOverrideReason('');
  };

  const handleConfirmOverride = () => {
    if (overrideModalReq && overrideReason.trim()) {
      onOverrideResult(overrideModalReq.id, overrideStatus, overrideReason.trim());
      setOverrideModalReq(null);
    } else {
      alert('Officer justification remarks are mandatory for audit compliance.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Compliance Verification Engine
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Clause-by-Clause Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating <strong>{currentBid.vendorName}</strong> against RFP clauses in <strong>{currentTender.tenderId}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowMethodologyModal(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Scale className="w-4 h-4 text-slate-600" />
          <span>View Scoring Methodology</span>
        </button>
      </div>

      {/* Top Banner: Circular Score & Weight Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circular Overall Score Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center relative">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Overall Compliance Score
          </span>

          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="10" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={currentBid.complianceScore >= 80 ? '#0B5D3B' : currentBid.complianceScore >= 65 ? '#D97706' : '#DC2626'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * currentBid.complianceScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-900 font-mono">
                {currentBid.complianceScore}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">out of 100</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Passed: {currentBid.passedCount}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Needs Review: {currentBid.reviewCount}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
              Failed: {currentBid.failedCount}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            GFR 2017 Qualifying Cutoff Threshold: <strong>75%</strong>
          </p>
        </div>

        {/* 5-Pillar Weight Breakdown */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Weighted Pillar Score Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated against tender evaluation criteria
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-mono">
                Weight Total: 100%
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'Eligibility Criteria', weight: 30, achieved: 30, color: 'bg-emerald-600' },
                { name: 'Financial Standing & Turnover', weight: 25, achieved: 25, color: 'bg-emerald-600' },
                { name: 'Technical & OEM Specifications', weight: 20, achieved: 12, color: 'bg-amber-500' },
                { name: 'Legal & Statutory Registrations', weight: 15, achieved: 15, color: 'bg-emerald-600' },
                { name: 'Prior Past Experience', weight: 10, achieved: 10, color: 'bg-emerald-600' },
              ].map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700 font-semibold">{p.name}</span>
                    <span className="text-slate-600 font-mono">
                      Achieved: <strong>{p.achieved}%</strong> / Weight: {p.weight}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${p.color} transition-all duration-700`}
                      style={{ width: `${(p.achieved / p.weight) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              Technical pillar carries deduction (-8 pts) due to OEM 12-mo warranty shortfall.
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Filter:
        </span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategoryFilter(c)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
              selectedCategoryFilter === c
                ? 'bg-[#0B5D3B] text-white border-emerald-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Clause-by-Clause Cards */}
      <div className="space-y-4">
        {filteredResults.map((req) => {
          const isCompliant = req.status === 'COMPLIANT';
          const isNeedsReview = req.status === 'NEEDS_REVIEW';
          const isNonCompliant = req.status === 'NON_COMPLIANT';
          const isExpanded = expandedCardId === req.id;

          return (
            <div
              key={req.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                isNonCompliant
                  ? 'border-red-300'
                  : isNeedsReview
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header Row */}
              <div
                onClick={() => setExpandedCardId(isExpanded ? null : req.id)}
                className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-0.5 shrink-0">
                    {isCompliant ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isNeedsReview ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {req.clauseRef}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {req.requirementTitle}
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {req.category}
                      </span>
                      {req.isOverridden && (
                        <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded font-semibold">
                          Officer Overridden
                        </span>
                      )}
                    </div>

                    {/* Expected vs Extracted Quick Row */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="text-slate-500">
                        Expected: <strong className="text-slate-700">{req.expectedValue}</strong>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        Extracted: <strong className={isCompliant ? 'text-emerald-800' : 'text-amber-800'}>{req.extractedValue}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badges: Status & Confidence */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono font-bold text-slate-700">
                      {req.aiConfidence}% Conf.
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Weight: {req.weight}%
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isCompliant
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isNeedsReview
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-red-50 text-red-900 border-red-300'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expandable Section: Explainable AI & Officer Controls */}
              {isExpanded && (
                <div className="p-5 bg-[#FBFDFB] border-t border-slate-100 space-y-4">
                  {/* Explainable AI Block */}
                  <div className="bg-white rounded-xl p-4 border border-emerald-900/10 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Why this result? (Explainable AI Engine)</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Model: Gemini-3.8-Flash-Procure
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900">AI Explanation:</strong> {req.aiExplanation}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Applied Evaluation Rule
                        </span>
                        <p className="text-slate-800 font-mono text-[11px]">
                          {req.ruleApplied}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                          Advisory Recommendation
                        </span>
                        <p className="text-emerald-950 font-medium">
                          {req.recommendation}
                        </p>
                      </div>
                    </div>

                    {/* Supporting Evidence Link */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FileText className="w-4 h-4 text-emerald-800" />
                        <span>
                          Supporting Document: <strong>{req.supportingDocument}</strong> ({req.pageReference})
                        </span>
                      </div>
                      <button
                        onClick={() => onInspectDocument(req.supportingDocument)}
                        className="text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View In Document Viewer</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {req.isOverridden && (
                      <div className="mt-2 p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900">
                        <strong>Officer Override Note:</strong> {req.overrideReason}
                      </div>
                    )}
                  </div>

                  {/* Human-in-the-Loop Officer Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-500 italic">
                      Officer actions dynamically recalculate compliance score & commit to audit trail.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAcceptResult(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Accept AI Result
                      </button>

                      <button
                        onClick={() => onRequestManualReview(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Request Clarification
                      </button>

                      <button
                        onClick={() => handleOpenOverride(req)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Override Result</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Override Justification Modal */}
      {overrideModalReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Officer Override Mandate
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overriding clause: <strong>{overrideModalReq.requirementTitle}</strong>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700">
              Current AI Result: <strong>{overrideModalReq.status}</strong> (Extracted: {overrideModalReq.extractedValue})
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select New Officer Status
              </label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="COMPLIANT">COMPLIANT (Full Pass)</option>
                <option value="NEEDS_REVIEW">NEEDS REVIEW (Subject to Clarification)</option>
                <option value="NON_COMPLIANT">NON-COMPLIANT (Disqualify Clause)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Mandatory Officer Justification Remarks (Recorded to Audit Trail)
              </label>
              <textarea
                rows={3}
                required
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="State statutory basis, committee resolution, or vendor affidavit justifying override..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setOverrideModalReq(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                className="px-4 py-2 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Sign & Apply Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoring Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                BidSure Scoring Methodology
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>
                Compliance Score is computed as a normalized weighted index across five distinct procurement dimensions specified in CVC & GFR-2017:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Eligibility (30%):</strong> Threshold criteria (Turnover, Inception, Incorporation).</li>
                <li><strong>Financial (25%):</strong> Net worth solvency, working capital, CA UDIN certification.</li>
                <li><strong>Technical (20%):</strong> Equipment specifications, OEM Authorization, API/ISO standards.</li>
                <li><strong>Legal/Statutory (15%):</strong> GSTIN active verification, PAN, MSME Udyam certificate.</li>
                <li><strong>Past Experience (10%):</strong> Completion certificates in identical PSU projects.</li>
              </ul>
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-200">
                <strong>Disqualification Rule:</strong> Any mandatory clause marked "NON_COMPLIANT" triggers an immediate disqualification flag, regardless of numerical aggregate score.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-4 py-2 rounded-lg bg-[#0B5D3B] text-white font-semibold text-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
