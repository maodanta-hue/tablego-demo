/**
 * 餐厅设置数据存储
 * 所有餐厅基本信息（名称、地址、营业状态等）统一从这里存取
 * 数据统一存储在 tablego_db.restaurant
 */

import { getSlice, setSlice, removeSlice } from '../services/storage';
import { broadcast } from '../services/sync';

// ========== Types ==========

export interface RestaurantInfo {
  name: { zh: string; en: string; vi: string };
  address: string;
  phone: string;
  logo: string;
  description: { zh: string; en: string; vi: string };
  open: boolean;
}

// ========== Default Data ==========

const DEFAULT_INFO: RestaurantInfo = {
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

const SLICE_KEY = 'restaurant';

// ========== Public API ==========

export function getRestaurantInfo(): RestaurantInfo {
  return getSlice<RestaurantInfo>(SLICE_KEY, DEFAULT_INFO);
}

export function saveRestaurantInfo(info: RestaurantInfo): void {
  setSlice(SLICE_KEY, info);
  broadcast<RestaurantInfo>(SLICE_KEY, info);
}

export function resetRestaurantInfo(): void {
  removeSlice(SLICE_KEY);
}