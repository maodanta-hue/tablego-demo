import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { OrderProvider } from './context/OrderContext';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './pages/admin/AdminLayout';

// 路由懒加载 — 按需加载页面组件，减小首屏 bundle
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const MenuDetailPage = lazy(() => import('./pages/MenuDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OwnerPage = lazy(() => import('./pages/OwnerPage'));
const TableEntryPage = lazy(() => import('./pages/TableEntryPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const MenuManagePage = lazy(() => import('./pages/admin/MenuManagePage'));
const TablesPage = lazy(() => import('./pages/admin/TablesPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

/** 路由切换时的全局 loading 占位 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F8F9FA]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#1A6B3C]/20 border-t-[#1A6B3C] rounded-full animate-spin" />
        <p className="text-[14px] text-[#9A9AAB] font-medium">Loading…</p>
      </div>
    </div>
  );
}

/**
 * 应用根组件
 * - 包裹全局 Context（语言、订单）
 * - 路由配置
 * - 顾客端使用 AppLayout（含底部导航）
 * - 商家端使用 AdminLayout（含侧边栏/顶部导航）
 */
export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <OrderProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* 扫码入口：/table/:tableNo → 自动跳转 /menu?table=:tableNo */}
              <Route path="/table/:tableNo" element={<TableEntryPage />} />

              {/* 顾客端页面 — 独立布局（每个页面自带 Header/Footer） */}
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu/:menuItemId" element={<MenuDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />

              {/* 通用页面（使用 AppLayout 含底部导航） */}
              <Route element={<AppLayout />}>
                <Route path="/owner" element={<OwnerPage />} />
              </Route>

              {/* WelcomePage 独立布局（无底部导航） */}
              <Route path="/" element={<WelcomePage />} />

              {/* 管理员登录页（独立布局，无底部导航） */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* 管理员后台（使用 AdminLayout 侧边栏布局） */}
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu" element={<MenuManagePage />} />
                <Route path="tables" element={<TablesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </OrderProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
