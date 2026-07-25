/**
 * 多语言文本结构
 * 所有面向顾客的文本使用此结构，支持三种语言
 */
export interface MultiLangText {
  zh: string;
  en: string;
  vi: string;
  ko?: string;
  ja?: string;
}

// 菜品分类
export interface MenuCategory {
  id: string;
  name: MultiLangText;  // 分类名称（三语）
  icon?: string;         // 分类图标 emoji
}

// 单个菜品
export interface MenuItem {
  id: string;
  categoryId: string;
  name: MultiLangText;       // 名称（三语）
  description: MultiLangText; // 描述（三语）
  price: number;              // 价格（越南盾）
  image: string;              // 图片路径
  popular?: boolean;          // 是否热门推荐
  available: boolean;         // 是否在售
  sold?: number;              // 销量
}

// 默认数据已迁移至 services/storage.ts（唯一数据源）
