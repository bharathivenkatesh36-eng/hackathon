import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  Upload,
  ShieldAlert,
  ChevronRight,
  Filter,
  CheckCircle2,
  Building2,
  Info
} from 'lucide-react';
import { Notice, NoticeCategory } from '../../types/notice';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { formatDaysRemaining } from '../../services/noticeService';

interface OverviewPageProps {
  notices: Notice[];
  onSelectNotice: (noticeId: string) => void;
  onNavigateUpload: () => void;
  onNavigateNotices: (filterCategory?: string) => void;
  onNavigateActions: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  notices,
  onSelectNotice,
  onNavigateUpload,
  onNavigateNotices,
  onNavigateActions
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');

  // Metrics
  const totalNotices = notices.length;
  const needsAttention = notices.filter((n) => n.status === 'needs_attention').length;
  const upcomingDeadlines = notices.filter(
    (n) => (n.urgency === 'urgent' || n.urgency === 'upcoming') && n.deadlineDate
  ).length;
  const awaitingReview = notices.filter((n) => n.status === 'under_review').length;

  // Time-sensitive notices sorted by deadline
  const timeSensitiveNotices = notices
    .filter((n) => n.deadlineDate !== null)
    .sort((a, b) => {
      const dateA = new Date(a.deadlineDate!).getTime();
      const dateB = new Date(b.deadlineDate!).getTime();
      return dateA - dateB;
    })
    .slice(0, 3);

  // Filtered recent notices table
  const filteredNotices = notices.filter((n) => {
    const matchesCategory =
      selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      tableSearch.trim() === '' ||
      n.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      n.issuingAuthority.toLowerCase().includes(tableSearch.toLowerCase()) ||
      n.referenceNumber.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner with Premium Prism Accents */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xs">
        {/* Soft prism atmospheric gradient in corner */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-linear-to-br from-[#DDF3D2]/40 via-[#B6E6D9]/30 to-[#C8B0F0]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF8F6] border border-[#B6E6D9]/60 text-xs font-semibold text-[#126A78] mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Small Business Legal Defense & Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183B70] tracking-tight leading-tight">
              Know what your notice means. Know what to do next.
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Upload state, federal, or commercial legal notices to extract verified statutory
              deadlines, translate legalese into plain English, organize document checklists,
              and draft counsel-ready responses.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onNavigateUpload}
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#329F9C]/50"
            >
              <Upload className="w-4 h-4 text-[#B6E6D9]" />
              <span>Analyze a Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Notices"
          value={totalNotices}
          subtext="Saved and cataloged in vault"
          icon={FileText}
          onClick={() => onNavigateNotices()}
        />
        <MetricCard
          label="Needs Attention"
          value={needsAttention}
          subtext="Require response or abatement"
          icon={AlertTriangle}
          badgeText={needsAttention > 0 ? 'Action Needed' : undefined}
          badgeVariant="critical"
          accentBorder={needsAttention > 0}
          onClick={() => onNavigateNotices()}
        />
        <MetricCard
          label="Upcoming Deadlines"
          value={upcomingDeadlines}
          subtext="Verified dates within 45 days"
          icon={Calendar}
          badgeText="Time Sensitive"
          badgeVariant="warning"
          onClick={() => onNavigateNotices()}
        />
        <MetricCard
          label="Awaiting Review"
          value={awaitingReview}
          subtext="Under CPA or counsel review"
          icon={Clock}
          badgeText="Pending"
          badgeVariant="info"
          onClick={() => onNavigateNotices()}
        />
      </div>

      {/* Upcoming Deadlines Focus Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#183B70]">
                Time-Sensitive Deadlines
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Critical Priority
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Statutory and contractual dates extracted with original source quotes. Never missed.
            </p>
          </div>

          <button
            onClick={onNavigateActions}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#126A78] hover:text-[#0e525d] transition-colors"
          >
            <span>View All Action Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeSensitiveNotices.map((notice) => {
            const timeInfo = formatDaysRemaining(notice.deadlineDate);
            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice.id)}
                className="group relative p-4 rounded-xl border border-slate-200/80 hover:border-[#329F9C] bg-white transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-slate-500 truncate">
                      {notice.issuingAuthority}
                    </span>
                    <UrgencyBadge urgency={notice.urgency} daysRemainingText={timeInfo.text} />
                  </div>

                  <h3 className="text-sm font-semibold text-[#183B70] group-hover:text-[#126A78] transition-colors line-clamp-2">
                    {notice.title}
                  </h3>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <p className="text-[11px] font-semibold text-slate-700 mb-0.5">
                      Statutory Due Date:
                    </p>
                    <p className="font-bold text-[#183B70] tabular-nums">
                      {notice.deadlineDate
                        ? new Date(notice.deadlineDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Unspecified'}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 italic">
                      &quot;{notice.deadlineSource}&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-[#126A78]">
                  <span>Review Evidence & Steps</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Notices Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-[#183B70]">Recent Notices</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Parsed legal communications, authority classifications, and current response status.
            </p>
          </div>

          {/* Table Filters & Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs">
              {['all', 'Tax & Financial', 'Regulatory & Labor', 'Commercial Contract'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-[#183B70] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateNotices()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#126A78] transition-colors"
            >
              Full Vault
            </button>
          </div>
        </div>

        {/* Table markup with accessibility and clean typography */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/60">
                <th scope="col" className="py-3 px-4">Notice Title & Reference</th>
                <th scope="col" className="py-3 px-4">Issuing Authority</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4">Date Received</th>
                <th scope="col" className="py-3 px-4">Verified Deadline</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((n) => {
                  const deadlineInfo = formatDaysRemaining(n.deadlineDate);
                  return (
                    <tr
                      key={n.id}
                      className="hover:bg-[#EEF8F6]/30 transition-colors cursor-pointer group"
                      onClick={() => onSelectNotice(n.id)}
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#183B70] max-w-xs">
                        <p className="truncate group-hover:text-[#126A78] transition-colors">
                          {n.title}
                        </p>
                        <p className="text-[11px] font-normal text-slate-500 truncate mt-0.5 font-mono">
                          {n.referenceNumber}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 truncate max-w-[200px]">
                        {n.issuingAuthority}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {n.category}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-600">
                        {n.receivedDate}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums">
                        {n.deadlineDate ? (
                          <div>
                            <span className="font-semibold text-slate-800">
                              {n.deadlineDate}
                            </span>
                            <span
                              className={`block text-[10px] font-medium ${
                                deadlineInfo.isPast
                                  ? 'text-rose-600 font-bold'
                                  : 'text-amber-700'
                              }`}
                            >
                              {deadlineInfo.text}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={n.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNotice(n.id);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#126A78] hover:text-white hover:bg-[#126A78] rounded-md border border-[#329F9C]/40 transition-all shadow-2xs"
                        >
                          View Analysis
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    No notices match the selected category filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
