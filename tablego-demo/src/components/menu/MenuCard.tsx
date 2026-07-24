import { useState } from 'react';
import type { MenuItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';
import { formatPrice } from '../../hooks/useFormat';

interface Props {
  item: MenuItem;
}

/**
 * 单个菜品卡片
 * 显示：图片占位、名称、描述、价格、加购按钮
 * 点击加购后按钮变为"已加入"状态，0.6秒恢复
 */
export default function MenuCard({ item }: Props) {
  const { t } = useLanguage();
  const { addToCart } = useOrder();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform duration-150">
      {/* 图片占位区 */}
      <div className="image-placeholder h-32 w-full">
        <span className="text-3xl">
          {/* 根据分类展示不同 emoji */}
          {item.categoryId === 'coffee' && '☕'}
          {item.categoryId === 'tea' && '🧋'}
          {item.categoryId === 'dessert' && '🍰'}
          {item.categoryId === 'food' && '🍜'}
        </span>
      </div>

      {/* 内容区 */}
      <div className="p-3.5">
        {/* 标题行：名称 + 热门标签 */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-800 leading-tight flex-1">
            {t(item.nameKey)}
          </h3>
          {item.popular && (
            <span className="shrink-0 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {t('menu.popular')}
            </span>
          )}
        </div>

        {/* 描述 */}
        <p className="text-xs text-gray-500 mb-2.5 line-clamp-2">
          {t(item.descriptionKey)}
        </p>

        {/* 底行：价格 + 按钮 */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-green-700">
            {formatPrice(item.price)}
          </span>

          <button
            onClick={handleAdd}
            disabled={added}
            className={`
              px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${
                added
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }
            `}
          >
            {added ? `✓ ${t('menu.added')}` : t('menu.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}