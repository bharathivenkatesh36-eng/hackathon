import React from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { NoticeStatus } from '../../types/notice';

interface StatusBadgeProps {
  status: NoticeStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  switch (status) {
    case 'needs_attention':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50/90 border border-rose-200/80 px-2.5 py-1 rounded-md">
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          Needs Attention
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-md">
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          Under Review
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#126A78] bg-[#B6E6D9]/30 border border-[#329F9C]/30 px-2.5 py-1 rounded-md">
          {showIcon && <Clock className="w-3.5 h-3.5 text-[#329F9C] shrink-0" />}
          In Progress
        </span>
      );
    case 'response_drafted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50/90 border border-purple-200/80 px-2.5 py-1 rounded-md">
          {showIcon && <FileCheck2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
          Response Drafted
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1 rounded-md">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          Unknown
        </span>
      );
  }
};
