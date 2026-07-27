/**
 * 统一数据库持久层
 * 所有数据统一存储在 tablego_db 中
 * 带版本号、完整 CRUD、导入导出、重置、种子数据
 */

import type { MenuCategory, MenuItem, Order, CartItem } from '../types';
import type { RestaurantInfo } from '../store/restaurantStore';
import type { TableInfo } from '../data/tables';

const DB_KEY = 'tablego_db';
const CURRENT_VERSION = 1;

// ========== DB Shape ==========

export interface TablegoDB {
  version: number;
  initialized: boolean;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  restaurant: RestaurantInfo;
  carts: Record<string, CartItem[]>;
  tables: TableInfo[];
}

// ========== 默认种子数据 ==========

export const DEFAULT_CATEGORIES: MenuCategory[] = [
  { id: 'coffee', name: { zh: '咖啡', en: 'Coffee', vi: 'Cà phê' }, icon: '☕' },
  { id: 'tea', name: { zh: '茶', en: 'Tea', vi: 'Trà' }, icon: '🍵' },
  { id: 'milktea', name: { zh: '奶茶', en: 'Milk Tea', vi: 'Trà sữa' }, icon: '🧋' },
  { id: 'dessert', name: { zh: '甜点', en: 'Dessert', vi: 'Tráng miệng' }, icon: '🍰' },
  { id: 'food', name: { zh: '主食', en: 'Food', vi: 'Đồ ăn' }, icon: '🍜' },
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1', categoryId: 'coffee',
    name: { zh: '越南滴漏咖啡', en: 'Vietnamese Drip Coffee', vi: 'Cà phê phin Việt Nam' },
    description: { zh: '传统越南滴漏咖啡，浓郁醇厚', en: 'Traditional Vietnamese drip coffee, rich and strong', vi: 'Cà phê phin truyền thống, đậm đà' },
    price: 35000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', popular: true, available: true,
  },
  {
    id: 'm2', categoryId: 'coffee',
    name: { zh: '椰子咖啡', en: 'Coconut Coffee', vi: 'Cà phê dừa' },
    description: { zh: '椰奶与浓缩咖啡的完美融合', en: 'Perfect blend of coconut milk and espresso', vi: 'Sự kết hợp hoàn hảo giữa sữa dừa và cà phê espresso' },
    price: 45000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', popular: true, available: true,
  },
  {
    id: 'm3', categoryId: 'milktea',
    name: { zh: '泰式奶茶', en: 'Thai Milk Tea', vi: 'Trà sữa Thái' },
    description: { zh: '正宗泰国奶茶，香甜丝滑', en: 'Authentic Thai milk tea, sweet and smooth', vi: 'Trà sữa Thái chính gốc, ngọt ngào và mịn màng' },
    price: 30000, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=200&h=200&fit=crop', popular: true, available: true,
  },
  {
    id: 'm4', categoryId: 'tea',
    name: { zh: '柠檬茶', en: 'Lemon Tea', vi: 'Trà chanh' },
    description: { zh: '清新柠檬搭配冰茶，消暑解渴', en: 'Fresh lemon with iced tea, refreshing', vi: 'Chanh tươi với trà đá, giải nhiệt' },
    price: 25000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop', available: true,
  },
  {
    id: 'm5', categoryId: 'dessert',
    name: { zh: '芒果糯米饭', en: 'Mango Sticky Rice', vi: 'Xoài nếp' },
    description: { zh: '新鲜芒果配椰浆糯米饭', en: 'Fresh mango with coconut sticky rice', vi: 'Xoài tươi với xôi dừa' },
    price: 50000, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop', popular: true, available: true,
  },
  {
    id: 'm6', categoryId: 'dessert',
    name: { zh: '椰子布丁', en: 'Coconut Pudding', vi: 'Bánh pudding dừa' },
    description: { zh: '清爽椰子布丁，入口即化', en: 'Light coconut pudding, melts in your mouth', vi: 'Bánh pudding dừa nhẹ, tan trong miệng' },
    price: 25000, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop', available: true,
  },
  {
    id: 'm7', categoryId: 'food',
    name: { zh: '越南河粉', en: 'Pho', vi: 'Phở' },
    description: { zh: '传统牛肉河粉，汤鲜味美', en: 'Traditional beef pho, rich flavorful broth', vi: 'Phở bò truyền thống, nước dùng đậm đà' },
    price: 65000, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=200&fit=crop', popular: true, available: true,
  },
  {
    id: 'm8', categoryId: 'food',
    name: { zh: '越南春卷', en: 'Spring Rolls', vi: 'Chả giò' },
    description: { zh: '酥脆越南春卷，搭配甜辣酱', en: 'Crispy Vietnamese spring rolls with sweet chili sauce', vi: 'Chả giò giòn với sốt ngọt cay' },
    price: 40000, image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=200&h=200&fit=crop', available: true,
  },
];

export const DEFAULT_TABLES: TableInfo[] = Array.from({ length: 10 }, (_, i) => ({
  id: `demo-table-${String(i + 1).padStart(2, '0')}`,
  number: `A${String(i + 1).padStart(2, '0')}`,
  status: 'active' as const,
}));

const DEFAULT_RESTAURANT: RestaurantInfo = {
  name: { zh: '岘港咖啡馆', en: 'Da Nang Cafe & Restaurant', vi: 'Nhà hàng Đà Nẵng' },
  address: '123 Nguyen Van Linh, Da Nang, Vietnam',
  phone: '+84 90 123 4567',
  logo: '🍜',
  description: {
    zh: '正宗越南美食，欢迎光临',
    en: 'Authentic Vietnamese cuisine, welcome!',
    vi: 'Ẩm thực Việt Nam chính gốc, chào mừng bạn!',
  },
  open: true,
};

// ========== Internal Helpers ==========

function loadDB(): TablegoDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<TablegoDB>;
      // 确保有 version 字段
      if (typeof parsed.version !== 'number') {
        parsed.version = CURRENT_VERSION;
      }
      return parsed as TablegoDB;
    }
  } catch {
    // 解析失败，返回空 DB
  }
  return createEmptyDB();
}

function createEmptyDB(): TablegoDB {
  return {
    version: CURRENT_VERSION,
    initialized: false,
    categories: [],
    menuItems: [],
    orders: [],
    restaurant: DEFAULT_RESTAURANT,
    carts: {},
    tables: [],
  };
}

function saveDB(db: TablegoDB): void {
  try {
    db.version = CURRENT_VERSION;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save tablego_db', e);
  }
}

// ========== Slice API（供 Store 使用）==========

/** 读取一个数据切片 */
export function getSlice<T>(key: keyof TablegoDB, fallback: T): T {
  const db = loadDB();
  if (db[key] !== undefined && db[key] !== null) {
    return db[key] as unknown as T;
  }
  return fallback;
}

/** 写入一个数据切片 */
export function setSlice<T>(key: keyof TablegoDB, data: T): void {
  const db = loadDB();
  (db as unknown as Record<string, unknown>)[key] = data;
  saveDB(db);
}

/** 删除一个数据切片（恢复默认值） */
export function removeSlice(key: keyof TablegoDB): void {
  const db = loadDB();
  delete (db as unknown as Record<string, unknown>)[key];
  saveDB(db);
}

/** 获取整个数据库 */
export function getDB(): TablegoDB {
  return loadDB();
}

// ========== 数据库管理 API ==========

/** 重置整个数据库（清空所有数据） */
export function resetDatabase(): void {
  localStorage.removeItem(DB_KEY);
}

/** 填充演示种子数据（会覆盖当前数据） */
export function seedDemo(): void {
  const db: TablegoDB = {
    version: CURRENT_VERSION,
    initialized: true,
    categories: [...DEFAULT_CATEGORIES],
    menuItems: [...DEFAULT_MENU_ITEMS],
    orders: [],
    restaurant: { ...DEFAULT_RESTAURANT },
    carts: {},
    tables: [...DEFAULT_TABLES],
  };
  saveDB(db);
}

/**
 * 首次启动初始化
 * 如果数据库为空，自动填充演示数据
 * 如果已有数据，仅标记 initialized=true，不覆盖
 */
export function initializeIfEmpty(): void {
  const db = loadDB();
  if (db.initialized) return;

  // 检查是否有真实数据
  const hasData = db.tables.length > 0 || db.menuItems.length > 0 || db.orders.length > 0;
  if (hasData) {
    // 已有真实数据，仅标记初始化完成
    db.initialized = true;
    saveDB(db);
    return;
  }

  // 数据库为空，填充演示数据
  seedDemo();
  console.log('📦 TableGo: Demo data initialized (A01-A10, 8 menu items)');
}

/** 导出数据库为 JSON 字符串 */
export function exportDatabase(): string {
  const db = loadDB();
  return JSON.stringify(db, null, 2);
}

/** 从 JSON 字符串导入数据库 */
export function importDatabase(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid JSON: not an object');
    }
    // 确保 version
    parsed.version = CURRENT_VERSION;
    // 确保 carts 和 tables 存在
    if (!parsed.carts) parsed.carts = {};
    if (!parsed.tables) parsed.tables = [];
    saveDB(parsed as TablegoDB);
    return true;
  } catch (e) {
    console.error('Failed to import database', e);
    return false;
  }
}