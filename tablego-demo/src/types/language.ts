// 支持的语言
export type Language = 'vi' | 'zh' | 'en' | 'ko' | 'ja';

// 语言配置
export interface LanguageConfig {
  code: Language;
  label: string;       // 显示名称（本国语言）
  flag: string;        // 国旗 emoji
  nativeName: string;  // 母语名称
}

// 翻译映射：key -> 文本
export type TranslationMap = Record<string, string>;

// 全部语言的翻译
export type Translations = Record<Language, TranslationMap>;