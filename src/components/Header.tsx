import React from 'react';
import { 
  ShieldCheck, 
  Bot, 
  Bell, 
  UserCheck, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Tender, VendorBid } from '../types';

interface HeaderProps {
  currentTender: Tender;
  tenders: Tender[];
  onSelectTender: (tender: Tender) => void;
  currentBid: VendorBid;
  bids: VendorBid[];
  onSelectBid: (bid: VendorBid) => void;
  onOpenCopilot: () => void;
  onResetDemo: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTender,
  tenders,
  onSelectTender,
  currentBid,
  bids,
  onSelectBid,
  onOpenCopilot,
  onResetDemo,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-emerald-900/10 shadow-xs sticky top-0 z-30">
      {/* Top micro-bar: Government of India / GeM notice */}
      <div className="bg-[#06452D] text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Government e-Marketplace (GeM) Verification Portal
          </span>
          <span className="text-emerald-300/50">|</span>
          <span className="bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono font-semibold">
            SIH 2026 | SIH26100
          </span>
        </div>
        <div className="flex items-center gap-4 text-emerald-200/90 text-[11px]">
          <span className="flex items-center gap-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded">
            DEMO MODE (Sample Data Only)
          </span>
          <span className="hidden md:inline text-emerald-300/80">
            Advisory Decision-Support Engine • Officer Discretion Mandated
          </span>
          <button 
            onClick={onResetDemo}
            title="Reset to initial demo scenario"
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* Main header row */}
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#0B5D3B] flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#06452D] tracking-tight flex items-center gap-1.5 font-serif">
                BidSure AI
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                v1.4 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              AI-Powered Bid Compliance & Verification Platform
            </p>
          </div>
        </div>

        {/* Middle: Active Context Selectors (Tender & Bid) */}
        <div className="hidden lg:flex items-center gap-3 bg-[#F4F9F5] p-1.5 rounded-lg border border-emerald-900/10">
          <div className="flex items-center gap-2 px-2">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">Tender:</span>
            <div className="relative">
              <select
                value={currentTender?.id || ''}
                onChange={(e) => {
                  const t = tenders.find((x) => x.id === e.target.value);
                  if (t) onSelectTender(t);
                }}
                className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1 pr-6 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer max-w-[210px] truncate"
              >
                {tenders.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tenderId} - {t.title.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2 px-2">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">Bidder:</span>
            <div className="relative">
              <select
                value={currentBid?.id || ''}
                onChange={(e) => {
                  const b = bids.find((x) => x.id === e.target.value);
                  if (b) onSelectBid(b);
                }}
                className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1 pr-6 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer max-w-[200px] truncate"
              >
                {bids.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.vendorName} ({b.complianceScore}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right side: AI Copilot trigger & Officer Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B5D3B] hover:bg-[#06452D] text-white text-xs font-medium shadow-sm hover:shadow transition-all cursor-pointer border border-emerald-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>BidSure Copilot</span>
            <span className="bg-emerald-800/80 text-[10px] px-1.5 py-0.2 rounded text-emerald-200 font-mono">
              AI
            </span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-900 font-bold text-xs">
              VS
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                Shri Vikram Sharma
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Senior Procurement Officer (GOV-9842)
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Sign out of GeM Portal"
              className="text-slate-400 hover:text-red-600 text-xs px-1.5 py-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
