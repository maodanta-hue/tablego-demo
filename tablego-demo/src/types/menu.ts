// 菜品分类
export interface MenuCategory {
  id: string;
  key: string;       // 翻译 key，如 'menu.category.coffee'
  icon?: string;     // 分类图标 emoji
}

// 单个菜品
export interface MenuItem {
  id: string;
  categoryId: string;
  nameKey: string;       // 名称翻译 key
  descriptionKey: string; // 描述翻译 key
  price: number;         // 价格（越南盾）
  image: string;         // 图片路径
  popular?: boolean;     // 是否热门推荐
}