import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemePreference } from '../../context/ThemeContext';

interface ThemeSelectorProps {
  variant?: 'header' | 'settings';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ variant = 'header' }) => {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const options: { id: ThemePreference; label: string; icon: typeof Sun }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ];

  if (variant === 'settings') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = themePreference === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setThemePreference(opt.id)}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'border-[#329F9C] dark:border-[#38BDF8] bg-[#EEF8F6] dark:bg-slate-700/80 text-[#126A78] dark:text-[#38BDF8] ring-2 ring-[#329F9C]/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-bold">{opt.label}</span>
              {isSelected && (
                <span className="text-[10px] text-[#126A78] dark:text-[#38BDF8] font-semibold">Active</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Header quick toggle / dropdown
  const ActiveIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        title={`Appearance: ${themePreference} mode`}
        aria-label="Toggle theme preference"
        aria-expanded={isOpen}
      >
        <ActiveIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = themePreference === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setThemePreference(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#EEF8F6] dark:bg-slate-700 text-[#126A78] dark:text-[#38BDF8] font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
