import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Language } from '../types';
import translations from '../data/translations';
import { defaultLanguage } from '../data/languageConfig';

// Context 中提供的值
interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** 翻译函数：根据 key 获取当前语言的文本 */
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** 翻译函数：支持 {param} 插值 */
function translate(lang: Language, key: string, params?: Record<string, string | number>): string {
  const langMap = translations[lang];
  if (!langMap) return key;

  let text = langMap[key];
  if (!text) return key; // key 不存在时直接返回 key 本身，方便调试

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(language, key, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Hook：获取语言上下文 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

/** Hook：仅获取翻译函数 t（便利写法） */
export function useTranslate() {
  return useLanguage().t;
}