/**
 * 菜品卡片组件
 * - 展示图片占位、名称（多语言）、描述、价格
 * - 点击"加入"按钮触发 onAdd
 */
import { useLanguage } from '../../context/LanguageContext';
import type { MenuItem, MultiLangText } from '../../types';

interface Props {
  item: MenuItem;
  onAdd: () => void;
}

export default function MenuCard({ item, onAdd }: Props) {
  const { t, language } = useLanguage();

  /** 从 MultiLangText 中获取当前语言的文本 */
  const localizedText = (text: MultiLangText | undefined): string => {
    if (!text) return '';
    // 优先当前语言，逐级 fallback
    switch (language) {
      case 'vi': return text.vi || text.en || text.zh;
      case 'zh': return text.zh || text.en || text.vi;
      case 'en': return text.en || text.vi || text.zh;
      case 'ko': return text.en || text.vi || text.zh; // 韩文 fallback 到英文
      case 'ja': return text.en || text.vi || text.zh; // 日文 fallback 到英文
      default:   return text.en || text.vi || text.zh;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-row items-stretch gap-0 active:scale-[0.99] transition-transform duration-150">
      {/* 左侧图片占位 */}
      <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center rounded-l-xl">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name.en}
            className="w-full h-full object-cover rounded-l-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML =
                `<span class="text-3xl">${getCategoryEmoji(item.categoryId)}</span>`;
            }}
          />
        ) : (
          <span className="text-3xl">{getCategoryEmoji(item.categoryId)}</span>
        )}
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        {/* 名称 */}
        <h3 className="text-sm font-semibold text-gray-800 leading-tight truncate">
          {localizedText(item.name)}
        </h3>

        {/* 描述 */}
        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
            {localizedText(item.description)}
          </p>
        )}

        {/* 价格 + 加入按钮 */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-base font-bold text-green-700">
            {formatPrice(item.price, t('app.currency'))}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all duration-150 shadow-sm"
          >
            + {t('menu.add')}
          </button>
        </div>
      </div>
    </div>
  );
}

/** 根据分类返回对应 emoji */
function getCategoryEmoji(categoryId: string): string {
  const map: Record<string, string> = {
    coffee: '☕',
    tea: '🧋',
    dessert: '🍰',
    food: '🍜',
  };
  return map[categoryId] || '🍽️';
}

/** 简单价格格式化 */
function formatPrice(price: number, currency: string): string {
  return `${currency}${price.toLocaleString()}`;
}