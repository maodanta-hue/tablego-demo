/**
 * ProductCard — 柠香小筑商品卡片
 *
 * 布局：左图（80x80，圆角 12px）+ 右信息
 * - 名称：16px SemiBold
 * - 分类标签：12px 灰色
 * - 价格：16px Bold #E53935，格式 "¥13.00起"
 * - "选规格" 按钮：红色边框/填充，圆角 8px，文字 13px
 * 卡片间距 8px，分割线 #F0F0F0
 */
import type { MenuItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizedText } from '../../utils/i18n';

interface Props {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

/** 根据分类 ID 返回 emoji 占位图 */
function categoryEmoji(categoryId: string): string {
  const map: Record<string, string> = {
    coffee: '☕',
    tea: '🍵',
    milktea: '🧋',
    dessert: '🍰',
    food: '🍜',
    drink: '🥤',
  };
  return map[categoryId] || '🍽️';
}

export default function ProductCard({ item, onAddToCart }: Props) {
  const { t, language } = useLanguage();

  if (!item.available) {
    return (
      <div className="flex gap-3 py-3 px-4 border-b border-[#F0F0F0] opacity-50">
        <div className="w-[80px] h-[80px] rounded-[12px] bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{categoryEmoji(item.categoryId)}</span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-[16px] font-semibold text-[#999999] truncate">
            {localizedText(item.name, language)}
          </h3>
          <p className="text-[13px] text-[#CCCCCC] mt-0.5">
            {t('unavailable') || 'Đã hết'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3 px-4 border-b border-[#F0F0F0] last:border-b-0">
      {/* === 左图 80×80 === */}
      <div className="w-[80px] h-[80px] rounded-[12px] overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={localizedText(item.name, language)}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-4xl">{categoryEmoji(item.categoryId)}</span>
        )}
      </div>

      {/* === 右信息 === */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* 名称 */}
        <h3 className="text-[16px] font-semibold text-[#1A1A1A] leading-tight truncate">
          {localizedText(item.name, language)}
        </h3>

        {/* 分类标签（从 categoryId 映射） */}
        <p className="text-[12px] text-[#999999] mt-0.5">
          {getCategoryLabel(item.categoryId, t)}
        </p>

        {/* 底部：价格 + 按钮 */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[16px] font-bold text-[#E53935]">
            {t('app.currency')}{item.price.toLocaleString()}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="px-4 py-1.5 rounded-[8px] text-[13px] font-semibold
                       border border-[#E53935] text-[#E53935] bg-white
                       hover:bg-[#E53935] hover:text-white
                       active:scale-95 transition-all duration-150"
          >
            {t('selectSpec') || 'Chọn'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** 分类 ID → 多语言标签 */
function getCategoryLabel(categoryId: string, t: (key: string) => string): string {
  const keyMap: Record<string, string> = {
    coffee: 'categoryCoffee',
    tea: 'categoryTea',
    milktea: 'categoryMilkTea',
    dessert: 'categoryDessert',
    food: 'categoryFood',
    drink: 'categoryDrink',
  };
  const key = keyMap[categoryId];
  return key ? t(key) : categoryId;
}