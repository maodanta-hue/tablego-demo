import type { Language, LanguageConfig } from '../types';

// 语言配置列表
// 用于在语言切换器中展示
export const languageConfigs: LanguageConfig[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'zh', label: '中文', flag: '🇨🇳', nativeName: '中文' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', nativeName: '日本語' },
];

// 默认语言
export const defaultLanguage: Language = 'en';