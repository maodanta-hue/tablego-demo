import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { languageConfigs } from '../../data/languageConfig';
import { createPortal } from 'react-dom';

export default function LanguageSwitcher({ minimal }: { minimal?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentConfig = languageConfigs.find((c) => c.code === language) ?? languageConfigs[0];

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (minimal) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-[36px] h-[36px] rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium border border-white/20 hover:bg-white/25 transition-all active:scale-95"
        >
          {currentConfig.flag}
        </button>
         {open && createPortal(
           <div
             className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[120px] z-[9999] max-h-60 overflow-y-auto"
             style={{ right: '16px' }}
           >
            {languageConfigs.map((cfg) => (
              <button
                key={cfg.code}
                onClick={() => {
                  setLanguage(cfg.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 text-sm font-medium transition h-11 ${
                  language === cfg.code
                    ? 'text-[#E53935] bg-red-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{cfg.flag}</span>
                <span>{cfg.nativeName}</span>
              </button>
            ))}
          </div>, document.body)}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {languageConfigs.map((cfg) => (
        <button
          key={cfg.code}
          onClick={() => setLanguage(cfg.code)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            language === cfg.code
              ? 'bg-[#E53935] text-white shadow-sm ring-2 ring-red-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
          }`}
        >
          <span className="text-sm">{cfg.flag}</span>
          <span>{cfg.nativeName}</span>
        </button>
      ))}
    </div>
  );
}
