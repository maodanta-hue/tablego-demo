// 订单状态
export type OrderStatus = 'pending' | 'completed';

// 订单
export interface Order {
  id: string;
  tableNo: string;         // 桌号，如 "Table 1" / "A1"
  items: OrderItem[];      // 订单商品明细
  totalPrice: number;      // 总价
  status: OrderStatus;
  createdAt: string;       // ISO 时间戳
  completedAt?: string;    // 完成时间
}

// 订单中的商品项
export interface OrderItem {
  menuItemId: string;
  nameKey: string;
  price: number;
  quantity: number;
}

// 提交订单参数
export interface SubmitOrderParams {
  tableNo: string;
  items: OrderItem[];
}