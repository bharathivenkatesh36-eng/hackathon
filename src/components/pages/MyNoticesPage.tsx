import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Calendar,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Eye,
  FileSignature,
  Download,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  FolderOpen
} from 'lucide-react';
import { Notice, NoticeCategory, NoticeStatus, UrgencyLevel } from '../../types/notice';
import { StatusBadge } from '../common/StatusBadge';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { formatDaysRemaining, NoticeService } from '../../services/noticeService';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface MyNoticesPageProps {
  notices: Notice[];
  onSelectNotice: (noticeId: string) => void;
  onNavigateUpload: () => void;
  onNavigateResponseAssistant: (noticeId: string) => void;
  onNoticeDeleted: (noticeId: string) => void;
  onNoticeStatusChanged: (noticeId: string, status: NoticeStatus) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
  initialCategoryFilter?: string;
}

export const MyNoticesPage: React.FC<MyNoticesPageProps> = ({
  notices,
  onSelectNotice,
  onNavigateUpload,
  onNavigateResponseAssistant,
  onNoticeDeleted,
  onNoticeStatusChanged,
  onShowToast,
  initialCategoryFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline_asc' | 'received_desc' | 'title_asc'>('deadline_asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  // Filter notices
  const filteredNotices = notices
    .filter((n) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'all' || n.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || n.status === statusFilter;
      const matchUrgency = urgencyFilter === 'all' || n.urgency === urgencyFilter;

      return matchSearch && matchCategory && matchStatus && matchUrgency;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        if (!a.deadlineDate) return 1;
        if (!b.deadlineDate) return -1;
        return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
      }
      if (sortBy === 'received_desc') {
        return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleDeleteConfirm = () => {
    if (noticeToDelete) {
      NoticeService.deleteNotice(noticeToDelete.id);
      onNoticeDeleted(noticeToDelete.id);
      onShowToast(`Notice "${noticeToDelete.title}" removed from vault`, 'info');
      setNoticeToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183B70] tracking-tight">
            My Notice Vault
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Secure legal intelligence repository. Review deadlines, tracked communications, and defense drafts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="p-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#183B70] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-white text-[#183B70] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card view"
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNavigateUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Notice</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, authority, or case number..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 focus:border-[#329F9C]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="Tax & Financial">Tax & Financial</option>
              <option value="Regulatory & Labor">Regulatory & Labor</option>
              <option value="Commercial Contract">Commercial Contract</option>
              <option value="Municipal & Licensing">Municipal & Licensing</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 text-slate-700"
            >
              <option value="deadline_asc">Deadline: Soonest First</option>
              <option value="received_desc">Date Received: Newest First</option>
              <option value="title_asc">Title: A to Z</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Status:</span>
            {['all', 'needs_attention', 'under_review', 'in_progress', 'response_drafted', 'resolved'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-[#126A78] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All' : st.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing {filteredNotices.length} of {notices.length} notices
          </div>
        </div>
      </div>

      {/* Main Content: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/70">
                  <th scope="col" className="py-3 px-4">Title & Reference</th>
                  <th scope="col" className="py-3 px-4">Issuing Authority</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Received</th>
                  <th scope="col" className="py-3 px-4">Deadline</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((n) => {
                    const daysInfo = formatDaysRemaining(n.deadlineDate);
                    return (
                      <tr
                        key={n.id}
                        onClick={() => onSelectNotice(n.id)}
                        className="hover:bg-[#EEF8F6]/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-semibold text-[#183B70] max-w-xs">
                          <p className="truncate group-hover:text-[#126A78] transition-colors">
                            {n.title}
                          </p>
                          <p className="text-[11px] font-normal text-slate-400 font-mono mt-0.5 truncate">
                            {n.referenceNumber}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 truncate max-w-[180px]">
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
                                  daysInfo.isPast ? 'text-rose-600 font-bold' : 'text-amber-700'
                                }`}
                              >
                                {daysInfo.text}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">None stated</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={n.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => onSelectNotice(n.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#126A78] hover:bg-[#EEF8F6] rounded-md transition-colors border border-transparent hover:border-[#B6E6D9]"
                              title="View full analysis"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => onNavigateResponseAssistant(n.id)}
                              className="p-1.5 text-slate-400 hover:text-[#126A78] hover:bg-slate-100 rounded-md transition-colors"
                              title="Draft response"
                            >
                              <FileSignature className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setNoticeToDelete(n)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete notice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium">No notices match your selected filters.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('all');
                          setStatusFilter('all');
                          setUrgencyFilter('all');
                        }}
                        className="mt-2 text-xs font-semibold text-[#126A78] hover:underline"
                      >
                        Reset all filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((n) => {
              const daysInfo = formatDaysRemaining(n.deadlineDate);
              return (
                <div
                  key={n.id}
                  onClick={() => onSelectNotice(n.id)}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-[#329F9C] bg-white/90 backdrop-blur-md transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-[#126A78] uppercase tracking-wider">
                        {n.category}
                      </span>
                      <StatusBadge status={n.status} showIcon={false} />
                    </div>

                    <h3 className="text-sm font-bold text-[#183B70] group-hover:text-[#126A78] transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 truncate">
                      {n.issuingAuthority}
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Statutory Deadline</span>
                        <span className="font-mono text-slate-400">{n.referenceNumber}</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-[#183B70] tabular-nums">
                          {n.deadlineDate || 'None identified'}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            daysInfo.isPast ? 'text-rose-600' : 'text-amber-700'
                          }`}
                        >
                          {daysInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#126A78] group-hover:underline">
                      Review Analysis →
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoticeToDelete(n);
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white/60 rounded-2xl border border-slate-200">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium">No notices match your filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={noticeToDelete !== null}
        title="Delete Notice from Vault?"
        message={`Are you sure you want to remove "${noticeToDelete?.title}"? All extracted deadlines, checklists, and saved drafts for this notice will be permanently deleted.`}
        confirmLabel="Delete Notice"
        cancelLabel="Keep Notice"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setNoticeToDelete(null)}
      />
    </div>
  );
};
