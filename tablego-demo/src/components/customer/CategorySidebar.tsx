/**
 * CategorySidebar — 左侧分类栏
 * 
 * 风格：微信点餐风格
 * - 宽度 92px，固定，白色背景
 * - 竖向排列，分类之间留出适当间距
 * - 当前分类左侧红色竖线，文字加粗红色
 * - 不使用按钮样式，像微信点餐一样
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
    <div className="w-[92px] flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto scrollbar-hide">
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
                ${isActive ? 'bg-[#FFF5F5]' : 'hover:bg-gray-50'}
              `}
            >
              {/* Active Indicator — 左侧红色竖线 */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[#E53935] rounded-r-full" />
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
                    ? 'font-bold text-[#E53935]'
                    : 'font-medium text-gray-600'
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