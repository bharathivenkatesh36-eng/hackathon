import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 bg-white text-emerald-800';
        let iconClass = 'text-emerald-600';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-200 bg-white text-rose-800';
          iconClass = 'text-rose-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-[#B6E6D9] bg-white text-[#126A78]';
          iconClass = 'text-[#329F9C]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg border shadow-lg ${borderClass} transition-all transform animate-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
              <p className="text-xs font-medium text-slate-800">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
