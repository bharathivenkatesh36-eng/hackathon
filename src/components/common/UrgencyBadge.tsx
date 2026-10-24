import React from 'react';
import {
  AlertTriangle,
  CalendarClock,
  Clock,
  FileQuestion,
  ShieldAlert
} from 'lucide-react';
import { UrgencyLevel } from '../../types/notice';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  daysRemainingText?: string;
  showIcon?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  daysRemainingText,
  showIcon = true
}) => {
  switch (urgency) {
    case 'overdue':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-100/90 border border-rose-300 px-2.5 py-1 rounded-md tabular-nums">
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-700 shrink-0" />}
          Overdue {daysRemainingText ? `(${daysRemainingText})` : ''}
        </span>
      );
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md tabular-nums">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          Urgent {daysRemainingText ? `· ${daysRemainingText}` : ''}
        </span>
      );
    case 'upcoming':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#126A78] bg-[#EEF8F6] border border-[#B6E6D9] px-2.5 py-1 rounded-md tabular-nums">
          {showIcon && <CalendarClock className="w-3.5 h-3.5 text-[#329F9C] shrink-0" />}
          Upcoming {daysRemainingText ? `· ${daysRemainingText}` : ''}
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          Under Review
        </span>
      );
    case 'not_identified':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
          {showIcon && <FileQuestion className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          Deadline Not Identified
        </span>
      );
  }
};
