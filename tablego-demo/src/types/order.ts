import type { CartTopping } from './cart';

// 订单状态：pending → preparing → completed
export type OrderStatus = 'pending' | 'preparing' | 'completed';

// 订单
export interface Order {
  id: string;
  tableNo: string;         // 桌号，如 "Table 1" / "A1"
  items: OrderItem[];      // 订单商品明细
  totalPrice: number;      // 总价
  status: OrderStatus;
  customerNote?: string;   // 顾客备注
  createdAt: string;       // ISO 时间戳
  completedAt?: string;    // 完成时间
}

// 订单中的商品项
export interface OrderItem {
  menuItemId: string;
  name: { zh: string; en: string; vi: string };  // 三语名称
  price: number;
  quantity: number;
  temperature?: string;   // 冰量
  sugar?: string;         // 甜度
  toppings?: CartTopping[]; // 加料
  remark?: string;        // 备注
}
