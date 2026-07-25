/**
 * 订单数据存储
 * 数据统一存储在 tablego_db.orders
 */
import type { Order, OrderStatus } from '../types';
import { getSlice, setSlice } from '../services/storage';
import { broadcast } from '../services/sync';

const SLICE_KEY = 'orders';

export function getOrders(): Order[] {
  return getSlice<Order[]>(SLICE_KEY, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getOrderById(id: string): Order | undefined {
  return getSlice<Order[]>(SLICE_KEY, []).find((order) => order.id === id);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return getOrders().filter((order) => order.status === status);
}

export function getOrdersByTable(tableNo: string): Order[] {
  return getOrders().filter((order) => order.tableNo === tableNo);
}

export function addOrder(order: Order, notify = true): void {
  const orders = getSlice<Order[]>(SLICE_KEY, []);
  orders.unshift(order);
  setSlice(SLICE_KEY, orders);
  if (notify) {
    broadcast<Order[]>(SLICE_KEY, orders);
  }
}

export function updateOrderStatus(orderId: string, status: OrderStatus, notify = true): void {
  const orders = getSlice<Order[]>(SLICE_KEY, []);
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    };
    setSlice(SLICE_KEY, orders);
    if (notify) {
      broadcast<Order[]>(SLICE_KEY, orders);
    }
  }
}

export function deleteOrder(orderId: string): void {
  const orders = getSlice<Order[]>(SLICE_KEY, []).filter((o) => o.id !== orderId);
  setSlice(SLICE_KEY, orders);
  broadcast<Order[]>(SLICE_KEY, orders);
}

export function clearAllOrders(): void {
  setSlice(SLICE_KEY, []);
  broadcast<Order[]>(SLICE_KEY, []);
}

/** 生成简短订单号（可读性好） */
export function generateOrderId(): string {
  const now = Date.now();
  const date = new Date(now);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const seq = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${month}${day}-${seq}`;
}