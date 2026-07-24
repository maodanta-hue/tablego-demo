import type { MenuCategory, MenuItem } from '../types';

// ===== 菜品分类 =====
export const categories: MenuCategory[] = [
  { id: 'coffee', key: 'menu.category.coffee', icon: '☕' },
  { id: 'tea', key: 'menu.category.tea', icon: '🧋' },
  { id: 'dessert', key: 'menu.category.dessert', icon: '🍰' },
  { id: 'food', key: 'menu.category.food', icon: '🍜' },
];

// ===== 菜品列表（8个经典岘港特色菜品）=====
export const menuItems: MenuItem[] = [
  // --- Coffee (2 items) ---
  {
    id: 'm1',
    categoryId: 'coffee',
    nameKey: 'menu.item.m1.name',
    descriptionKey: 'menu.item.m1.desc',
    price: 35000,
    image: '/images/vietnam-drip-coffee.jpg',
    popular: true,
  },
  {
    id: 'm2',
    categoryId: 'coffee',
    nameKey: 'menu.item.m2.name',
    descriptionKey: 'menu.item.m2.desc',
    price: 45000,
    image: '/images/coconut-coffee.jpg',
    popular: true,
  },
  // --- Tea (2 items) ---
  {
    id: 'm3',
    categoryId: 'tea',
    nameKey: 'menu.item.m3.name',
    descriptionKey: 'menu.item.m3.desc',
    price: 30000,
    image: '/images/thai-milk-tea.jpg',
    popular: true,
  },
  {
    id: 'm4',
    categoryId: 'tea',
    nameKey: 'menu.item.m4.name',
    descriptionKey: 'menu.item.m4.desc',
    price: 35000,
    image: '/images/lemon-tea.jpg',
  },
  // --- Dessert (2 items) ---
  {
    id: 'm5',
    categoryId: 'dessert',
    nameKey: 'menu.item.m5.name',
    descriptionKey: 'menu.item.m5.desc',
    price: 50000,
    image: '/images/mango-sticky-rice.jpg',
    popular: true,
  },
  {
    id: 'm6',
    categoryId: 'dessert',
    nameKey: 'menu.item.m6.name',
    descriptionKey: 'menu.item.m6.desc',
    price: 25000,
    image: '/images/coconut-pudding.jpg',
  },
  // --- Food (2 items) ---
  {
    id: 'm7',
    categoryId: 'food',
    nameKey: 'menu.item.m7.name',
    descriptionKey: 'menu.item.m7.desc',
    price: 65000,
    image: '/images/pho.jpg',
    popular: true,
  },
  {
    id: 'm8',
    categoryId: 'food',
    nameKey: 'menu.item.m8.name',
    descriptionKey: 'menu.item.m8.desc',
    price: 40000,
    image: '/images/spring-rolls.jpg',
  },
];

/** 根据分类ID获取菜品 */
export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.categoryId === categoryId);
}