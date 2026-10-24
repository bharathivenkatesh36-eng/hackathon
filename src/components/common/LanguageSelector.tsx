import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Check, ChevronDown, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguage, LanguageConfig } from '../../i18n/languages';
import { changeAppLanguage } from '../../i18n/i18n';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  variant?: 'header' | 'settings' | 'compact';
  onLanguageChanged?: (code: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  onLanguageChanged
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentCode = i18n.language || 'en';
  const currentLang = getLanguage(currentCode);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = searchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (lang: LanguageConfig) => {
    changeAppLanguage(lang.code);
    setIsOpen(false);
    if (onLanguageChanged) {
      onLanguageChanged(lang.code);
    }
  };

  if (variant === 'settings') {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Interface Language (23 Languages Supported)
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/40"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#126A78] dark:text-[#38BDF8]" />
              <span className="font-semibold">{currentLang.nativeName}</span>
              <span className="text-slate-400">({currentLang.name})</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search from 22 Eighth Schedule languages + English..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredLanguages.map((lang) => {
                  const isSelected = lang.code === currentCode;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelect(lang)}
                      className={`w-full p-2.5 text-left flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#EEF8F6] dark:bg-slate-700/80 text-[#126A78] dark:text-[#38BDF8] font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold">{lang.nativeName}</span>
                        <span className="text-slate-400 dark:text-slate-400 text-[11px] truncate">
                          · {lang.name}
                        </span>
                        {lang.direction === 'rtl' && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-1 py-0.2 rounded font-mono">
                            RTL
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#126A78] dark:text-[#38BDF8] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Header compact variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
        title="Change application language (23 languages supported)"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#126A78] dark:text-[#38BDF8]" />
        <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / भाषा खोजें..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-400 px-1">
              <span>All 22 Eighth Schedule + English</span>
              <span>23 languages</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentCode;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang)}
                    className={`w-full p-2.5 text-left flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#EEF8F6] dark:bg-slate-700/80 text-[#126A78] dark:text-[#38BDF8] font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-xs">{lang.nativeName}</span>
                      <span className="text-[11px] text-slate-400 truncate">({lang.name})</span>
                      {lang.direction === 'rtl' && (
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-1 py-0.2 rounded font-mono">
                          RTL
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#126A78] dark:text-[#38BDF8] shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching language found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
