/**
 * 分类数据存储
 * 数据统一存储在 tablego_db.categories
 */
import type { MenuCategory } from '../types';
import { getSlice, setSlice, removeSlice, DEFAULT_CATEGORIES } from '../services/storage';
import { broadcast } from '../services/sync';

const SLICE_KEY = 'categories';

export function getCategories(): MenuCategory[] {
  return getSlice<MenuCategory[]>(SLICE_KEY, DEFAULT_CATEGORIES);
}

export function saveCategoriesList(categories: MenuCategory[]): void {
  setSlice(SLICE_KEY, categories);
  broadcast<MenuCategory[]>(SLICE_KEY, categories);
}

export function resetCategories(): void {
  removeSlice(SLICE_KEY);
}