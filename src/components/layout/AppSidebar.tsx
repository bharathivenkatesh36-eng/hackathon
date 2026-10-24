import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  CheckSquare,
  FileSignature,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export type NavTab = 'overview' | 'analyze' | 'notices' | 'actions' | 'responses' | 'settings';

interface AppSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  needsAttentionCount: number;
  pendingActionsCount: number;
  businessName: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  needsAttentionCount,
  pendingActionsCount,
  businessName
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'analyze' as NavTab,
      label: 'Analyze Notice',
      icon: FileSearch,
      badge: 'New'
    },
    {
      id: 'notices' as NavTab,
      label: 'My Notices',
      icon: FileText,
      badge: needsAttentionCount > 0 ? `${needsAttentionCount}` : null,
      badgeDanger: true
    },
    {
      id: 'actions' as NavTab,
      label: 'Action Plans',
      icon: CheckSquare,
      badge: pendingActionsCount > 0 ? `${pendingActionsCount}` : null
    },
    {
      id: 'responses' as NavTab,
      label: 'Response Assistant',
      icon: FileSignature,
      badge: null
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-slate-200/80 shadow-xs select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo icon with prism gradient */}
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#126A78] to-[#183B70] flex items-center justify-center text-white shrink-0 shadow-xs border border-[#329F9C]/30">
            <ShieldCheck className="w-5 h-5 text-[#B6E6D9]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-[#183B70] tracking-tight truncate leading-tight">
                Notice on the Desk
              </h1>
              <p className="text-[11px] font-medium text-[#329F9C] truncate">
                Legal Notice Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-linear-to-r from-[#EEF8F6] to-[#F0F7FF] text-[#126A78] font-semibold shadow-2xs border border-[#B6E6D9]/50'
                  : 'text-slate-600 hover:text-[#183B70] hover:bg-slate-50'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#126A78]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    item.badgeDanger
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-[#B6E6D9]/60 text-[#126A78]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Indicator bar for active state */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#126A78] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Business Entity Badge at bottom */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-lg bg-[#F7F9FC] border border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Entity Monitored
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-[#183B70] truncate">
            {businessName}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
            <span>Client Vault Encrypted</span>
            <span className="text-[#329F9C] font-medium">CA · Fed</span>
          </div>
        </div>
      )}

      {/* Collapse Desktop Toggle */}
      <div className="hidden md:flex p-3 border-t border-slate-100 justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-[#126A78] hover:bg-slate-100 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 h-screen sticky top-0 z-30 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
