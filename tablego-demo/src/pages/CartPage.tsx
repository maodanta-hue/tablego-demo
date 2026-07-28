/**
 * CartPage — 确认订单页面（Confirm Order）
 * 顶部返回按钮 + 商品列表 + Remark + 底部 Total + Submit
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';
import { localizedText } from '../utils/i18n';

export default function CartPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, submitOrder, currentTable, updateTrigger } = useOrder();
  void updateTrigger; // 确保强制更新时重渲染总价
  const [remark, setRemark] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const orderId = submitOrder(remark);
    if (orderId) {
      navigate(`/order-success?orderId=${orderId}&table=${encodeURIComponent(currentTable)}`);
    }
    // 导航后 isSubmitting 由组件卸载自然重置，不需要 setTimeout
  };

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7] max-w-lg mx-auto relative">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-[10px] bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-[18px] font-bold text-gray-900">{t('confirmOrder') || 'Confirm Order'}</h1>
          <p className="text-[12px] text-gray-400">{t('table') || 'Table'} {currentTable}</p>
        </div>
      </div>

      {/* Content */}
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <span className="text-5xl mb-4">🛒</span>
          <p className="text-[15px] font-medium">{t('cartEmpty') || 'Cart is empty'}</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 h-10 px-6 rounded-[12px] bg-[#E53935] text-white text-[14px] font-semibold hover:bg-[#C62828] transition"
          >
            {t('backToMenu') || 'Back to Menu'}
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Items */}
          <div className="px-4 py-3 space-y-2">
            {cart.map((ci) => (
              <div
                key={ci.id}
                className="flex gap-3 bg-white rounded-[14px] p-3 shadow-sm border border-gray-50"
              >
                {/* Image */}
                <div className="w-[64px] h-[64px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={ci.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-1">
                    {localizedText(ci.name, language)}
                  </h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    ¥{ci.price.toFixed(2)} x {ci.quantity}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => ci.quantity > 1 ? updateQuantity(ci.id, ci.quantity - 1) : removeFromCart(ci.id)}
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition text-[16px] leading-none"
                      >
                        {ci.quantity > 1 ? '−' : '🗑'}
                      </button>
                      <span className="text-[14px] font-semibold text-gray-800 min-w-[20px] text-center">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#E53935] flex items-center justify-center text-white hover:bg-[#C62828] transition text-[16px] leading-none disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={ci.quantity >= 99}
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <span className="text-[15px] font-bold text-[#E53935]">
                      ¥{(ci.price * ci.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Remark */}
          <div className="px-4 py-3">
            <div className="bg-white rounded-[14px] p-4 shadow-sm border border-gray-50">
              <p className="text-[13px] font-semibold text-gray-700 mb-2">{t('remark') || 'Remark'}</p>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={t('remarkPlaceholder') || 'Add a note...'}
                className="w-full h-10 px-3 rounded-[10px] bg-[#F3F3F3] text-[14px] text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-[#E53935]/20 transition"
              />
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-28" />
        </div>
      )}

      {/* Bottom Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] z-50">
          <div className="flex items-center px-4 py-3 gap-3 max-w-lg mx-auto">
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-gray-400">{t('total') || 'Total'} ({cartCount} items)</p>
              <p className="text-[20px] font-bold text-gray-900">¥{cartTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-[52px] px-8 rounded-[14px] bg-[#E53935] text-white text-[15px] font-semibold hover:bg-[#C62828] active:scale-95 shadow-md shadow-red-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '...' : (t('submitOrder') || 'Submit Order')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}