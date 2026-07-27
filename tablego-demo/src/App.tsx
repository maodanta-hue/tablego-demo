import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { OrderProvider } from './context/OrderContext';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './pages/admin/AdminLayout';
import WelcomePage from './pages/WelcomePage';
import MenuPage from './pages/MenuPage';
import MenuDetailPage from './pages/MenuDetailPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OwnerPage from './pages/OwnerPage';
import TableEntryPage from './pages/TableEntryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import MenuManagePage from './pages/admin/MenuManagePage';
import TablesPage from './pages/admin/TablesPage';
import SettingsPage from './pages/admin/SettingsPage';

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
        </OrderProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}