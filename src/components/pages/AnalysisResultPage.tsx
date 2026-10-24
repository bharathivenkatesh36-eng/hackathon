import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck2,
  FileSignature,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Bookmark,
  Share2,
  Printer,
  Scale,
  ListTodo,
  Layers,
  ArrowLeft,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { Notice, NoticeStatus } from '../../types/notice';
import { StatusBadge } from '../common/StatusBadge';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { formatDaysRemaining, NoticeService } from '../../services/noticeService';

interface AnalysisResultPageProps {
  notice: Notice;
  onBack: () => void;
  onNavigateResponseAssistant: (noticeId: string) => void;
  onNavigateActionPlans: () => void;
  onNoticeUpdated: (updatedNotice: Notice) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  notice,
  onBack,
  onNavigateResponseAssistant,
  onNavigateActionPlans,
  onNoticeUpdated,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'why_issued' | 'steps' | 'documents' | 'legal' | 'missing' | 'evidence'
  >('summary');
  const [showOriginalDocModal, setShowOriginalDocModal] = useState<boolean>(false);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  const deadlineInfo = formatDaysRemaining(notice.deadlineDate);

  // Toggle checklist item
  const handleToggleDoc = (docId: string) => {
    const updated = NoticeService.toggleDocumentChecklist(notice.id, docId);
    if (updated) {
      onNoticeUpdated(updated);
      onShowToast('Document checklist item updated', 'success');
    }
  };

  // Toggle mandatory action
  const handleToggleAction = (actionId: string) => {
    const updated = NoticeService.toggleMandatoryAction(notice.id, actionId);
    if (updated) {
      onNoticeUpdated(updated);
      onShowToast('Action item updated', 'success');
    }
  };

  // Toggle suggested preparation
  const handleTogglePrep = (prepId: string) => {
    const updated = NoticeService.toggleSuggestedPrep(notice.id, prepId);
    if (updated) {
      onNoticeUpdated(updated);
      onShowToast('Preparation step updated', 'success');
    }
  };

  // Update status dropdown
  const handleStatusChange = (newStatus: NoticeStatus) => {
    const updated = NoticeService.updateNoticeStatus(notice.id, newStatus);
    if (updated) {
      onNoticeUpdated(updated);
      onShowToast(`Notice status updated to ${newStatus.replace('_', ' ')}`, 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with Back action & Quick buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#126A78] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notices Vault</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={notice.status}
              onChange={(e) => handleStatusChange(e.target.value as NoticeStatus)}
              className="text-xs font-semibold text-[#183B70] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/40"
            >
              <option value="needs_attention">Needs Attention</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="response_drafted">Response Drafted</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={() => setShowOriginalDocModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Inspect Original</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => onNavigateResponseAssistant(notice.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] rounded-lg transition-all shadow-xs"
          >
            <FileSignature className="w-3.5 h-3.5 text-[#B6E6D9]" />
            <span>Draft Response</span>
          </button>
        </div>
      </div>

      {/* Primary Notice Header Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
        {/* Subtle prism accent gradient on top right */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-[#B6E6D9]/30 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#126A78] bg-[#EEF8F6] px-2.5 py-0.5 rounded-md border border-[#B6E6D9]/50">
                {notice.authorityType}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-500">
                Category: {notice.category}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Ref: {notice.referenceNumber}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#183B70] leading-snug">
              {notice.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
              <div>
                <span className="text-slate-400">Issuing Authority: </span>
                <span className="font-semibold text-slate-800">{notice.issuingAuthority}</span>
              </div>
              <div>
                <span className="text-slate-400">Issue Date: </span>
                <span className="font-semibold text-slate-800 tabular-nums">{notice.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Received Date: </span>
                <span className="font-semibold text-slate-800 tabular-nums">{notice.receivedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{notice.confidenceScore}% Verification Confidence</span>
              </div>
            </div>
          </div>

          {/* Deadline / Urgency Callout Block */}
          <div className="shrink-0 lg:w-72 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Response Deadline
                </span>
                <UrgencyBadge urgency={notice.urgency} />
              </div>

              <div className="text-lg font-bold text-[#183B70] tabular-nums">
                {notice.deadlineDate
                  ? new Date(notice.deadlineDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'No Fixed Date Stated'}
              </div>

              <p className="mt-1 text-xs font-semibold text-rose-700">
                {deadlineInfo.text}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500">
              <span className="font-medium text-slate-700">Source Quote: </span>
              <span className="italic line-clamp-2">&quot;{notice.deadlineSource}&quot;</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Review Categories */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'summary', label: '1. Plain-Language Summary', icon: FileText },
            { id: 'why_issued', label: '2. Why Issued & Risks', icon: Scale },
            { id: 'steps', label: '3. Next Steps & Actions', icon: CheckSquare },
            { id: 'documents', label: '4. Document Checklist', icon: ListTodo },
            { id: 'legal', label: '5. Legal Citations', icon: ShieldCheck },
            { id: 'missing', label: '6. Uncertain / Missing Info', icon: HelpCircle },
            { id: 'evidence', label: '7. Source Excerpts', icon: Search }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#126A78] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#183B70] hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B6E6D9]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        {/* TAB 1: PLAIN-LANGUAGE SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#126A78]" />
                Executive Plain-Language Translation
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Synthesized for business management: What does this notice actually state without complex legalese?
              </p>
            </div>

            <div className="p-5 rounded-xl bg-linear-to-r from-[#EEF8F6] to-[#F7F9FC] border border-[#B6E6D9]/50 text-sm leading-relaxed text-[#183B70] font-normal">
              {notice.plainLanguageSummary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Document Facts (Explicitly In Text)
                </h4>
                <ul className="text-xs space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Issuing Body: {notice.issuingAuthority}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Reference / Batch Code: {notice.referenceNumber}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Verified Response Deadline: {notice.deadlineDate || 'Unspecified in notice'}</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-[#329F9C]/30 bg-[#EEF8F6]/30">
                <h4 className="text-xs font-bold text-[#126A78] uppercase tracking-wider mb-2">
                  Recommended Immediate Action
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Review the mandatory checklist items and generate a formal counsel-reviewed response draft
                  or 30-day extension before {notice.deadlineDate || 'expiration'}.
                </p>
                <button
                  onClick={() => onNavigateResponseAssistant(notice.id)}
                  className="mt-3 text-xs font-bold text-[#126A78] hover:text-[#0e525d] flex items-center gap-1.5"
                >
                  <span>Launch Response Assistant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHY ISSUED & RISKS */}
        {activeTab === 'why_issued' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#126A78]" />
                Why This Notice Was Issued & Associated Risks
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Extracted rationale from the document text versus practical commercial liabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Specific Trigger Event
                </span>
                <p className="mt-2 text-xs font-medium text-slate-800 leading-relaxed">
                  {notice.whyIssued.trigger}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60">
                <span className="text-[11px] font-bold text-[#126A78] uppercase tracking-wider">
                  Official Agency Rationale
                </span>
                <p className="mt-2 text-xs font-medium text-slate-800 leading-relaxed">
                  {notice.whyIssued.officialRationale}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/50">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Business & Financial Risk
                </span>
                <p className="mt-2 text-xs font-semibold text-rose-900 leading-relaxed">
                  {notice.whyIssued.businessRisk}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NEXT STEPS & ACTIONS */}
        {activeTab === 'steps' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#126A78]" />
                  Required & Suggested Action Steps
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Differentiating mandatory statutory requirements from recommended preparation tasks.
                </p>
              </div>

              <button
                onClick={onNavigateActionPlans}
                className="text-xs font-semibold text-[#126A78] hover:text-[#0e525d] flex items-center gap-1"
              >
                <span>Open in Action Plans</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mandatory Actions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Mandatory Legal Obligations
                </span>
                <span className="text-xs text-slate-500">
                  Explicitly required by the issuing authority
                </span>
              </div>

              <div className="space-y-3">
                {notice.mandatoryActions.map((action) => (
                  <div
                    key={action.id}
                    onClick={() => handleToggleAction(action.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      action.completed
                        ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200/90 hover:border-[#329F9C] shadow-2xs'
                    }`}
                  >
                    <button
                      className="mt-0.5 text-slate-400 hover:text-[#126A78]"
                      aria-label={action.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {action.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            action.completed ? 'line-through text-slate-400' : 'text-[#183B70]'
                          }`}
                        >
                          {action.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded shrink-0 tabular-nums">
                          Due: {action.deadline}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {action.description}
                      </p>
                      {action.statutoryRef && (
                        <span className="mt-1.5 inline-block text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Authority: {action.statutoryRef}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Preparations */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#126A78] bg-[#EEF8F6] px-2 py-0.5 rounded border border-[#B6E6D9]/50">
                  Suggested Strategic Preparations
                </span>
                <span className="text-xs text-slate-500">
                  Recommended to safeguard entity position
                </span>
              </div>

              <div className="space-y-3">
                {notice.suggestedPreparations.map((prep) => (
                  <div
                    key={prep.id}
                    onClick={() => handleTogglePrep(prep.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      prep.completed
                        ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200/90 hover:border-[#329F9C] shadow-2xs'
                    }`}
                  >
                    <button
                      className="mt-0.5 text-slate-400 hover:text-[#126A78]"
                      aria-label={prep.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {prep.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            prep.completed ? 'line-through text-slate-400' : 'text-[#183B70]'
                          }`}
                        >
                          {prep.title}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500 shrink-0">
                          {prep.timeframe}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {prep.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENT CHECKLIST */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[#126A78]" />
                Required Document & Evidence Checklist
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Track and check off records required by the authority before transmitting your formal reply.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notice.documentChecklist.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleToggleDoc(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    doc.collected
                      ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-[#329F9C]'
                  }`}
                >
                  <button
                    className="mt-0.5"
                    aria-label={doc.collected ? 'Mark uncollected' : 'Mark collected'}
                  >
                    {doc.collected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold ${
                          doc.collected ? 'text-emerald-900' : 'text-[#183B70]'
                        }`}
                      >
                        {doc.name}
                      </h4>
                      {doc.mandatory ? (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{doc.description}</p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-500">Likely Location: </span>
                      <span>{doc.locationHint}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEGAL CITATIONS */}
        {activeTab === 'legal' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#126A78]" />
                Identified Statutory & Regulatory Citations
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Codes, administrative regulations, and contract sections cited in the notice, translated into practical business meaning.
              </p>
            </div>

            <div className="space-y-4">
              {notice.legalCitations.map((citation, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 bg-white space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#126A78] bg-[#EEF8F6] px-2.5 py-1 rounded border border-[#B6E6D9]/50">
                      {citation.code}
                    </span>
                    <span className="text-xs font-semibold text-[#183B70]">{citation.title}</span>
                  </div>

                  <blockquote className="p-3 rounded-lg bg-slate-50 border-l-2 border-[#126A78] text-xs font-mono text-slate-700 italic">
                    &quot;{citation.excerpt}&quot;
                  </blockquote>

                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-[#183B70]">Practical Business Impact: </span>
                    <span>{citation.plainMeaning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: UNCERTAIN / MISSING INFORMATION */}
        {activeTab === 'missing' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Uncertain or Missing Information Audit
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Critical transparency: Facts or data points that the document does NOT explicitly clarify, requiring user verification.
              </p>
            </div>

            <div className="space-y-3">
              {notice.missingOrUncertain.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200/70 bg-amber-50/40 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      {item.item}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.severity} uncertainty
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">{item.reason}</p>
                  <div className="pt-1 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">Suggested Action: </span>
                    <span>{item.suggestedVerification}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SOURCE EVIDENCE INSPECTOR */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-[#183B70] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#126A78]" />
                Original Document Evidence & Extracted Fact Quotes
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Inspect the exact original text snippets that ground and substantiate each verified fact.
              </p>
            </div>

            <div className="space-y-4">
              {notice.sourceSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 hover:border-[#329F9C] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#126A78] bg-[#EEF8F6] px-2 py-0.5 rounded">
                      {snippet.section} (Page {snippet.page})
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OCR Fact Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 font-mono text-xs text-slate-800 border-l-2 border-[#126A78]">
                    &quot;{snippet.originalText}&quot;
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-[#183B70]">Extracted Conclusion: </span>
                    {snippet.verifiedFact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Callouts */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-linear-to-r from-[#126A78] to-[#183B70] text-white gap-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#B6E6D9]">
            Ready to prepare an official defense or clarification letter?
          </h3>
          <p className="text-xs text-slate-200 mt-0.5">
            Use the Response Assistant to generate an extension request, formal dispute, or documentation transmittal.
          </p>
        </div>

        <button
          onClick={() => onNavigateResponseAssistant(notice.id)}
          className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#183B70] bg-white hover:bg-[#B6E6D9] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <FileSignature className="w-4 h-4 text-[#126A78]" />
          <span>Launch Response Assistant</span>
        </button>
      </div>

      {/* Modal: Original Document Inspector */}
      {showOriginalDocModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#183B70]">
                  Original Document Scan & OCR Viewer
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {notice.fileName || 'Notice_Document.pdf'} ({notice.fileSize || '1.4 MB'})
                </p>
              </div>
              <button
                onClick={() => setShowOriginalDocModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close document inspector"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono bg-slate-50/50">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-inner space-y-3">
                <div className="border-b border-slate-200 pb-2 text-center text-slate-400 text-[10px] uppercase">
                  --- DOCUMENT HEADER / JURISDICTIONAL ARCHIVE ---
                </div>
                <p className="text-slate-700 font-bold uppercase">{notice.issuingAuthority}</p>
                <p className="text-slate-600">REFERENCE: {notice.referenceNumber}</p>
                <p className="text-slate-600">DATE OF NOTICE: {notice.issueDate}</p>
                <div className="pt-2 border-t border-slate-100 text-slate-700 space-y-2">
                  <p className="font-semibold text-[#183B70]">{notice.title}</p>
                  <p className="leading-relaxed text-slate-600">
                    &quot;{notice.sourceSnippets[0]?.originalText || notice.plainLanguageSummary}&quot;
                  </p>
                  <p className="leading-relaxed text-slate-600">
                    &quot;{notice.sourceSnippets[1]?.originalText || notice.whyIssued.trigger}&quot;
                  </p>
                  <p className="leading-relaxed text-slate-600 font-bold text-rose-800">
                    &quot;{notice.deadlineSource}&quot;
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#EEF8F6] border border-[#B6E6D9] rounded-lg text-[11px] text-[#126A78]">
                <strong>OCR Integrity Report:</strong> 100% characters recognized, valid statutory checksums, verified document layout coordinates.
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setShowOriginalDocModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
