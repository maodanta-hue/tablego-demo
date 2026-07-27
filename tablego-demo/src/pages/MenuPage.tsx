/**
 * MenuPage — 顾客端主页面（扫码点单）
 * 布局：RestaurantHeader -> Tab(Menu/MyOrders) -> CategorySidebar + ProductList + BottomCart
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';
import { getCategories } from '../store/categoryStore';
import { getMenuItemsByCategory } from '../store/menuStore';
import { getOrdersByTable } from '../store/orderStore';
import RestaurantHeader from '../components/customer/RestaurantHeader';
import CategorySidebar from '../components/customer/CategorySidebar';
import ProductCard from '../components/customer/ProductCard';
import BottomCart from '../components/customer/BottomCart';
import OrderCard from '../components/customer/OrderCard';
import SpecModal from '../components/ui/SpecModal';
import type { MenuItem } from '../types/menu';
import type { CartTopping } from '../types/cart';

export default function MenuPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart, cartCount, currentTable } = useOrder();

  // Tab state
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');

  // Categories
  const categories = getCategories();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // 规格弹窗状态
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  const productListRef = useRef<HTMLDivElement>(null);

  // Get current category items
  const categoryItems = getMenuItemsByCategory(activeCategory);

  // Get orders for current table
  const tableOrders = getOrdersByTable(currentTable);

  // Scroll to top when category changes
  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // Add to cart with animation
  const handleAddToCart = useCallback((item: MenuItem) => {
    // 打开规格选择弹窗
    setSelectedItem(item);
    setIsSpecModalOpen(true);
  }, []);

  // 实际添加到购物车的处理
  const handleAddToCartWithSpec = useCallback((item: MenuItem, quantity: number, options: {
    temperature?: string;
    sugar?: string;
    toppings?: CartTopping[];
  }) => {
    addToCart(item, quantity, options);
  }, [addToCart]);

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7] max-w-lg mx-auto relative">
      {/* ① Restaurant Header */}
      <RestaurantHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ② + ③ + ④ Content Area */}
      {activeTab === 'menu' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-50">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchMenu') || 'Search menu...'}
                className="w-full h-12 pl-9 pr-4 rounded-[12px] bg-[#F3F3F3] text-[15px] text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-[#E53935]/20 transition-all"
              />
            </div>
          </div>

          {/* Category + Product Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* ③ Category Sidebar */}
            {!searchQuery && (
              <CategorySidebar
                categories={categories}
                activeId={activeCategory}
                onSelect={(id) => {
                  setActiveCategory(id);
                  setSearchQuery('');
                }}
              />
            )}

            {/* ④ Product List */}
            <div ref={productListRef} className="flex-1 overflow-y-auto bg-white">
              {searchQuery ? (
                /* Search mode - full width list */
                <div className="divide-y divide-gray-50">
                  {categories.flatMap((cat) => getMenuItemsByCategory(cat.id))
                    .filter(
                      (item) =>
                        item.name.zh.includes(searchQuery) ||
                        item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.name.vi.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  {categories.flatMap((cat) => getMenuItemsByCategory(cat.id)).filter(
                    (item) =>
                      item.name.zh.includes(searchQuery) ||
                      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.name.vi.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <span className="text-4xl mb-3">🔍</span>
                      <p className="text-[14px]">{t('noResults') || 'No results found'}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Normal category list */
                <div className="divide-y divide-gray-50">
                  {categoryItems.filter((item) => item.available).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <span className="text-4xl mb-3">🍽️</span>
                      <p className="text-[14px]">{t('noItems') || 'No items'}</p>
                    </div>
                  ) : (
                    categoryItems
                      .filter((item) => item.available)
                      .map((item) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          onAddToCart={handleAddToCart}
                        />
                      ))
                  )}
                  {/* Bottom padding for BottomCart */}
                  <div className="h-24" />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* My Orders Tab */
        <div className="flex-1 overflow-y-auto bg-[#F7F7F7]">
          {tableOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-[15px] font-medium">{t('noOrders') || 'No orders yet'}</p>
              <p className="text-[13px] mt-1">{t('orderHint') || 'Your orders will appear here'}</p>
            </div>
          ) : (
            <div className="py-3">
              {[...tableOrders].reverse().map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              <div className="h-24" />
            </div>
          )}
        </div>
      )}

      {/* ⑤ Bottom Cart - only on menu tab */}
      {activeTab === 'menu' && cartCount > 0 && (
        <BottomCart onReviewOrder={() => navigate('/cart')} />
      )}
      
      {/* 规格选择弹窗 */}
      {selectedItem && (
        <SpecModal
          item={selectedItem}
          open={isSpecModalOpen}
          onClose={() => setIsSpecModalOpen(false)}
          onAddToCart={handleAddToCartWithSpec}
        />
      )}
    </div>
  );
}
