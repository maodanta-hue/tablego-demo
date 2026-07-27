/**
 * 订单上下文（OrderContext）
 * 管理：购物车 + 订单列表 + 当前桌号
 *
 * - 购物车存 tablego_db.carts（按桌号隔离）
 * - 订单通过 store 模块持久化（顾客老板共享）
 * - 桌号从 URL ?table= 读取
 * - 支持规格匹配：温度/糖度/加料
 * - 同规格合并数量，不同规格生成新项
 * - 支持 BroadcastChannel + StorageEvent 同步
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { CartItem, CartTopping, Order, OrderItem, MenuItem } from '../types';
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

export interface AddToCartOptions {
  temperature?: string;
  sugar?: string;
  toppings?: CartTopping[];
}

interface OrderContextValue {
  currentTable: string;
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, options?: AddToCartOptions) => void;
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

/**
 * 判断两个购物车项是否规格相同（温度、糖度、加料）
 */
function specsMatch(a: CartItem, b: CartItem): boolean {
  if (a.menuItemId !== b.menuItemId) return false;
  if ((a.temperature ?? 'none') !== (b.temperature ?? 'none')) return false;
  if ((a.sugar ?? 'none') !== (b.sugar ?? 'none')) return false;

  const aTops = (a.toppings ?? []).sort((x, y) => x.id.localeCompare(y.id));
  const bTops = (b.toppings ?? []).sort((x, y) => x.id.localeCompare(y.id));
  if (aTops.length !== bTops.length) return false;
  for (let i = 0; i < aTops.length; i++) {
    if (aTops[i].id !== bTops[i].id) return false;
    if (aTops[i].quantity !== bTops[i].quantity) return false;
  }
  return true;
}

/**
 * 计算加料总价
 */
function toppingsPrice(toppings?: CartTopping[]): number {
  if (!toppings || toppings.length === 0) return 0;
  return toppings.reduce((sum, t) => sum + t.price * t.quantity, 0);
}

// ============================================================
// Provider
// ============================================================

export function OrderProvider({ children }: { children: ReactNode }) {
  // 桌号从 URL query 参数读取，不允许使用硬编码默认值
  const location = useLocation();

  const [currentTable, setCurrentTable] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    return tableParam || '';
  });

  // 监听 URL 中 table 参数变化（刷新、从 WelcomePage 跳转、手动改 URL）
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    if (tableParam && tableParam !== currentTable) {
      console.log('桌号从 URL 更新:', currentTable, '→', tableParam);
      setCurrentTable(tableParam);
    }
  }, [location.search, currentTable]);

  // 购物车状态
  const [cart, setCart] = useState<CartItem[]>(() => loadCart(currentTable));

   // 桌号变化时重新加载购物车
   useEffect(() => {
     setCart(loadCart(currentTable));
   }, [currentTable]);

    // 购物车变化时自动保存（避免 StrictMode 双次执行导致的重复保存）
    useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      timeoutId = setTimeout(() => {
        saveCart(currentTable, cart);
      }, 20);
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
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

  const addToCart = useCallback((item: MenuItem, quantity = 1, options?: AddToCartOptions) => {
    setCart((prev) => {
      // 构建新项（用于匹配）
      const newItemPartial: Partial<CartItem> = {
        menuItemId: item.id,
        temperature: options?.temperature,
        sugar: options?.sugar,
        toppings: options?.toppings,
      };

      // 查找相同规格的已有项（使用 menuItemId + 温度 + 糖度 + 加料 完全匹配）
      const existing = prev.find((ci) => specsMatch(ci as CartItem, newItemPartial as CartItem));

      let next: CartItem[];
      if (existing) {
        // 合并数量
        next = prev.map((ci) =>
          ci.id === existing.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci,
        );
      } else {
        // 创建新购物车项
        const basePrice = item.price;
        const topPrice = toppingsPrice(options?.toppings);
        const newItem: CartItem = {
          id: generateId(),
          menuItemId: item.id,
          name: { ...item.name },
          price: basePrice + topPrice,
          quantity,
          image: item.image,
          temperature: options?.temperature,
          sugar: options?.sugar,
          toppings: options?.toppings?.map(t => ({ ...t })),
        };
        next = [...prev, newItem];
      }
      // 只返回新的购物车状态，保存和广播通过useEffect处理
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

  const cartTotal = useMemo(() => cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, ci) => sum + ci.quantity, 0), [cart]);

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