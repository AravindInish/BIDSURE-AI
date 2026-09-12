import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Building,
  BarChart3
} from 'lucide-react';
import { VendorBid, Tender } from '../types';

interface VendorBidsViewProps {
  currentTender: Tender;
  bids: VendorBid[];
  currentBid: VendorBid;
  onSelectBid: (bid: VendorBid) => void;
  onInspectCompliance: (bid: VendorBid) => void;
}

export const VendorBidsView: React.FC<VendorBidsViewProps> = ({
  currentTender,
  bids,
  currentBid,
  onSelectBid,
  onInspectCompliance,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'compliance' | 'risk' | 'name'>('compliance');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBids = bids
    .filter((b) => {
      if (filterStatus === 'COMPLIANT') return b.complianceScore >= 80;
      if (filterStatus === 'REVIEW') return b.riskLevel === 'MEDIUM';
      if (filterStatus === 'HIGH_RISK') return b.riskLevel === 'HIGH' || b.riskLevel === 'CRITICAL';
      return true;
    })
    .filter((b) => b.vendorName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'compliance') return b.complianceScore - a.complianceScore;
      if (sortBy === 'risk') return a.riskScore - b.riskScore;
      return a.vendorName.localeCompare(b.vendorName);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Vendor Bid Comparison Matrix
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {bids.length} Competing Bidders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparative analysis of submissions for Tender: <strong>{currentTender?.tenderId || 'N/A'}</strong>
          </p>
        </div>

        {/* Filter and Sort controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 w-40"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${filterStatus === 'ALL' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('COMPLIANT')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${filterStatus === 'COMPLIANT' ? 'bg-white shadow-2xs text-emerald-900 font-bold' : 'text-slate-600'}`}
            >
              Compliant
            </button>
            <button
              onClick={() => setFilterStatus('REVIEW')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${filterStatus === 'REVIEW' ? 'bg-white shadow-2xs text-amber-900 font-bold' : 'text-slate-600'}`}
            >
              Review
            </button>
            <button
              onClick={() => setFilterStatus('HIGH_RISK')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${filterStatus === 'HIGH_RISK' ? 'bg-white shadow-2xs text-red-900 font-bold' : 'text-slate-600'}`}
            >
              High Risk
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 cursor-pointer font-medium text-slate-700"
          >
            <option value="compliance">Sort: Compliance Score (High to Low)</option>
            <option value="risk">Sort: Risk Index (Low to High)</option>
            <option value="name">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-4 font-semibold">Vendor (Bidder)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Compliance %</th>
                <th className="py-3.5 px-4 font-semibold text-center">Risk Index</th>
                <th className="py-3.5 px-4 font-semibold text-center">Missing Docs</th>
                <th className="py-3.5 px-4 font-semibold">Eligibility Pillar</th>
                <th className="py-3.5 px-4 font-semibold">Technical Pillar</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBids.map((b) => {
                const isSelected = b.id === currentBid?.id;
                const isCompliant = b.complianceScore >= 80;
                const isMedium = b.riskLevel === 'MEDIUM';
                const missingCount = b.missingDocumentsCount ?? b.missingDocsCount ?? 0;

                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelectBid(b)}
                    className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{b.vendorName}</span>
                        {isSelected && (
                          <span className="bg-emerald-100 text-[#06452D] text-[10px] px-1.5 py-0.2 rounded font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        GSTIN: {b.gstin} • State: {b.state}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="inline-block">
                        <span className="text-sm font-bold font-mono text-slate-900">
                          {b.complianceScore}%
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              b.complianceScore >= 80 ? 'bg-emerald-600' : b.complianceScore >= 65 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${b.complianceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          b.riskLevel === 'LOW'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isMedium
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-red-50 text-red-900 border-red-300'
                        }`}
                      >
                        {b.riskLevel} ({b.riskScore})
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-mono">
                      {missingCount > 0 ? (
                        <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded">
                          {missingCount} Missing
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          0
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified (₹14.2 Cr)</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {b.complianceScore < 70 ? (
                        <span className="text-red-700 font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>Deficient Specs</span>
                        </span>
                      ) : isMedium ? (
                        <span className="text-amber-800 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>12-mo OEM short</span>
                        </span>
                      ) : (
                        <span className="text-emerald-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Full 24-mo OEM</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-700 font-semibold">{b.status}</span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBid(b);
                          onInspectCompliance(b);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#0B5D3B] text-[#06452D] hover:text-white font-semibold text-xs border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Audit Bid</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
