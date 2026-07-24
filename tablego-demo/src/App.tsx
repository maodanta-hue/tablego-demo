import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { OrderProvider } from './context/OrderContext';
import AppLayout from './components/layout/AppLayout';
import WelcomePage from './pages/WelcomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OwnerPage from './pages/OwnerPage';

/**
 * 应用根组件
 * - 包裹两个全局 Context（语言、订单）
 * - 路由配置
 */
export default function App() {
  return (
    <LanguageProvider>
      <OrderProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/owner" element={<OwnerPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </LanguageProvider>
  );
}