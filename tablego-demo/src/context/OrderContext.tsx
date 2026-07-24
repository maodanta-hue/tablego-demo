import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, Order, OrderItem, MenuItem } from '../types';

// ============================================================
// OrderContext 管理购物车 + 订单列表
// 这是整个应用的核心状态层
// ============================================================

interface OrderContextValue {
  // ---- 购物车 ----
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;       // 购物车总价
  cartCount: number;       // 购物车商品总数（按件数算）

  // ---- 订单 ----
  orders: Order[];
  submitOrder: (tableNo: string) => void;  // 提交当前购物车为订单
  markOrderCompleted: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

/** 生成简单 ID：时间戳 + 随机数 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function OrderProvider({ children }: { children: ReactNode }) {
  // 购物车状态
  const [cart, setCart] = useState<CartItem[]>([]);
  // 订单列表（用数组模拟，越新的订单在前面）
  const [orders, setOrders] = useState<Order[]>([]);

  /** 加入购物车：如果已有则增加数量 */
  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItemId === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      // 新商品，创建 CartItem
      const newItem: CartItem = {
        id: generateId(),
        menuItemId: item.id,
        nameKey: item.nameKey,
        price: item.price,
        quantity: 1,
        image: item.image,
      };
      return [...prev, newItem];
    });
  }, []);

  /** 从购物车移除 */
  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  }, []);

  /** 修改数量（<=0 时自动移除） */
  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((ci) =>
        ci.id === cartItemId ? { ...ci, quantity } : ci
      )
    );
  }, []);

  /** 清空购物车 */
  const clearCart = useCallback(() => setCart([]), []);

  /** 计算购物车总价 */
  const cartTotal = cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);

  /** 计算购物车总件数 */
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  /** 提交订单：将购物车内容转为订单，然后清空购物车 */
  const submitOrder = useCallback(
    (tableNo: string) => {
      if (cart.length === 0) return;

      const orderItems: OrderItem[] = cart.map((ci) => ({
        menuItemId: ci.menuItemId,
        nameKey: ci.nameKey,
        price: ci.price,
        quantity: ci.quantity,
      }));

      const newOrder: Order = {
        id: 'ORD-' + generateId().toUpperCase(),
        tableNo,
        items: orderItems,
        totalPrice: cartTotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setOrders((prev) => [newOrder, ...prev]); // 新订单在最前面
      setCart([]); // 清空购物车
    },
    [cart, cartTotal]
  );

  /** 老板标记订单为已完成 */
  const markOrderCompleted = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'completed' as const, completedAt: new Date().toISOString() }
          : o
      )
    );
  }, []);

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        submitOrder,
        markOrderCompleted,
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