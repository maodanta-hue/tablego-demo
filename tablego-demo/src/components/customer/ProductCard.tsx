/**
 * ProductCard — 商业级商品卡片（美团/饿了么外卖风格）
 *
 * 布局：左图（80×80，圆角 L/16px）+ 右信息
 * - 名称：18px Bold 文字主色 #1A1A2E
 * - 分类标签：12px 文字灰 #9A9AAB
 * - 月售 + 推荐理由：12px 文字灰
 * - 价格：20px Bold 强调色 #D84315
 * - "选规格" 按钮：主色填充，圆角 M/12px
 */
import { useMemo } from 'react';
import type { MenuItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizedText } from '../../utils/i18n';

interface Props {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

// 根据商品 id 生成稳定的随机月售数据
const getSalesData = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sales = 50 + (hash % 450);
  const rank = (hash % 5) + 1;
  const reasons = [
    '门店销量第 1 名',
    '回头客推荐',
    '物有所值',
    '味道鲜美',
    '人气爆款',
  ];
  return {
    sales: `${sales}+`,
    reason: reasons[rank % reasons.length],
  };
};

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

function getCategoryLabel(
  categoryId: string,
  t: (key: string) => string,
): string {
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

export default function ProductCard({ item, onAddToCart }: Props) {
  const { t, language } = useLanguage();
  const salesData = useMemo(() => getSalesData(item.id), [item.id]);

  if (!item.available) {
    return (
      <div className="flex gap-4 py-4 px-4 border-b border-[#EEEEF0] opacity-50">
        <div className="w-[80px] h-[80px] rounded-[16px] bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{categoryEmoji(item.categoryId)}</span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-[18px] font-bold text-[#9A9AAB] truncate">
            {localizedText(item.name, language)}
          </h3>
          <p className="text-[13px] text-[#BDBDC5] mt-0.5">
            {t('unavailable') || 'Đã hết'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 px-4 border-b border-[#EEEEF0] last:border-b-0 bg-white hover:bg-[#F8F9FA]/50 transition-colors">
      {/* 左图 80×80 — 圆角 L/16px */}
      <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden bg-[#F0F0F0] flex-shrink-0 flex items-center justify-center">
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
          <span className="text-3xl">{categoryEmoji(item.categoryId)}</span>
        )}
      </div>

      {/* 右信息区 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* 名称 — 18px Bold */}
        <h3 className="text-[18px] font-bold text-[#1A1A2E] leading-tight truncate">
          {localizedText(item.name, language)}
        </h3>

        {/* 分类标签 — Caption 12px */}
        <p className="text-[12px] text-[#9A9AAB] mt-0.5">
          {getCategoryLabel(item.categoryId, t)}
        </p>

        {/* 月售 + 推荐理由 — 12px 文字灰 */}
        <p className="text-[12px] text-[#9A9AAB] mt-0.5">
          月售 {salesData.sales} · {salesData.reason}
        </p>

        {/* 底部：价格 + 按钮 */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[20px] font-bold text-[#D84315]">
            {t('app.currency')}
            {item.price.toLocaleString()}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="px-4 py-1.5 rounded-[12px] text-[13px] font-semibold
                       bg-[#1A6B3C] text-white
                       hover:bg-[#0D4A2A]
                       active:scale-95 transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            {t('selectSpec') || 'Chọn'}
          </button>
        </div>
      </div>
    </div>
  );
}