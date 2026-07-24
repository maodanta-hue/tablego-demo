import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';

/**
 * 应用整体布局
 * - 顶部：返回按钮 + 标题
 * - 中间：页面内容（Outlet）
 * - 底部：导航栏（顾客端有购物车入口，老板端有订单管理入口）
 */
export default function AppLayout() {
  const { t } = useLanguage();
  const { cartCount } = useOrder();
  const location = useLocation();

  // 判断当前是否在老板端
  const isOwner = location.pathname.startsWith('/owner');

  // 判断是否需要显示返回按钮（子页面）
  const showBack = location.pathname !== '/';

  return (
    <div className="phone-container safe-area-bottom flex flex-col">
      {/* ===== 顶部栏 ===== */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && (
              <NavLink
                to="/"
                className="text-gray-500 hover:text-gray-700 active:scale-90 transition-transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </NavLink>
            )}
            <span className="text-base font-bold text-gray-800">
              {t('app.name')}
            </span>
          </div>

          {/* 老板端入口 */}
          <NavLink
            to={isOwner ? '/' : '/owner'}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isOwner ? t('welcome.start') : '👨‍💼'}
          </NavLink>
        </div>
      </header>

      {/* ===== 页面内容 ===== */}
      <main className="flex-1 overflow-y-auto">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

      {/* ===== 底部导航（仅顾客端显示）===== */}
      {!isOwner && (
        <nav className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-2">
          <div className="flex items-center justify-around max-w-xs mx-auto">
            {/* 菜单 */}
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg text-xs transition-colors ${
                  isActive ? 'text-green-600 font-semibold' : 'text-gray-400'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{t('menu.title')}</span>
            </NavLink>

            {/* 购物车（带数量徽标） */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg text-xs transition-colors relative ${
                  isActive ? 'text-green-600 font-semibold' : 'text-gray-400'
                }`
              }
            >
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9" />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </div>
              <span>{t('cart.title')}</span>
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
}