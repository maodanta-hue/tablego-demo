import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';
import CartItemRow from '../components/cart/CartItemRow';
import { formatPrice } from '../hooks/useFormat';

/**
 * 购物车页
 * - 展示购物车所有商品
 * - 支持加减数量
 * - 显示桌号输入（默认 A1）
 * - 提交订单
 */
export default function CartPage() {
  const { t } = useLanguage();
  const { cart, cartTotal, cartCount, submitOrder } = useOrder();
  const navigate = useNavigate();
  const [tableNo, setTableNo] = useState('A1');

  const handleSubmit = () => {
    if (cart.length === 0) return;
    submitOrder(tableNo.trim() || 'A1');
    navigate('/order-success');
  };

  return (
    <div className="px-4 py-4">
      {/* 页面标题 */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t('cart.title')}</h2>

      {cart.length === 0 ? (
        /* 空购物车 */
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-4">🛒</span>
          <p className="text-sm font-medium mb-1">{t('cart.empty')}</p>
          <p className="text-xs">{t('cart.emptyHint')}</p>
        </div>
      ) : (
        <>
          {/* 桌号输入 */}
          <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-gray-600">{t('cart.tableNo')}:</span>
            <input
              type="text"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold text-gray-800 outline-none"
              placeholder="e.g. A1, Table 5"
            />
          </div>

          {/* 商品列表 */}
          <div className="bg-white rounded-xl border border-gray-100 px-4 mb-4">
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* 总计 + 提交按钮 */}
          <div className="sticky bottom-0 bg-white pt-2 pb-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm text-gray-500">
                {cartCount} {cartCount > 1 ? t('cart.items') : t('cart.item')}
              </span>
              <span className="text-lg font-bold text-green-700">
                {t('cart.total')}: {formatPrice(cartTotal)}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-green-600 text-white text-base font-bold rounded-2xl
                         shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.97]
                         transition-all duration-200"
            >
              {t('cart.checkout')} — {formatPrice(cartTotal)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}