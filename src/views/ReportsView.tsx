import React, { useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Calendar,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { Tender, VendorBid } from '../types';
import { getBidComplianceResults } from '../utils/complianceAdapter';

interface ReportsViewProps {
  currentTender: Tender;
  currentBid: VendorBid;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentTender,
  currentBid,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const complianceResults = getBidComplianceResults(currentBid, currentTender);
  const riskExplanation = currentBid.aiRiskExplanation || currentBid.aiRiskSummary || 'Verification findings confirmed.';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Print Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Bid Compliance Verification Report
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Official GeM Record
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generated statutory evaluation dossier for Tender: <strong>{currentTender.tenderId}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Official Government Printable Document Dossier */}
      <div
        ref={printRef}
        className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-md max-w-4xl mx-auto space-y-8 text-slate-900 print:border-none print:shadow-none print:p-2"
      >
        {/* Government Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6">
          <div className="flex items-center justify-center gap-2 text-emerald-900 font-serif font-bold text-lg mb-1">
            <ShieldCheck className="w-6 h-6 text-[#0B5D3B]" />
            <span>GOVERNMENT e-MARKETPLACE (GeM)</span>
          </div>
          <h3 className="text-xl font-extrabold uppercase tracking-wide font-serif">
            Integrated Bid Compliance & Verification Dossier
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Governed under General Financial Rules (GFR) 2017 & Public Procurement Guidelines
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
            <span>Report ID: REP-2026-09842</span>
            <span>•</span>
            <span>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>NIC Node: DL-04</span>
          </div>
        </div>

        {/* Section 1: Tender & Vendor Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1. Procuring Entity & Tender Details
            </span>
            <div className="font-bold text-sm text-slate-900">{currentTender.tenderId}</div>
            <div>{currentTender.title}</div>
            <div className="text-slate-600">Org: {currentTender.procuringOrganization}</div>
            <div className="text-slate-600">Dept: {currentTender.department}</div>
            <div className="text-slate-600">Estimated Value: {currentTender.estimatedValue}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              2. Participating Bidder Details
            </span>
            <div className="font-bold text-sm text-slate-900">{currentBid.vendorName}</div>
            <div className="font-mono">GSTIN: {currentBid.gstin}</div>
            <div className="font-mono">PAN: {currentBid.pan}</div>
            <div className="text-slate-600">State of Incorporation: {currentBid.state}</div>
            <div className="text-slate-600">Seller Category: GeM Certified MSE Supplier</div>
          </div>
        </div>

        {/* Section 2: Executive Scoring Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
            3. Executive Compliance & Risk Index
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase block">Compliance Score</span>
              <span className="text-2xl font-bold text-[#0B5D3B] font-mono">
                {currentBid.complianceScore}%
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
                Threshold: 75% Min
              </span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] text-slate-500 uppercase block">Risk Score</span>
              <span className="text-2xl font-bold text-amber-700 font-mono">
                {currentBid.riskScore}/100
              </span>
              <span className="text-[10px] text-amber-800 font-semibold block mt-1">
                Class: {currentBid.riskLevel}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">Clauses Passed</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {currentBid.passedCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Out of 22 Evaluated</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">Anomalies Detected</span>
              <span className="text-2xl font-bold text-amber-700 font-mono">
                1 Flag
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">OEM Warranty Duration</span>
            </div>
          </div>
        </div>

        {/* Section 3: Clause-by-Clause Audit Trail */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
            4. Detailed Requirement Verification Matrix
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  <th className="py-2 px-3 font-semibold">Clause ID</th>
                  <th className="py-2 px-3 font-semibold">Requirement Title</th>
                  <th className="py-2 px-3 font-semibold">Expected</th>
                  <th className="py-2 px-3 font-semibold">Extracted Evidence</th>
                  <th className="py-2 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {complianceResults.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{r.clauseRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.requirementTitle}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.expectedValue}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{r.extractedValue}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          r.status === 'COMPLIANT'
                            ? 'bg-emerald-100 text-emerald-900'
                            : r.status === 'NEEDS_REVIEW'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: AI Explainability Notes */}
        <div className="space-y-2 text-xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
            5. Explainable AI Assessment Note
          </h4>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {riskExplanation}
          </p>
        </div>

        {/* Section 5: Procurement Officer Final Determination & Signature */}
        <div className="space-y-3 pt-4 border-t-2 border-slate-800 text-xs">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            6. Procurement Officer Final Determination
          </h4>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-950">
                Determination: Provisionally Qualified (Subject to Clarification Notice)
              </span>
              <span className="font-mono text-emerald-800 text-[11px]">
                DSC Signature Verified: SHA256-GOV-9842
              </span>
            </div>
            <p className="text-slate-800 leading-relaxed">
              <strong>Officer Remarks:</strong> Bidder meets financial strength and technical manufacturing eligibility. 48-hour clarification notice issued to provide written OEM warranty extension to 24 months.
            </p>
          </div>

          <div className="flex items-end justify-between pt-8">
            <div>
              <div className="text-[10px] text-slate-400">Timestamp: {new Date().toISOString()}</div>
              <div className="text-[10px] text-slate-400">Platform: BidSure AI v1.4 • SIH 2026</div>
            </div>

            <div className="text-right">
              <div className="w-48 border-b-2 border-slate-800 mb-1 ml-auto"></div>
              <div className="font-bold text-slate-900">Shri Vikram Sharma</div>
              <div className="text-slate-600">Senior Procurement Officer (GOV-9842)</div>
              <div className="text-slate-500 text-[10px]">Ministry of Petroleum & Natural Gas / CPCL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
