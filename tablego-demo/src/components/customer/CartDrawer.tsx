/**
 * CartDrawer — 底部弹出购物车（Bottom Sheet）
 *
 * 风格：美团/饿了么/蜜雪冰城
 * - 覆盖 65-75% 屏幕高度，顶部圆角 20px
 * - 拖拽手柄（灰色横条）+ 关闭按钮（✕）
 * - 商品列表 + 备注 + 合计 + 去支付
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';
import { localizedText } from '../../utils/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    submitOrder,
    currentTable,
    updateTrigger,
  } = useOrder();
  void updateTrigger;

  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 抽屉打开时阻止 body 滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const orderId = submitOrder();
    if (orderId) {
      navigate(
        `/order-success?orderId=${orderId}&table=${encodeURIComponent(currentTable)}`
      );
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* 底部卡片 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] animate-slide-up max-w-lg mx-auto"
        style={{ maxHeight: '75vh' }}
      >
        {/* 拖拽手柄 */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>

        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-2">
          <div>
            <h2 className="text-[18px] font-bold text-[#1A1A2E]">
              {t('confirmOrder') || '确认订单'}
            </h2>
            <p className="text-[12px] text-[#9A9AAB] mt-0.5">
              {t('total') || '共'} {cartCount} {t('items') || '件商品'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F3F3] flex items-center justify-center text-[#9A9AAB] hover:bg-[#E5E5EA] transition"
            aria-label={t('close') || '关闭'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-[#EEEEF0]" />

        {/* 商品列表 */}
        <div className="overflow-y-auto px-4 py-2" style={{ maxHeight: 'calc(75vh - 260px)' }}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#9A9AAB]">
              <span className="text-4xl mb-3">🛒</span>
              <p className="text-[14px]">{t('cartEmpty') || '购物车是空的'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((ci) => (
                <div
                  key={ci.id}
                  className="flex gap-3 bg-white rounded-[14px] p-3 border border-[#EEEEF0]"
                >
                  {/* 商品图 */}
                  <div className="w-[56px] h-[56px] rounded-[10px] overflow-hidden flex-shrink-0 bg-[#F0F0F0] flex items-center justify-center">
                    {ci.image ? (
                      <img
                        src={ci.image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#1A1A2E] truncate">
                      {localizedText(ci.name, language)}
                    </h3>

                    {/* 规格信息 */}
                    {ci.temperature && (
                      <p className="text-[11px] text-[#9A9AAB] mt-0.5">
                        {ci.temperature}
                        {ci.sugar ? ` · ${ci.sugar}` : ''}
                      </p>
                    )}
                    {ci.toppings && ci.toppings.length > 0 && (
                      <p className="text-[11px] text-[#9A9AAB] mt-0.5 truncate">
                        {ci.toppings.map((tp) => tp.name).join(', ')}
                      </p>
                    )}

                    <p className="text-[12px] text-[#9A9AAB] mt-0.5">
                      {t('app.currency')}
                      {ci.price.toLocaleString()} × {ci.quantity}
                    </p>

                    {/* 数量控制 + 小计 */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            ci.quantity > 1
                              ? updateQuantity(ci.id, ci.quantity - 1)
                              : removeFromCart(ci.id)
                          }
                          className="w-6 h-6 rounded-full bg-[#F3F3F3] flex items-center justify-center text-[#9A9AAB] hover:bg-[#E5E5EA] transition text-[14px] leading-none"
                          aria-label={ci.quantity > 1 ? '减少' : '删除'}
                        >
                          {ci.quantity > 1 ? '−' : '🗑'}
                        </button>
                        <span className="text-[14px] font-semibold text-[#1A1A2E] min-w-[18px] text-center">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-[#1A6B3C] flex items-center justify-center text-white hover:bg-[#0D4A2A] transition text-[14px] leading-none"
                          disabled={ci.quantity >= 99}
                          aria-label="增加"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[15px] font-bold text-[#D84315]">
                        {t('app.currency')}
                        {(ci.price * ci.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 备注区域 */}
        {cart.length > 0 && (
          <div className="px-4 py-3">
            <div className="bg-[#F8F9FA] rounded-[14px] p-3">
              <p className="text-[13px] font-semibold text-[#1A1A2E] mb-2">
                {t('remark') || '备注'}
              </p>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={t('remarkPlaceholder') || '添加备注…'}
                className="w-full h-9 px-3 rounded-[10px] bg-white text-[14px] text-[#1A1A2E] placeholder-[#9A9AAB] border border-[#EEEEF0] outline-none focus:ring-1 focus:ring-[#1A6B3C]/20 transition"
              />
            </div>
          </div>
        )}

        {/* 底部提交栏 */}
        {cart.length > 0 && (
          <div className="border-t border-[#EEEEF0] px-5 py-3 flex items-center gap-4 bg-white rounded-b-[20px]">
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#9A9AAB]">
                {t('total') || '合计'} ({cartCount} {t('items') || '件'})
              </p>
              <p className="text-[20px] font-bold text-[#1A1A2E]">
                {t('app.currency')}
                {cartTotal.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-[48px] px-8 rounded-[14px] bg-[#D84315] text-white text-[15px] font-semibold
                         hover:bg-[#BF360C] active:scale-[0.97] transition-all duration-200
                         shadow-md flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '…' : t('submitOrder') || '去支付'}
            </button>
          </div>
        )}
      </div>

      {/* 滑入动画 keyframes（内联 by Tailwind animate-slide-up） */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}