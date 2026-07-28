/**
 * BottomCart — 底部购物车
 * 
 * 布局：
 * - 固定吸底，白色背景
 * - 顶部细阴影
 * - 左侧：购物车图标 + 红色数量角标
 * - 中间：Total + 金额
 * - 右侧：Review Order 红色按钮（52px 高度，圆角）
 * - 数量变化动画（角标弹入）
 */
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';

interface Props {
  onReviewOrder: () => void;
}

export default function BottomCart({ onReviewOrder }: Props) {
  const { t } = useLanguage();
  const { cartTotal, cartCount, updateTrigger } = useOrder();
  void updateTrigger; // 确保购物车变化时底部条重渲染

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.07)] safe-area-bottom">
      <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center gap-4">
        {/* Left: Cart Icon with Red Badge */}
        <div className="relative flex-shrink-0">
          <div className="w-[40px] h-[40px] rounded-full bg-[#E53935] flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          {/* Badge with bounce animation */}
          <span
            key={cartCount}
            className="absolute -top-1.5 -right-1.5 bg-[#E53935] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm animate-bounce-in"
          >
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </div>

        {/* Middle: Total */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-gray-400 font-medium">{t('total') || 'Total'}</p>
          <p className="text-[18px] font-bold text-[#E53935]">{t('app.currency')}{cartTotal.toLocaleString()}</p>
        </div>

        {/* Right: Review Order Button — adjusted height */}
        <button
          onClick={onReviewOrder}
          className="h-[44px] px-5 rounded-xl bg-[#E53935] text-white font-semibold text-[14px]
                     hover:bg-[#C62828] active:scale-[0.97] transition-all duration-200
                     shadow-sm shadow-red-200/40 flex items-center gap-2 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t('reviewOrder') || 'Review Order'}
        </button>
      </div>
    </div>
  );
}