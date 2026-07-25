import { NavLink, Outlet, useNavigate } from 'react-router-dom';

/**
 * 管理员后台布局
 * - 左侧菜单导航（桌面）
 * - 顶部商店名称 + 退出按钮（移动端）
 * - 底部导航（移动端）
 * - 无顾客底部导航
 */
export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-green-50 text-green-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边菜单（桌面） */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 p-4">
        {/* 商店名称 */}
        <div className="flex items-center gap-3 px-4 py-5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white text-lg font-bold">
            T
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">TableGo</h1>
            <p className="text-xs text-gray-400">Merchant Dashboard</p>
          </div>
        </div>

        {/* 菜单导航 */}
        <nav className="flex-1 flex flex-col gap-1">
          <NavLink to="/admin/dashboard" end className={linkClass}>
            <span className="text-lg">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/admin/dashboard/orders" className={linkClass}>
            <span className="text-lg">📋</span>
            订单管理
          </NavLink>
          <NavLink to="/admin/dashboard/menu" className={linkClass}>
            <span className="text-lg">🍽️</span>
            菜单管理
          </NavLink>
          <NavLink to="/admin/dashboard/tables" className={linkClass}>
            <span className="text-lg">🪑</span>
            桌号管理
          </NavLink>
          <NavLink to="/admin/dashboard/settings" className={linkClass}>
            <span className="text-lg">⚙️</span>
            设置
          </NavLink>
        </nav>

        {/* 退出按钮 */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors mt-2"
        >
          <span className="text-lg">🚪</span>
          退出登录
        </button>
      </aside>

      {/* 移动端顶部导航 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white text-sm font-bold">
            T
          </div>
          <span className="font-bold text-gray-800">TableGo</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-500 font-medium">
          退出
        </button>
      </div>

      {/* 移动端底部导航 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">📊</span>
            <span>首页</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/orders"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">📋</span>
            <span>订单</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/menu"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">🍽️</span>
            <span>菜单</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/tables"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">🪑</span>
            <span>桌号</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg">⚙️</span>
            <span>设置</span>
          </NavLink>
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="flex-1 md:ml-0 pt-14 md:pt-0 pb-16 md:pb-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}