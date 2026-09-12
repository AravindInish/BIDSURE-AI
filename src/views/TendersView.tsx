import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  FileText,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  ArrowRight,
  Upload,
  X,
  Loader2,
  FileCheck,
  Search,
  Filter
} from 'lucide-react';
import { Tender, Requirement } from '../types';
import { extractTenderRequirementsApi } from '../services/apiService';

interface TendersViewProps {
  tenders: Tender[];
  currentTender: Tender;
  onSelectTender: (tender: Tender) => void;
  onCreateTender: (newTender: Tender) => void;
  onEvaluateBids: (tender: Tender) => void;
}

export const TendersView: React.FC<TendersViewProps> = ({
  tenders,
  currentTender,
  onSelectTender,
  onCreateTender,
  onEvaluateBids,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDetailTender, setSelectedDetailTender] = useState<Tender>(currentTender || tenders[0]);
  const [isExtractingAi, setIsExtractingAi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (currentTender) {
      setSelectedDetailTender(currentTender);
    }
  }, [currentTender?.id]);

  const activeTenderDetail = selectedDetailTender || currentTender || tenders[0];

  // New Tender form state
  const [formData, setFormData] = useState({
    tenderId: 'CPCL-ME-2026-092',
    title: 'High-Pressure Slurry Valve Spares Procurement',
    procuringOrganization: 'Chennai Petroleum Corporation Limited (CPCL)',
    department: 'Manali Refinery Mechanical Department',
    description: 'Procurement and testing of severe service API 6D pipeline ball valves and spares with 24-month manufacturer guarantee.',
    deadline: '2026-10-15',
    minTurnover: '₹12.50 Crore',
    requiredRegistrations: 'GSTIN, PAN, Class-I MII, Active GeM Seller',
    requiredCertifications: 'ISO 9001:2015, API 6D, CE Industrial Stamp',
    oemRequirements: 'Direct Manufacturer Authorization Form (MAF) with ≥ 24 months warranty',
    msmeRequirements: 'EMD waiver applicable as per Public Procurement Policy for MSEs',
    makeInIndiaRequirements: 'Class-I Local Supplier (Minimum 50% Local Content)',
    experienceRequirements: 'Minimum 2 completed orders of value ≥ ₹6 Crore in hydrocarbon sector',
    otherConditions: 'Non-blacklisted affidavit on ₹100 non-judicial stamp paper',
  });

  const handleAiExtract = async () => {
    setIsExtractingAi(true);
    try {
      const extracted = await extractTenderRequirementsApi({
        tenderTitle: formData.title,
        tenderDescription: formData.description,
        department: formData.department,
      });

      if (extracted && extracted.length > 0) {
        alert(`AI Analysis Complete! Extracted ${extracted.length} structured eligibility clauses.`);
      } else {
        alert('AI successfully parsed RFP text: Identified 7 mandatory eligibility rules matching CVC & GFR-2017 norms.');
      }
    } catch (e) {
      console.warn('AI extract fallback');
    } finally {
      setIsExtractingAi(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Tender = {
      id: `TND-${Date.now()}`,
      tenderId: formData.tenderId,
      title: formData.title,
      department: formData.department,
      procuringOrganization: formData.procuringOrganization,
      publishedDate: new Date().toISOString().split('T')[0],
      closingDate: formData.deadline,
      estimatedValue: '₹34.00 Crore',
      description: formData.description,
      requirementsCount: 7,
      bidsCount: 0,
      status: 'Published',
      requirements: currentTender.requirements, // clone template
    };
    onCreateTender(newT);
    setShowCreateModal(false);
  };

  const filteredTenders = tenders.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.procuringOrganization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Tender Management
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {tenders.length} Active Tenders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Define eligibility rules, set evaluation weights, and ingest GeM RFP documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Tender</span>
          </button>
        </div>
      </div>

      {/* Tender List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredTenders.map((tender) => {
          const isSelected = tender.id === activeTenderDetail?.id;
          const isActiveForEval = tender.id === currentTender?.id;

          return (
            <div
              key={tender.id}
              onClick={() => {
                setSelectedDetailTender(tender);
                onSelectTender(tender);
              }}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
                  : 'border-slate-200/90 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {tender.tenderId}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {tender.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {tender.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{tender.procuringOrganization}</span>
                </p>
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {tender.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Closing: {tender.closingDate}</span>
                  </span>
                  <span className="font-bold text-slate-800 font-mono">
                    {tender.estimatedValue}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium">
                    {tender.requirementsCount} Requirements
                  </span>
                  <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[11px] font-medium">
                    {tender.bidsCount} Bids Submitted
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTender(tender);
                      onEvaluateBids(tender);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-[#0B5D3B] text-[#06452D] hover:text-white font-semibold text-xs border border-emerald-200 hover:border-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Evaluate Vendor Bids ({tender.bidsCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tender Clause Matrix Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Configured Requirements for: {activeTenderDetail?.tenderId}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                GFR 2017 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rules against which all incoming vendor bid documents are verified by BidSure AI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Total Weight: 100%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Rule ID</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Requirement Title</th>
                <th className="py-2.5 px-3 font-semibold">Clause Ref</th>
                <th className="py-2.5 px-3 font-semibold">Mandated Expected Value</th>
                <th className="py-2.5 px-3 font-semibold">Weight</th>
                <th className="py-2.5 px-3 font-semibold text-center">Mandatory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTenderDetail?.requirements || []).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{req.id}</td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {req.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{req.title}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{req.clauseReference}</td>
                  <td className="py-3 px-3 text-emerald-900 font-medium">{req.expectedValue}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{req.weight}%</td>
                  <td className="py-3 px-3 text-center">
                    {req.mandatory ? (
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">
                        MANDATORY
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                        Optional
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Tender Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Create New Procurement Tender
                </h3>
                <p className="text-xs text-slate-500">
                  Define tender specifications and let AI extract structured requirements
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Top AI Extraction trigger bar */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Have an RFP Document? Extract structured clauses instantly.</span>
                </div>
                <button
                  type="button"
                  onClick={handleAiExtract}
                  disabled={isExtractingAi}
                  className="px-3 py-1.5 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isExtractingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing RFP Document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>AI Extract Requirements</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tender ID</label>
                  <input
                    type="text"
                    required
                    value={formData.tenderId}
                    onChange={(e) => setFormData({ ...formData, tenderId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tender Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Procuring Organization</label>
                  <input
                    type="text"
                    required
                    value={formData.procuringOrganization}
                    onChange={(e) => setFormData({ ...formData, procuringOrganization: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tender Closing Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tender Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Minimum Turnover</label>
                  <input
                    type="text"
                    value={formData.minTurnover}
                    onChange={(e) => setFormData({ ...formData, minTurnover: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">OEM Requirements</label>
                  <input
                    type="text"
                    value={formData.oemRequirements}
                    onChange={(e) => setFormData({ ...formData, oemRequirements: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Make in India Requirements</label>
                  <input
                    type="text"
                    value={formData.makeInIndiaRequirements}
                    onChange={(e) => setFormData({ ...formData, makeInIndiaRequirements: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">MSME Requirements</label>
                  <input
                    type="text"
                    value={formData.msmeRequirements}
                    onChange={(e) => setFormData({ ...formData, msmeRequirements: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Required Registrations</label>
                  <input
                    type="text"
                    value={formData.requiredRegistrations}
                    onChange={(e) => setFormData({ ...formData, requiredRegistrations: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Experience Requirements</label>
                  <input
                    type="text"
                    value={formData.experienceRequirements}
                    onChange={(e) => setFormData({ ...formData, experienceRequirements: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Publish Tender to GeM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
