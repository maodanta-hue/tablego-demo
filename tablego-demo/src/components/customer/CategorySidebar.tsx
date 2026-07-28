/**
 * CategorySidebar — 左侧分类栏（商业级）
 * 
 * 风格：品牌主色系（参考蜜雪冰城/瑞幸）
 * - 宽度 80px，固定，白色背景
 * - 选中态：左侧主色竖条 + 主色浅背景
 * - 图标 24px，文字 Caption 12px
 */
import { useLanguage } from '../../context/LanguageContext';
import { localizedText } from '../../utils/i18n';
import type { MenuCategory } from '../../types';

interface Props {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategorySidebar({ categories, activeId, onSelect }: Props) {
  const { language } = useLanguage();
  return (
    <div className="w-[80px] flex-shrink-0 bg-white border-r border-[#EEEEF0] overflow-y-auto scrollbar-hide">
      <div className="py-3">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`
                relative flex flex-col items-center justify-center py-4 px-2 cursor-pointer
                transition-all duration-150 select-none
                ${isActive ? 'bg-[#E8F5E9]' : 'hover:bg-[#F8F9FA]'}
              `}
            >
              {/* Active Indicator — 左侧红色竖线 */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[#1A6B3C] rounded-r-full" />
              )}
              {/* Icon */}
              <span
                className={`
                  text-xl mb-1.5 transition-transform duration-150
                  ${isActive ? 'scale-110' : ''}
                `}
              >
                {cat.icon}
              </span>
              {/* Name */}
              <span
                className={`
                  text-[12px] leading-tight text-center max-w-[68px] truncate transition-colors duration-150
                  ${isActive
                    ? 'font-bold text-[#1A6B3C]'
                    : 'font-medium text-[#4A4A5A]'
                  }
                `}
              >
                  {localizedText(cat.name, language)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}