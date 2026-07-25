/**
 * 商家后台 - 菜单管理页面
 * 支持：新增、编辑、删除、上下架
 */
import { useState } from 'react';
import { getMenuItems, getCategories, saveMenuItemsList, generateId } from '../../store';
import type { MenuItem, MenuCategory } from '../../types';
import type { MultiLangText } from '../../types/menu';
import { formatPrice } from '../../hooks/useFormat';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../types';

function getLocalName(name: MultiLangText, lang: Language): string {
  const map: Record<string, string> = { zh: name.zh, en: name.en, vi: name.vi, ko: (name as any).ko ?? name.en, ja: (name as any).ja ?? name.en };
  return map[lang] || name.en;
}

export default function MenuManagePage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>(() => getMenuItems());
  const [categories] = useState<MenuCategory[]>(() => getCategories());
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.categoryId === selectedCategory);

  const handleSave = (item: MenuItem) => {
    const all = [...items];
    const idx = all.findIndex((i) => i.id === item.id);
    if (idx >= 0) all[idx] = item;
    else all.unshift(item);
    saveMenuItemsList(all);
    setItems(all);
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const all = items.filter((i) => i.id !== id);
    saveMenuItemsList(all);
    setItems(all);
    setShowDeleteConfirm(null);
  };

  const toggleAvailable = (id: string) => {
    const all = items.map((i) =>
      i.id === id ? { ...i, available: !i.available } : i
    );
    saveMenuItemsList(all);
    setItems(all);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">菜单管理</h2>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="px-5 py-2.5 rounded-[12px] bg-[#E53935] text-white text-[14px] font-semibold hover:bg-[#C62828] active:scale-95 shadow-sm shadow-red-200 transition-all"
        >
          + 新增菜品
        </button>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-4 py-2 rounded-[12px] text-[13px] font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#E53935] text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-[12px] text-[13px] font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#E53935] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{getLocalName(cat.name, language)}</span>
          </button>
        ))}
      </div>

      {/* 菜品表格 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">菜品</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">分类</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">价格</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">状态</th>
                <th className="text-center px-4 py-3 text-gray-500 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-gray-400">
                    暂无菜品
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            alt=""
                          />
                          <div>
                            <p className="text-gray-800 font-medium text-[13px]">
                              {getLocalName(item.name, language)}
                            </p>
                            <p className="text-[11px] text-gray-400">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500 text-[12px]">
                          {cat?.icon} {getLocalName(cat?.name!, language)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleAvailable(item.id)}
                          className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full transition ${
                            item.available !== false
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 text-red-500 hover:bg-red-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.available !== false ? 'bg-green-500' : 'bg-red-400'}`}></span>
                          {item.available !== false ? '在售' : '售罄'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => { setEditingItem(item); setShowForm(true); }}
                            className="px-3 py-1.5 text-[12px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className="px-3 py-1.5 text-[12px] font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          language={language}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(null)}>
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-sm text-gray-500 mb-5">确定要删除这个菜品吗？此操作不可撤销。</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#E53935] hover:bg-[#C62828] transition"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 菜单项表单组件 */
function MenuItemForm({
  item,
  categories,
  language,
  onSave,
  onClose,
}: {
  item: MenuItem | null;
  categories: MenuCategory[];
  language: Language;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}) {
  const [nameZh, setNameZh] = useState(item?.name.zh ?? '');
  const [nameEn, setNameEn] = useState(item?.name.en ?? '');
  const [nameVi, setNameVi] = useState(item?.name.vi ?? '');
  const [descZh, setDescZh] = useState(item?.description.zh ?? '');
  const [price, setPrice] = useState(item?.price ?? 25000);
  const [image, setImage] = useState(item?.image ?? '');
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? (categories[0]?.id ?? 'coffee'));
  const [available, setAvailable] = useState(item?.available !== false);
  const [popular, setPopular] = useState(item?.popular ?? false);

  const handleSubmit = () => {
    const menuItem: MenuItem = {
      id: item?.id ?? generateId(),
      name: { zh: nameZh, en: nameEn || nameZh, vi: nameVi || nameZh },
      description: { zh: descZh, en: descZh, vi: descZh },
      price,
      image: image || 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop',
      categoryId,
      available,
      popular,
    };
    onSave(menuItem);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 mx-4 w-full max-w-lg shadow-xl mb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-5">
          {item ? '编辑菜品' : '新增菜品'}
        </h3>

        <div className="space-y-4">
          {/* 名称 */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">中文名 *</label>
              <input value={nameZh} onChange={(e) => setNameZh(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">English</label>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Tiếng Việt</label>
              <input value={nameVi} onChange={(e) => setNameVi(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">中文描述</label>
            <input value={descZh} onChange={(e) => setDescZh(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
          </div>

          {/* 价格 & 图片 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">价格 (¥)</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">图片 URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20" />
            </div>
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">分类</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E53935]/20"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {getLocalName(cat.name, language)}
                </option>
              ))}
            </select>
          </div>

          {/* 开关 */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 rounded accent-[#E53935]" />
              <span className="text-sm text-gray-700">在售</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)}
                className="w-4 h-4 rounded accent-[#E53935]" />
              <span className="text-sm text-gray-700">热门推荐</span>
            </label>
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