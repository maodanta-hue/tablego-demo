// 统一导出所有类型
export type { Language, LanguageConfig, TranslationMap, Translations } from './language';
export type { MultiLangText, MenuCategory, MenuItem } from './menu';
export type { CartItem, CartTopping } from './cart';
export type { OrderStatus, Order, OrderItem } from './order';

// 默认数据集中管理在 services/storage.ts
export { DEFAULT_CATEGORIES, DEFAULT_MENU_ITEMS } from '../services/storage';
