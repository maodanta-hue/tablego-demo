/**
 * 数据存储统一导出
 * 所有数据存取的统一入口
 */
export { getRestaurantInfo, saveRestaurantInfo, resetRestaurantInfo } from './restaurantStore';
export type { RestaurantInfo } from './restaurantStore';
export { getCategories, saveCategoriesList, resetCategories } from './categoryStore';
export { getMenuItems, getMenuItemById, getMenuItemsByCategory, saveMenuItemsList, resetMenuItems, generateId } from './menuStore';
export { getOrders, getOrderById, getOrdersByStatus, addOrder, updateOrderStatus, deleteOrder, clearAllOrders, generateOrderId } from './orderStore';