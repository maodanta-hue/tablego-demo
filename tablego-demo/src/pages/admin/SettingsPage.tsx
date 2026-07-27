/**
 * 商家后台 - 设置页面
 * 支持：餐厅设置（Logo/名称/描述/地址/电话/营业时间）+ 分类管理（新增/编辑/删除/排序）
 */
import { useState } from 'react';
import { getRestaurantInfo, saveRestaurantInfo } from '../../store/restaurantStore';
import { getCategories, saveCategoriesList } from '../../store/categoryStore';
import { generateId } from '../../store/menuStore';
import { getMenuItems } from '../../store/menuStore';
import type { RestaurantInfo } from '../../store/restaurantStore';
import type { MenuCategory, MultiLangText } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../types';

function getLocalName(name: MultiLangText, lang: Language): string {
  const map: Record<string, string> = { zh: name.zh, en: name.en, vi: name.vi, ko: (name as any).ko ?? name.en, ja: (name as any).ja ?? name.en };
  return map[lang] || name.en;
}

export default function SettingsPage() {
  const { language } = useLanguage();
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(() => getRestaurantInfo());
  const [categories, setCategories] = useState<MenuCategory[]>(() => getCategories());
  const [activeSection, setActiveSection] = useState<'restaurant' | 'categories'>('restaurant');
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);

  // ===== Restaurant =====
  const handleRestaurantSave = () => {
    saveRestaurantInfo(restaurant);
  };

  // ===== Categories =====
  const handleCatSave = (cat: MenuCategory) => {
    const all = [...categories];
    const idx = all.findIndex((c) => c.id === cat.id);
    if (idx >= 0) all[idx] = cat;
    else all.push(cat);
    saveCategoriesList(all);
    setCategories(all);
    setShowCatForm(false);
    setEditingCat(null);
  };

  const handleCatDelete = (id: string) => {
    // 检查分类下是否有商品
    const items = getMenuItems();
    const hasProducts = items.some((item) => item.categoryId === id);
    if (hasProducts) {
      alert('Please remove products from this category first.');
      return;
    }
    const all = categories.filter((c) => c.id !== id);
    saveCategoriesList(all);
    setCategories(all);
  };

  const handleCatMoveUp = (index: number) => {
    if (index <= 0) return;
    const all = [...categories];
    [all[index - 1], all[index]] = [all[index], all[index - 1]];
    saveCategoriesList(all);
    setCategories(all);
  };

  const handleCatMoveDown = (index: number) => {
    if (index >= categories.length - 1) return;
    const all = [...categories];
    [all[index], all[index + 1]] = [all[index + 1], all[index]];
    saveCategoriesList(all);
    setCategories(all);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">设置</h2>

      {/* Section Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveSection('restaurant')}
          className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
            activeSection === 'restaurant'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🏪 餐厅设置
        </button>
        <button
          onClick={() => setActiveSection('categories')}
          className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
            activeSection === 'categories'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📂 分类管理
        </button>
      </div>

      {/* ========== Restaurant Settings ========== */}
      {activeSection === 'restaurant' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[15px] font-semibold text-gray-800 mb-4">基本信息</h3>
            <div className="space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5">Logo (emoji/text)</label>
                <input
                  value={restaurant.logo}
                  onChange={(e) => setRestaurant({ ...restaurant, logo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] text-gray-500 mb-1.5">中文名</label>
                  <input
                    value={restaurant.name.zh}
                    onChange={(e) => setRestaurant({ ...restaurant, name: { ...restaurant.name, zh: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-gray-500 mb-1.5">English</label>
                  <input
                    value={restaurant.name.en}
                    onChange={(e) => setRestaurant({ ...restaurant, name: { ...restaurant.name, en: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-gray-500 mb-1.5">Tiếng Việt</label>
                  <input
                    value={restaurant.name.vi}
                    onChange={(e) => setRestaurant({ ...restaurant, name: { ...restaurant.name, vi: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5">中文描述</label>
                <textarea
                  value={restaurant.description.zh}
                  onChange={(e) => setRestaurant({ ...restaurant, description: { ...restaurant.description, zh: e.target.value } })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[15px] font-semibold text-gray-800 mb-4">联系信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5">地址</label>
                <input
                  value={restaurant.address}
                  onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5">电话</label>
                <input
                  value={restaurant.phone}
                  onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
                />
              </div>
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5">营业状态</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restaurant.open}
                    onChange={(e) => setRestaurant({ ...restaurant, open: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#E53935]"
                  />
                  <span className="text-sm text-gray-700">营业中</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleRestaurantSave}
            className="w-full h-12 rounded-2xl bg-[#E53935] text-white text-[15px] font-semibold hover:bg-[#C62828] active:scale-[0.98] shadow-sm shadow-red-200 transition-all"
          >
            保存餐厅设置
          </button>
        </div>
      )}

      {/* ========== Categories Management ========== */}
      {activeSection === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{categories.length} 个分类</p>
            <button
              onClick={() => { setEditingCat(null); setShowCatForm(true); }}
              className="px-4 py-2 rounded-xl bg-[#E53935] text-white text-[13px] font-semibold hover:bg-[#C62828] active:scale-95 shadow-sm shadow-red-200 transition-all"
            >
              + 新增分类
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {categories.length === 0 ? (
              <div className="py-16 text-center text-gray-400">暂无分类</div>
            ) : (
              <div>
                {categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {getLocalName(cat.name, language)}
                      </p>
                      <p className="text-[11px] text-gray-400">{cat.id}</p>
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleCatMoveUp(idx)}
                        className="w-6 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleCatMoveDown(idx)}
                        className="w-6 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    <button
                      onClick={() => { setEditingCat(cat); setShowCatForm(true); }}
                      className="px-3 py-1.5 text-[12px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleCatDelete(cat.id)}
                      className="px-3 py-1.5 text-[12px] font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCatForm && (
        <CategoryFormModal
          cat={editingCat}
          language={language}
          onSave={handleCatSave}
          onClose={() => { setShowCatForm(false); setEditingCat(null); }}
        />
      )}
    </div>
  );
}

/** 分类表单弹窗 */
function CategoryFormModal({
  cat,
  onSave,
  onClose,
}: {
  cat: MenuCategory | null;
  language: Language;
  onSave: (cat: MenuCategory) => void;
  onClose: () => void;
}) {
  const [icon, setIcon] = useState(cat?.icon ?? '☕');
  const [nameZh, setNameZh] = useState(cat?.name.zh ?? '');
  const [nameEn, setNameEn] = useState(cat?.name.en ?? '');
  const [nameVi, setNameVi] = useState(cat?.name.vi ?? '');

  const handleSubmit = () => {
    onSave({
      id: cat?.id ?? generateId(),
      icon,
      name: { zh: nameZh, en: nameEn || nameZh, vi: nameVi || nameZh },
    });
  };

  const emojiOptions = ['☕', '🍵', '🧋', '🍰', '🍜', '🥗', '🥤', '🍹', '🍔', '🍕', '🥩', '🍣'];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-5">
          {cat ? '编辑分类' : '新增分类'}
        </h3>

        <div className="space-y-4">
          {/* Icon */}
          <div>
            <label className="block text-[12px] text-gray-500 mb-2">图标</label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition ${
                    icon === emoji ? 'bg-red-50 ring-2 ring-[#E53935]' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">中文名 *</label>
            <input value={nameZh} onChange={(e) => setNameZh(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">English</label>
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">Tiếng Việt</label>
            <input value={nameVi} onChange={(e) => setNameVi(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-[12px] text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
            取消
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2.5 rounded-[12px] text-sm font-semibold text-white bg-[#E53935] hover:bg-[#C62828] shadow-sm shadow-red-200 transition-all">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}