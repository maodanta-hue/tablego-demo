/**
 * MenuPage — 柠香小筑顾客端扫码点单
 *
 * 布局：
 * - 顶部固定：RestaurantHeader（餐厅名+桌号+搜索+语言切换+Tab）
 * - 左侧固定：CategorySidebar（分类栏）
 * - 右侧滚动：ProductCard 列表
 * - 底部固定：BottomCart（购物车条）
 * - 规格弹窗：Bottom Sheet 样式
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';
import { getCategories } from '../store/categoryStore';
import { getMenuItemsByCategory } from '../store/menuStore';
import { getOrdersByTable } from '../store/orderStore';
import { localizedText } from '../utils/i18n';
import RestaurantHeader from '../components/customer/RestaurantHeader';
import CategorySidebar from '../components/customer/CategorySidebar';
import ProductCard from '../components/customer/ProductCard';
import BottomCart from '../components/customer/BottomCart';
import OrderCard from '../components/customer/OrderCard';
import SpecModal from '../components/ui/SpecModal';
import type { MenuItem } from '../types/menu';
import type { CartTopping } from '../types/cart';

export default function MenuPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartCount, currentTable, updateTrigger } = useOrder();
  void updateTrigger; // 确保强制更新时底部购物车条价格刷新

  // 页面激活时重新同步 URL 桌号参数（Vercel 生产环境兜底）
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table');
    if (tableParam && tableParam !== currentTable) {
      console.log('MenuPage 检测到桌号不一致:', currentTable, '→', tableParam);
      // currentTable 由 OrderContext 的 useEffect 同步更新，此处仅做检测
    }
  }, [location.search, currentTable]);

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

  // Get all items for search
  const allItems = useMemo(
    () => categories.flatMap((cat) => getMenuItemsByCategory(cat.id)),
    [categories]
  );

  // 多语言搜索过滤
  const filteredSearchItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter((item) =>
      localizedText(item.name, language).toLowerCase().includes(q)
    );
  }, [searchQuery, allItems, language]);

  // Get orders for current table
  const tableOrders = getOrdersByTable(currentTable);

  // Scroll to top when category changes
  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // Add to cart — 打开规格弹窗
  const handleAddToCart = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setIsSpecModalOpen(true);
  }, []);

  // 规格弹窗确认 — 由父组件关闭弹窗
  const handleAddToCartWithSpec = useCallback(
    (
      item: MenuItem,
      quantity: number,
      options: { temperature?: string; sugar?: string; toppings?: CartTopping[] }
    ) => {
      addToCart(item, quantity, options);
      setSelectedItem(null);
      setIsSpecModalOpen(false);
    },
    [addToCart]
  );

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5] max-w-lg mx-auto relative">
      {/* === 顶部固定区域 === */}
      <RestaurantHeader
        tableNo={currentTable}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={setSearchQuery}
      />

      {/* === 主内容区 === */}
      {activeTab === 'menu' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧分类栏 — 固定 */}
          {!searchQuery.trim() && (
            <CategorySidebar
              categories={categories}
              activeId={activeCategory}
              onSelect={(id) => {
                setActiveCategory(id);
                setSearchQuery('');
              }}
            />
          )}

          {/* 右侧商品列表 — 竖向滚动 */}
          <div ref={productListRef} className="flex-1 overflow-y-auto bg-white">
            {searchQuery.trim() ? (
              /* 搜索模式 */
              <div>
                {filteredSearchItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#999999]">
                    <span className="text-4xl mb-3">🔍</span>
                    <p className="text-[14px]">{/* No results — shown in current language via t() but we use inline text */}
                      Không tìm thấy món
                    </p>
                  </div>
                ) : (
                  filteredSearchItems
                    .filter((item) => item.available)
                    .map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))
                )}
              </div>
            ) : (
              /* 正常分类列表 */
              <div>
                {categoryItems.filter((item) => item.available).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#999999]">
                    <span className="text-4xl mb-3">🍽️</span>
                    <p className="text-[14px]">
                      {localizedText(
                        { zh: '暂无商品', en: 'No items', vi: 'Không có món' },
                        language
                      )}
                    </p>
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
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 订单 Tab */
        <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
          {tableOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#999999]">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-[15px] font-medium">
                {localizedText(
                  { zh: '暂无订单', en: 'No orders yet', vi: 'Chưa có đơn hàng' },
                  language
                )}
              </p>
              <p className="text-[13px] mt-1">
                {localizedText(
                  { zh: '您的订单会显示在这里', en: 'Your orders will appear here', vi: 'Đơn hàng của bạn sẽ hiện ở đây' },
                  language
                )}
              </p>
            </div>
          ) : (
            <div className="py-3">
              {[...tableOrders].reverse().map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* === 底部购物车条 — 只在菜单 Tab 有商品时显示 === */}
      {activeTab === 'menu' && cartCount > 0 && (
        <BottomCart onReviewOrder={() => navigate('/cart')} />
      )}

      {/* === 规格弹窗（Bottom Sheet） === */}
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