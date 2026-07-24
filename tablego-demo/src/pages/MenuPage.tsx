import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { categories, getMenuItemsByCategory } from '../data/menu';
import MenuCard from '../components/menu/MenuCard';

/**
 * 菜单页
 * - 分类 Tab 切换（Coffee / Tea / Dessert / Food）
 * - 每个分类下显示对应菜品
 * - 支持加入购物车
 */
export default function MenuPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filteredItems = getMenuItemsByCategory(activeCategory);

  return (
    <div className="px-4 py-4">
      {/* 页面标题 */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t('menu.title')}</h2>

      {/* 分类 Tab */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
              whitespace-nowrap transition-all duration-200
              ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{t(cat.key)}</span>
          </button>
        ))}
      </div>

      {/* 菜品网格 */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      {/* 空状态提醒 */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          {t('cart.empty')}
        </div>
      )}
    </div>
  );
}