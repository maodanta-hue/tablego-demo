/**
 * 多语言工具函数
 * - localizedText: 从 MultiLangText 中获取当前语言文本
 * - 统一导入，避免各组件重复定义
 */
import type { MultiLangText } from '../types';

export type Language = 'vi' | 'en' | 'zh' | 'ko' | 'ja';

/**
 * 从 MultiLangText 中获取当前语言的文本
 * 回退顺序：当前语言 → en → vi → zh
 */
export function localizedText(text: MultiLangText | undefined, lang: string): string {
  if (!text) return '';
  switch (lang) {
    case 'vi': return text.vi || text.en || text.zh;
    case 'zh': return text.zh || text.en || text.vi;
    case 'en': return text.en || text.vi || text.zh;
    case 'ko': return text.ko || text.en || text.vi || text.zh;
    case 'ja': return text.ja || text.en || text.vi || text.zh;
    default:   return text.en || text.vi || text.zh;
  }
}