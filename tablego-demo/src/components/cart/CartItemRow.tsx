/**
 * 购物车单项行
 * - 显示名称（多语言）、数量加减、小计
 * - 通过 props 回调控制数量
 */
import type { CartItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizedText } from '../../utils/i18n';

interface Props {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  const { t, language } = useLanguage();

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {/* 商品信息 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 truncate">
          {localizedText(item.name, language)}
        </h4>
        <p className="text-xs text-gray-400 mt-0.5">
          {t('app.currency')}{item.price.toLocaleString()} / {t('cart.item')}
        </p>
      </div>

      {/* 数量控制器 */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            if (item.quantity <= 1) {
              onRemove();
            } else {
              onQuantityChange(item.quantity - 1);
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
          onClick={() => onQuantityChange(item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm font-bold
                     hover:bg-green-200 active:scale-90 transition-all"
        >
          +
        </button>
      </div>

      {/* 小计 */}
      <div className="text-right w-20 shrink-0">
        <span className="text-sm font-semibold text-gray-800">
          {t('app.currency')}{(item.price * item.quantity).toLocaleString()}
        </span>
      </div>
    </div>
  );
}