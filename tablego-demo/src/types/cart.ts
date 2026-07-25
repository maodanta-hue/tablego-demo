// 购物车单项
export interface CartItem {
  id: string;
  menuItemId: string;
  name: { zh: string; en: string; vi: string };  // 三语名称
  price: number;
  quantity: number;
  image: string;
  remark?: string;           // 备注
}