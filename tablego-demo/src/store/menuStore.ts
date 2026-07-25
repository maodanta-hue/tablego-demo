/**
 * 菜品数据存储
 * 数据统一存储在 tablego_db.menuItems
 */
import type { MenuItem } from '../types';
import { DEFAULT_MENU_ITEMS } from '../services/storage';
import { getSlice, setSlice, removeSlice } from '../services/storage';
import { broadcast } from '../services/sync';

const SLICE_KEY = 'menuItems';

export function getMenuItems(): MenuItem[] {
  return getSlice<MenuItem[]>(SLICE_KEY, DEFAULT_MENU_ITEMS);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return getMenuItems().find((item) => item.id === id);
}

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return getMenuItems().filter((item) => item.categoryId === categoryId);
}

export function saveMenuItemsList(items: MenuItem[]): void {
  setSlice(SLICE_KEY, items);
  broadcast<MenuItem[]>(SLICE_KEY, items);
}

export function resetMenuItems(): void {
  removeSlice(SLICE_KEY);
}

/** 生成简单 ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}