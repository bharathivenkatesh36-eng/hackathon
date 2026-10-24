import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  subtext: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'critical' | 'warning' | 'info' | 'success';
  onClick?: () => void;
  accentBorder?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeVariant = 'info',
  onClick,
  accentBorder = false
}) => {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'warning':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'success':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'info':
      default:
        return 'text-[#126A78] bg-[#EEF8F6] border-[#B6E6D9]';
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative p-5 rounded-xl transition-all duration-200 text-left bg-white/90 backdrop-blur-md border ${
        accentBorder ? 'border-[#329F9C]/50 shadow-sm' : 'border-slate-200/80 shadow-xs'
      } ${
        onClick
          ? 'cursor-pointer hover:border-[#329F9C] hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/50'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
        <div className="p-2 rounded-lg bg-[#EEF8F6] border border-[#B6E6D9]/40 text-[#126A78]">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#183B70] tracking-tight tabular-nums">
          {value}
        </span>
        {badgeText && (
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${getBadgeStyle()}`}>
            {badgeText}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-600 line-clamp-1">{subtext}</p>
    </div>
  );
};
