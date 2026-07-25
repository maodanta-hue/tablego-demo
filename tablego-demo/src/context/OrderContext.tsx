/**
 * 订单上下文（OrderContext）
 * 管理：购物车 + 订单列表 + 当前桌号
 *
 * 简化版（Demo）：
 * - 购物车存 tablego_db.carts（按桌号隔离）
 * - 订单通过 store 模块持久化（顾客老板共享）
 * - 桌号从 URL ?table= 读取
 * - 无糖度/冰度等复杂选项（Demo 简化）
 * - 支持 BroadcastChannel + StorageEvent 同步
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CartItem, Order, OrderItem, MenuItem } from '../types';
import {
  addOrder,
  updateOrderStatus,
  generateId,
  generateOrderId,
} from '../store';
import { getSlice, setSlice } from '../services/storage';
import { broadcast, subscribe } from '../services/sync';

// ============================================================
// Context Value 类型
// ============================================================

interface OrderContextValue {
  currentTable: string;
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  submitOrder: () => string | null;
  markOrderCompleted: (orderId: string) => void;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

type CartsMap = Record<string, CartItem[]>;

const SLICE_KEY = 'carts';

/** 从 tablego_db 加载购物车 */
function loadCart(table: string): CartItem[] {
  const carts = getSlice<CartsMap>(SLICE_KEY, {});
  return carts[table] ?? [];
}

/** 保存购物车到 tablego_db */
function saveCart(table: string, cart: CartItem[]): void {
  const carts = getSlice<CartsMap>(SLICE_KEY, {});
  carts[table] = cart;
  setSlice(SLICE_KEY, carts);
}

// ============================================================
// Provider
// ============================================================

export function OrderProvider({ children }: { children: ReactNode }) {
  // 桌号从 URL query 参数读取
  const [searchParams] = useSearchParams();
  const currentTable = searchParams.get('table') || 'A1';

  // 购物车状态
  const [cart, setCart] = useState<CartItem[]>(() => loadCart(currentTable));

  // 桌号变化时重新加载购物车
  useEffect(() => {
    setCart(loadCart(currentTable));
  }, [currentTable]);

  // 购物车变化时自动保存
  useEffect(() => {
    saveCart(currentTable, cart);
  }, [cart, currentTable]);

  // 监听 carts 同步（其他标签页/窗口修改购物车）
  useEffect(() => {
    const unsub = subscribe<CartsMap>(SLICE_KEY, (updatedCarts) => {
      const updatedCart = updatedCarts[currentTable] ?? [];
      setCart(updatedCart);
    });
    return unsub;
  }, [currentTable]);

  // ---- 购物车操作 ----

  const addToCart = useCallback((item: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((ci) =>
          ci.id === existing.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci,
        );
      } else {
        const newItem: CartItem = {
          id: generateId(),
          menuItemId: item.id,
          name: { ...item.name },
          price: item.price,
          quantity,
          image: item.image,
        };
        next = [...prev, newItem];
      }
      // 保存后广播
      saveCart(currentTable, next);
      const allCarts = getSlice<CartsMap>(SLICE_KEY, {});
      allCarts[currentTable] = next;
      broadcast<CartsMap>(SLICE_KEY, allCarts);
      return next;
    });
  }, [currentTable]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => {
      const next = prev.filter((ci) => ci.id !== cartItemId);
      saveCart(currentTable, next);
      const allCarts = getSlice<CartsMap>(SLICE_KEY, {});
      allCarts[currentTable] = next;
      broadcast<CartsMap>(SLICE_KEY, allCarts);
      return next;
    });
  }, [currentTable]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCart((prev) => {
      let next: CartItem[];
      if (quantity <= 0) {
        next = prev.filter((ci) => ci.id !== cartItemId);
      } else {
        next = prev.map((ci) => (ci.id === cartItemId ? { ...ci, quantity } : ci));
      }
      saveCart(currentTable, next);
      const allCarts = getSlice<CartsMap>(SLICE_KEY, {});
      allCarts[currentTable] = next;
      broadcast<CartsMap>(SLICE_KEY, allCarts);
      return next;
    });
  }, [currentTable]);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart(currentTable, []);
    const allCarts = getSlice<CartsMap>(SLICE_KEY, {});
    allCarts[currentTable] = [];
    broadcast<CartsMap>(SLICE_KEY, allCarts);
  }, [currentTable]);

  const cartTotal = cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  // ---- 订单操作 ----

  const submitOrder = useCallback((): string | null => {
    if (cart.length === 0) return null;

    const orderItems: OrderItem[] = cart.map((ci) => ({
      menuItemId: ci.menuItemId,
      name: { ...ci.name },
      price: ci.price,
      quantity: ci.quantity,
    }));

    const orderId = generateOrderId();
    const newOrder: Order = {
      id: orderId,
      tableNo: currentTable,
      items: orderItems,
      totalPrice: cartTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // 通过 store 持久化（会触发广播）
    addOrder(newOrder);
    // 清空购物车
    setCart([]);
    saveCart(currentTable, []);
    const allCarts = getSlice<CartsMap>(SLICE_KEY, {});
    allCarts[currentTable] = [];
    broadcast<CartsMap>(SLICE_KEY, allCarts);

    return orderId;
  }, [cart, cartTotal, currentTable]);

  const markOrderCompleted = useCallback((orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  }, []);

  const refreshOrders = useCallback(() => {
    // 不做额外操作，订阅已在 store 层处理
  }, []);

  return (
    <OrderContext.Provider
      value={{
        currentTable,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        submitOrder,
        markOrderCompleted,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

/** Hook：获取订单上下文 */
export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}