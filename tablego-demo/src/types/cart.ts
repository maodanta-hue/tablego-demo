// 购物车单项
export interface CartItem {
  id: string;
  menuItemId: string;
  nameKey: string;
  price: number;
  quantity: number;
  image: string;
}