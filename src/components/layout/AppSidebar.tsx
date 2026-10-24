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
    <div className="flex flex-col h-full bg-white/95 dark:bg-[#142332]/95 backdrop-blur-xl border-r border-[#DCE9E5] dark:border-[#294251] shadow-xs select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#DCE9E5]/60 dark:border-[#294251]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo icon with prism gradient */}
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#238C88] to-[#172C35] dark:from-[#238C88] dark:to-[#65D5C5] flex items-center justify-center text-white dark:text-[#0D1722] shrink-0 shadow-xs border border-[#329F9C]/30 dark:border-[#65D5C5]/40">
            <ShieldCheck className="w-5 h-5 text-[#B6E6D9] dark:text-[#0D1722]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-[#172C35] dark:text-[#ECF5F5] tracking-tight truncate leading-tight">
                Notice on the Desk
              </h1>
              <p className="text-[11px] font-semibold text-[#238C88] dark:text-[#65D5C5] truncate">
                Legal Notice Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-[#5F7279] dark:text-[#A6BBC3] hover:text-[#172C35] dark:hover:text-white rounded-lg"
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-[#EAF5F0] dark:bg-[#1B3040] text-[#238C88] dark:text-[#65D5C5] shadow-2xs border border-[#DCE9E5] dark:border-[#294251]'
                  : 'text-[#5F7279] dark:text-[#A6BBC3] hover:text-[#172C35] dark:hover:text-[#ECF5F5] hover:bg-[#EAF5F0]/60 dark:hover:bg-[#1B3040]/60'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#238C88] dark:text-[#65D5C5]'
                    : 'text-[#5F7279] dark:text-[#A6BBC3] group-hover:text-[#172C35] dark:group-hover:text-[#ECF5F5]'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeDanger
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      : 'bg-[#B6E6D9]/70 dark:bg-[#65D5C5]/20 text-[#126A78] dark:text-[#65D5C5]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Indicator bar for active state */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#238C88] dark:bg-[#65D5C5] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Business Entity Badge at bottom */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-[#EAF5F0]/60 dark:bg-[#1B3040]/60 border border-[#DCE9E5] dark:border-[#294251]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-[#5F7279] dark:text-[#A6BBC3] uppercase tracking-wider">
              Entity Monitored
            </span>
          </div>
          <p className="mt-1 text-xs font-bold text-[#172C35] dark:text-[#ECF5F5] truncate">
            {businessName}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#5F7279] dark:text-[#A6BBC3]">
            <span>Client Vault Encrypted</span>
            <span className="text-[#238C88] dark:text-[#65D5C5] font-semibold">CA · Fed</span>
          </div>
        </div>
      )}

      {/* Collapse Desktop Toggle */}
      <div className="hidden md:flex p-3 border-t border-[#DCE9E5]/60 dark:border-[#294251] justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-[#5F7279] dark:text-[#A6BBC3] hover:text-[#238C88] dark:hover:text-[#65D5C5] hover:bg-[#EAF5F0] dark:hover:bg-[#1B3040] rounded-lg transition-colors cursor-pointer"
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
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs md:hidden"
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
