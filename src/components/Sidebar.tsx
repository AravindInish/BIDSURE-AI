import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  FileCheck,
  CheckCircle2,
  ShieldAlert,
  FileText,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  AlertTriangle,
  Flame
} from 'lucide-react';

export type NavItemKey = 
  | 'dashboard'
  | 'tenders'
  | 'vendor-bids'
  | 'document-verification'
  | 'compliance-analysis'
  | 'risk-analysis'
  | 'reports'
  | 'audit-trail'
  | 'settings'
  | 'final-decision';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  flaggedDocsCount: number;
  reviewReqsCount: number;
  onSelectDemoScenario: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  flaggedDocsCount,
  reviewReqsCount,
  onSelectDemoScenario,
}) => {
  const menuItems = [
    { id: 'dashboard' as NavItemKey, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tenders' as NavItemKey, label: 'Tenders', icon: FileSpreadsheet, badge: '3' },
    { id: 'vendor-bids' as NavItemKey, label: 'Vendor Bids', icon: Users, badge: '5' },
    { 
      id: 'document-verification' as NavItemKey, 
      label: 'Document Verification', 
      icon: FileCheck, 
      badge: flaggedDocsCount > 0 ? `${flaggedDocsCount} Flagged` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    { 
      id: 'compliance-analysis' as NavItemKey, 
      label: 'Compliance Analysis', 
      icon: CheckCircle2, 
      badge: reviewReqsCount > 0 ? `${reviewReqsCount} Review` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    { 
      id: 'risk-analysis' as NavItemKey, 
      label: 'Risk Analysis', 
      icon: ShieldAlert, 
      badge: 'Med',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    { id: 'final-decision' as NavItemKey, label: 'Officer Decision', icon: Award, highlight: true },
    { id: 'reports' as NavItemKey, label: 'Reports', icon: FileText },
    { id: 'audit-trail' as NavItemKey, label: 'Audit Trail', icon: History },
    { id: 'settings' as NavItemKey, label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-[#06452D] text-slate-100 transition-all duration-300 flex flex-col border-r border-emerald-950/40 relative z-20 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="p-4 border-b border-emerald-800/40 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-200 tracking-wider uppercase">
              Procurement Menu
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-white text-[#06452D] shadow-sm font-semibold'
                  : item.highlight
                  ? 'text-amber-300 hover:bg-emerald-900/80 hover:text-white bg-amber-400/10 border border-amber-400/20'
                  : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B5D3B]' : item.highlight ? 'text-amber-300' : 'text-emerald-300'}`} />
              
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span 
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-semibold ${
                        item.badgeColor || 'bg-emerald-900 text-emerald-200 border-emerald-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Card: Quick Preload Demo Scenario */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preloaded Demo Scenario</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-relaxed mb-2.5">
            CPCL Refinery Pumps tender with ABC Engineering bid (Turnover Compliant ₹14.2 Cr, OEM duration review flag).
          </p>
          <button
            onClick={onSelectDemoScenario}
            className="w-full py-1.5 px-2.5 rounded-lg bg-[#0B5D3B] hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-600/50"
          >
            <span>Load Demo Workflow</span>
          </button>
        </div>
      ) : (
        <div className="p-2 text-center">
          <button
            onClick={onSelectDemoScenario}
            title="Load CPCL Demo Scenario"
            className="w-10 h-10 rounded-lg bg-[#0B5D3B] hover:bg-emerald-700 text-amber-300 flex items-center justify-center mx-auto transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Compliance Disclaimer Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-emerald-900/50 text-[10px] text-emerald-300/60">
          <p className="leading-tight">
            Procurement verification governed under General Financial Rules (GFR) 2017.
          </p>
        </div>
      )}
    </aside>
  );
};
