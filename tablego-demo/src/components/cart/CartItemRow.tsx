import type { CartItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';
import { formatPrice } from '../../hooks/useFormat';

interface Props {
  item: CartItem;
}

/**
 * 购物车单项
 * 显示：名称、单价、数量加减、小计
 */
export default function CartItemRow({ item }: Props) {
  const { t } = useLanguage();
  const { updateQuantity, removeFromCart } = useOrder();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      {/* 商品信息 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 truncate">
          {t(item.nameKey)}
        </h4>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatPrice(item.price)} / {t('cart.item')}
        </p>
      </div>

      {/* 数量控制 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (item.quantity <= 1) {
              removeFromCart(item.id);
            } else {
              updateQuantity(item.id, item.quantity - 1);
            }
          }}
          className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold
                     hover:bg-gray-200 active:scale-90 transition-all"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-800">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm font-bold
                     hover:bg-green-200 active:scale-90 transition-all"
        >
          +
        </button>
      </div>

      {/* 小计 */}
      <div className="text-right w-20">
        <span className="text-sm font-semibold text-gray-800">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}