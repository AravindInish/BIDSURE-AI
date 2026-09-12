import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  ChevronRight,
  Building2,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { Tender, VendorBid, AuditLog } from '../types';
import { NavItemKey } from '../components/Sidebar';

interface DashboardViewProps {
  tenders: Tender[];
  bids: VendorBid[];
  auditLogs: AuditLog[];
  onNavigate: (tab: NavItemKey) => void;
  onSelectBid: (bid: VendorBid) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tenders,
  bids,
  auditLogs,
  onNavigate,
  onSelectBid,
}) => {
  // Stats from prompt:
  // Active Tenders: 24, Bids Under Review: 47, Fully Compliant: 29, Attention Required: 13, High Risk: 5
  const stats = [
    {
      label: 'Active Tenders',
      value: 24,
      subtext: '3 closing within 48 hrs',
      icon: FileText,
      color: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Bids Under Review',
      value: 47,
      subtext: 'Across 12 departments',
      icon: Clock,
      color: 'text-blue-800',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Fully Compliant Bids',
      value: 29,
      subtext: 'Ready for financial open',
      icon: CheckCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-300',
    },
    {
      label: 'Bids Requiring Attention',
      value: 13,
      subtext: 'Minor clause shortfall',
      icon: AlertTriangle,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'High Risk Bids',
      value: 5,
      subtext: 'Critical mismatch / debarment',
      icon: ShieldAlert,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#06452D] via-[#0B5D3B] to-[#043321] rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs mb-3 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SIH26100 • GeM Automated Procurement Verification</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-serif tracking-tight">
              Good morning, Procurement Officer
            </h2>
            <p className="text-emerald-100/85 text-xs lg:text-sm mt-1.5 leading-relaxed">
              AI-assisted bid verification, compliance analysis and risk intelligence. Review extracted evidence, audit clause matching, and certify qualification decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('document-verification')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#06452D] hover:bg-emerald-50 font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#0B5D3B]" />
              <span>Analyze New Bid</span>
            </button>
            <button
              onClick={() => onNavigate('tenders')}
              className="px-4 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-600/40 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Active Tenders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtle Decorative Geometric Backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Building2 className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl p-4 border ${s.border} shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 truncate">{s.label}</span>
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">{s.value}</div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">{s.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Donut Chart & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Overview (Donut Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Compliance Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Distribution of 47 evaluated vendor bids
                </p>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Current Cycle
              </span>
            </div>

            {/* Custom SVG Donut Chart */}
            <div className="py-4 flex flex-col items-center justify-center relative">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle cx="50" cy="50" r="38" stroke="#F1F5F9" strokeWidth="14" fill="transparent" />
                {/* Compliant Segment (61.7% = 29/47) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#0B5D3B"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray="238.7"
                  strokeDashoffset="91.4"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Partially Compliant Segment (27.6% = 13/47) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#D97706"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray="238.7"
                  strokeDashoffset="172.8"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Non-Compliant Segment (10.6% = 5/47) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#DC2626"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray="238.7"
                  strokeDashoffset="213.4"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-slate-900 font-mono">47</span>
                <span className="text-[11px] text-slate-500 font-medium">Evaluated Bids</span>
              </div>
            </div>

            {/* Legend & Percentages */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
              <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0B5D3B]">
                  <span className="w-2 h-2 rounded-full bg-[#0B5D3B]"></span>
                  <span>Compliant</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-1 font-mono">29</div>
                <div className="text-[10px] text-emerald-800 font-medium">61.7% of total</div>
              </div>

              <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Review</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-1 font-mono">13</div>
                <div className="text-[10px] text-amber-800 font-medium">27.6% of total</div>
              </div>

              <div className="bg-red-50/60 p-2.5 rounded-xl border border-red-100">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-800">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Failed</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-1 font-mono">5</div>
                <div className="text-[10px] text-red-800 font-medium">10.6% of total</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average Verification Turnaround: <strong>4.2 mins / bid</strong></span>
            <button
              onClick={() => onNavigate('compliance-analysis')}
              className="text-[#0B5D3B] hover:text-[#06452D] font-semibold flex items-center gap-1 cursor-pointer"
            >
              Deep Analysis
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Verification Activity (Timeline) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Verification Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time pipeline event stream and audit events
                </p>
              </div>
              <button
                onClick={() => onNavigate('audit-trail')}
                className="text-xs text-[#0B5D3B] hover:text-[#06452D] font-semibold flex items-center gap-1 cursor-pointer"
              >
                Full Audit Trail
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-hidden">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                    {log.timeFormatted.split(' ')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {log.timeFormatted}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      {log.object}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        {log.user}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono truncate">
                        {log.result}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-emerald-800 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All events cryptographically signed (SHA-256)
            </span>
            <span className="text-slate-400">Synced with GeM NIC Node #4</span>
          </div>
        </div>
      </div>

      {/* Recent Bid Analysis Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Recent Bid Analysis
              </h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified submissions under evaluation for CPCL Industrial Equipment Tender
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('vendor-bids')}
              className="text-xs text-[#0B5D3B] hover:text-[#06452D] font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              Compare All Bidders
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Vendor (Bidder)</th>
                <th className="py-3 px-4 font-semibold">Tender ID</th>
                <th className="py-3 px-4 font-semibold">Compliance</th>
                <th className="py-3 px-4 font-semibold">Risk Level</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bids.map((bid) => {
                const isCompliant = bid.complianceScore >= 85;
                const isMedium = bid.riskLevel === 'MEDIUM';
                const isHigh = bid.riskLevel === 'HIGH' || bid.riskLevel === 'CRITICAL';
                
                return (
                  <tr 
                    key={bid.id} 
                    className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectBid(bid);
                      onNavigate('compliance-analysis');
                    }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{bid.vendorName}</span>
                        {bid.vendorId === 'VEN-01' && (
                          <span className="bg-emerald-100 text-[#06452D] text-[10px] px-1.5 py-0.2 rounded font-semibold">
                            ACTIVE DEMO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        GSTIN: {bid.gstin} • State: {bid.state}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {bid.tenderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bid.complianceScore >= 85
                                ? 'bg-emerald-600'
                                : bid.complianceScore >= 70
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${bid.complianceScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 font-mono">
                          {bid.complianceScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {bid.passedCount} Pass / {bid.reviewCount} Rev / {bid.failedCount} Fail
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          bid.riskLevel === 'LOW'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isMedium
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-red-50 text-red-900 border-red-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          bid.riskLevel === 'LOW' ? 'bg-emerald-600' : isMedium ? 'bg-amber-600' : 'bg-red-600'
                        }`} />
                        {bid.riskLevel} ({bid.riskScore}/100)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">
                        {bid.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBid(bid);
                          onNavigate('compliance-analysis');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#0B5D3B] text-[#06452D] hover:text-white font-semibold text-xs border border-emerald-200 hover:border-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Verify Bid</span>
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
