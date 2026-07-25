/**
 * ProductCard — 商品卡片
 * 左侧图片 + 右侧信息（名称、简介、销量、价格）+ 右下加入按钮
 * 图片统一 100×100、圆角、object-fit: cover
 */
import { useState } from 'react';
import type { MenuItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';

interface Props {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function ProductCard({ item, onAddToCart }: Props) {
  const { t, language } = useLanguage();
  const { cart } = useOrder();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Get quantity from cart
  const cartItem = cart.find((ci) => ci.menuItemId === item.id);
  const qty = cartItem?.quantity ?? 0;
  const name = item.name[language] || item.name.zh || item.name.en;
  const desc = item.description?.[language] || item.description?.zh || item.description?.en || '';
  // Generate sold count
  const sold = typeof item.sold === 'number' ? item.sold : (item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 300 + 50);
  const price = item.price ?? 0;

  const handleAdd = () => {
    onAddToCart(item);
    setAnimKey((k) => k + 1);
  };

  // Determine if item is available
  if (!item.available) {
    return (
      <div className="flex gap-3 py-3 px-4 border-b border-gray-50 opacity-50">
        <div className="flex-shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden bg-gray-200">
          <img src={item.image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <h3 className="text-[18px] font-bold text-gray-400 leading-tight truncate">{name}</h3>
          <p className="text-[13px] text-gray-300 mt-0.5">{t('unavailable') || '暂时售罄'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3 px-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
      {/* Image */}
      <div className="flex-shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden bg-gray-100 relative">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={item.image}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* Name */}
        <h3 className="text-[18px] font-bold text-gray-900 leading-tight truncate">
          {name}
        </h3>

        {/* Description */}
        {desc && (
          <p className="text-[13px] text-gray-400 leading-snug line-clamp-2 mt-0.5">
            {desc}
          </p>
        )}

        {/* Bottom Row: Sold + Price + Add Button */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            {/* Sold */}
            <p className="text-[12px] text-gray-400">
              {t('sold') || 'Sold'} {sold}
            </p>
            {/* Price */}
            <p className="text-[16px] font-bold text-[#E53935] mt-0.5">
              ¥{price.toFixed(2)}
            </p>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            key={animKey}
            className={`
              relative w-[72px] h-[32px] rounded-lg text-[13px] font-semibold transition-all duration-200 active:scale-95
              ${qty > 0
                ? 'bg-[#E53935] text-white shadow-sm shadow-red-200'
                : 'bg-[#E53935] text-white hover:bg-[#d32f2f]'
              }
            `}
          >
            {qty > 0 ? (
              <span className="flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('added') || 'Added'}
              </span>
            ) : (
              t('add') || 'Add'
            )}
            {qty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce-in">
                {qty}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}