/**
 * BottomCart — 底部购物车
 * 固定吸底、白色背景、顶部阴影、购物车图标+角标、总金额、Review Order 按钮
 */
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';

interface Props {
  onReviewOrder: () => void;
}

export default function BottomCart({ onReviewOrder }: Props) {
  const { t } = useLanguage();
  const { cartTotal, cartCount } = useOrder();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Cart Icon with Badge */}
        <div className="relative flex-shrink-0">
          <div className="w-[44px] h-[44px] rounded-full bg-[#E53935] flex items-center justify-center shadow-md shadow-red-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 w-[20px] h-[20px] rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce-in">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </div>

        {/* Total */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-gray-400">{t('total') || 'Total'}</p>
          <p className="text-[18px] font-bold text-gray-900">¥{cartTotal.toFixed(2)}</p>
        </div>

        {/* Review Order Button */}
        <button
          onClick={onReviewOrder}
          className="h-[52px] px-6 rounded-xl bg-[#E53935] text-white font-semibold text-[15px] shadow-md shadow-red-200 hover:bg-[#d32f2f] active:scale-[0.97] transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t('reviewOrder') || 'Review Order'}
        </button>
      </div>
    </div>
  );
}