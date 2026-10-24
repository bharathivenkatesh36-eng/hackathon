import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Upload,
  User,
  ShieldAlert,
  Calendar,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Notice } from '../../types/notice';
import { formatDaysRemaining } from '../../services/noticeService';

interface AppHeaderProps {
  onOpenMobileSidebar: () => void;
  onNavigateUpload: () => void;
  onSelectNotice: (noticeId: string) => void;
  notices: Notice[];
  breadcrumbs: { label: string; onClick?: () => void }[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  businessName: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMobileSidebar,
  onNavigateUpload,
  onSelectNotice,
  notices,
  breadcrumbs,
  searchQuery,
  onSearchChange,
  businessName
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Urgent notices for notification center
  const urgentNotices = notices.filter(
    (n) => n.urgency === 'urgent' || n.urgency === 'overdue'
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  // Filtered search results for quick preview
  const searchResults = searchQuery.trim()
    ? notices.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-20 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="hover:text-[#126A78] font-medium transition-colors cursor-pointer truncate max-w-[160px] md:max-w-none text-left"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-[#183B70] font-semibold truncate max-w-[200px] md:max-w-none">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search notices by keyword, agency, or reference #..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 focus:border-[#329F9C] transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Search Dropdown */}
        {isSearchFocused && searchQuery.trim() && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30"
          >
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Matching Notices ({searchResults.length})</span>
              <span>Press Esc to close</span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onSelectNotice(n.id);
                      setIsSearchFocused(false);
                      onSearchChange('');
                    }}
                    className="w-full p-2.5 text-left hover:bg-[#EEF8F6]/60 transition-colors flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#183B70] truncate">{n.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{n.issuingAuthority}</span>
                        <span>·</span>
                        <span>{n.referenceNumber}</span>
                      </div>
                    </div>
                    {n.deadlineDate && (
                      <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded shrink-0">
                        {formatDaysRemaining(n.deadlineDate).text}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching notices found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Actions: Analyze Notice Button + Notification Center + User */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onNavigateUpload}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] rounded-lg shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#329F9C]/50"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Analyze Notice</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-[#183B70] hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {urgentNotices.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#183B70]">Urgent Notice Alerts</span>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {urgentNotices.length} active
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentNotices.length > 0 ? (
                  urgentNotices.map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => {
                        onSelectNotice(notice.id);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-[#EEF8F6]/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#183B70] leading-snug truncate">
                            {notice.title}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="truncate">{notice.issuingAuthority}</span>
                            <span className="font-semibold text-rose-600 shrink-0">
                              {formatDaysRemaining(notice.deadlineDate).text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    All notice deadlines currently on track.
                  </div>
                )}
              </div>
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-500">
                  Deadlines calculated from verified notice text
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User / Entity Quick Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
          >
            <div className="w-7 h-7 rounded-full bg-[#183B70] text-[#B6E6D9] font-bold text-xs flex items-center justify-center">
              AP
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#183B70] truncate">{businessName}</p>
                <p className="text-[11px] text-slate-500">Verified Business Account</p>
              </div>
              <div className="py-1 text-xs">
                <div className="px-3.5 py-1.5 text-slate-600 flex items-center justify-between">
                  <span>Data Vault</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="px-3.5 py-1.5 text-slate-600 flex items-center justify-between">
                  <span>Verification Rules</span>
                  <span className="text-[10px] text-slate-500">v2.4 (Strict)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
