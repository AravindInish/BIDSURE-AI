import React, { useState } from 'react';
import {
  History,
  Download,
  Filter,
  Search,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Calendar,
  UserCheck,
  FileCheck
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditTrailViewProps {
  logs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs
    .filter((l) => {
      if (filterAction === 'ALL') return true;
      return l.action.toLowerCase().includes(filterAction.toLowerCase());
    })
    .filter(
      (l) =>
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.object.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Timestamp,User,Action,Object,Result,SHA256Hash']
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.object}","${l.result}","${l.sha256Hash}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BidSure_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Statutory Procurement Audit Trail
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cryptographically Immutabilized</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of all OCR extractions, rule executions, officer reviews, and override determinations.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Filter:
          </span>
          {['ALL', 'AI', 'Officer', 'Rule', 'Document'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterAction(f)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                filterAction === f
                  ? 'bg-[#0B5D3B] text-white border-emerald-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 w-56"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor / User</th>
                <th className="py-3 px-4 font-semibold">Action Executed</th>
                <th className="py-3 px-4 font-semibold">Subject / Object</th>
                <th className="py-3 px-4 font-semibold">Result / Determination</th>
                <th className="py-3 px-4 font-semibold text-right font-mono">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timeFormatted}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                      {log.user}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-950">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {log.object}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {log.result}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-400 select-all">
                    {log.sha256Hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
