// 购物车加料
export interface CartTopping {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// 购物车单项
export interface CartItem {
  id: string;
  menuItemId: string;
  name: { zh: string; en: string; vi: string };  // 三语名称
  price: number;
  quantity: number;
  image: string;
  temperature?: string;      // 温度/冰度
  sugar?: string;            // 糖度
  toppings?: CartTopping[];  // 加料
  remark?: string;           // 备注
}
