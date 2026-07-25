/**
 * CategorySidebar — 左侧分类栏
 * 模仿微信点餐风格：竖向排列、白色背景、当前分类左侧红色竖线
 */
import type { MenuCategory } from '../../types';

interface Props {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategorySidebar({ categories, activeId, onSelect }: Props) {
  return (
    <div className="w-[92px] flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto">
      <div className="py-2">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="w-full text-left relative"
            >
              <div
                className={`
                  flex flex-col items-center justify-center py-4 px-2 transition-colors
                  ${isActive ? 'bg-red-50/50' : 'hover:bg-gray-50'}
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[#E53935] rounded-r-full" />
                )}
                {/* Icon */}
                <span className={`text-xl mb-1 ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {cat.icon}
                </span>
                {/* Name */}
                <span
                  className={`
                    text-[12px] leading-tight text-center max-w-[70px] truncate
                    ${isActive ? 'font-bold text-[#E53935]' : 'font-medium text-gray-600'}
                  `}
                >
                  {cat.name.zh || cat.name.en}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}