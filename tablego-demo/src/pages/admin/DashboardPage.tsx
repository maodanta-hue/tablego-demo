import { useState, useEffect, useCallback } from 'react';
import { getOrders, addOrder, generateOrderId } from '../../store';
import { getMenuItems } from '../../store/menuStore';
import { seedDemo } from '../../services/storage';
import { subscribe } from '../../services/sync';
import { formatPrice } from '../../hooks/useFormat';
import type { Order, OrderItem } from '../../types';

/** 模拟桌号列表 */
const DEMO_TABLES = ['A01', 'A02', 'B01', 'B02', 'C01', 'C02', 'D01', 'D02'];

/**
 * 商家后台 Dashboard 首页
 * - 今日订单数量、营业额、待处理、占用桌数
 * - 热门商品 Top 5
 * - 最近 5 笔订单
 * - 无数据时友好空状态
 */
export default function DashboardPage() {
  const [orders, setOrders] = useState(() => getOrders());
  const [loading, setLoading] = useState(false);

  // 订阅实时更新
  useEffect(() => {
    const unsub = subscribe<Order[]>('orders', (updatedOrders) => {
      setOrders(updatedOrders);
    });
    return unsub;
  }, []);

  // 页面切换时刷新
  useEffect(() => {
    setOrders(getOrders());
  }, []);

  // 过滤今日订单
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));

  // 统计
  const totalOrders = todayOrders.length;
  const totalRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  // 占用桌数（有未完成订单的桌号去重）
  const occupiedTables = new Set(
    orders
      .filter((o) => o.status !== 'completed')
      .map((o) => o.tableNo),
  ).size;

  // 热门商品统计
  const itemCount: Record<string, { name: string; count: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const id = item.menuItemId;
      if (!itemCount[id]) {
        itemCount[id] = { name: item.name.zh || item.name.en, count: 0 };
      }
      itemCount[id].count += item.quantity;
    });
  });
  const topItems = Object.values(itemCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 最近订单（按时间倒序取 5 条）
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  /** 生成演示数据 */
  const generateDemoData = useCallback(() => {
    setLoading(true);
    let menuItems = getMenuItems().filter((m) => m.available);
    if (menuItems.length === 0) {
      seedDemo();
      menuItems = getMenuItems().filter((m) => m.available);
    }
    if (menuItems.length === 0) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    for (let i = 0; i < 8; i++) {
      const tableIdx = Math.floor(Math.random() * DEMO_TABLES.length);
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const selectedItems: typeof menuItems = [];
      for (let j = 0; j < itemCount; j++) {
        const idx = Math.floor(Math.random() * menuItems.length);
        selectedItems.push(menuItems[idx]);
      }

      const orderItems: OrderItem[] = selectedItems.map((mi) => ({
        menuItemId: mi.id,
        name: { ...mi.name },
        price: mi.price,
        quantity: Math.floor(Math.random() * 2) + 1,
      }));
      const totalPrice = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

      const statuses: Array<'pending' | 'preparing' | 'completed'> = [
        'pending', 'pending', 'preparing', 'preparing', 'completed', 'completed', 'completed',
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      addOrder({
        id: generateOrderId(),
        tableNo: DEMO_TABLES[tableIdx],
        items: orderItems,
        totalPrice,
        status,
        createdAt: new Date(now - Math.random() * 7200000).toISOString(),
        completedAt: status === 'completed' ? new Date().toISOString() : undefined,
      });
    }

    setTimeout(() => {
      setOrders(getOrders());
      setLoading(false);
    }, 300);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={generateDemoData}
          disabled={loading}
          className="px-5 py-2.5 rounded-[12px] bg-[#E53935] text-white text-[14px] font-semibold hover:bg-[#C62828] active:scale-95 shadow-sm shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ 生成中...' : '🚀 生成演示数据'}
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📋</span>
            <p className="text-sm text-gray-500">今日订单</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💰</span>
            <p className="text-sm text-gray-500">今日营业额</p>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⏳</span>
            <p className="text-sm text-gray-500">待处理</p>
          </div>
          <p className="text-3xl font-bold text-orange-500">{pendingOrders}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🪑</span>
            <p className="text-sm text-gray-500">占用桌数</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{occupiedTables}</p>
        </div>
      </div>

      {/* 热门商品 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔥 热门商品</h3>
          {topItems.length > 0 ? (
            <div className="space-y-3">
              {topItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">
                      #{idx + 1}
                    </span>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {item.count} 单
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="text-3xl block mb-2">📊</span>
              <p className="text-sm text-gray-400">暂无销售数据</p>
            </div>
          )}
        </div>

        {/* 最近订单 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🕐 最近订单</h3>
          {recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-600">{order.id}</span>
                    <span className="text-xs text-gray-400">🪑 {order.tableNo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      order.status === 'pending'
                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                        : order.status === 'preparing'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {order.status === 'pending' ? '待处理'
                        : order.status === 'preparing' ? '准备中'
                        : '已完成'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="text-3xl block mb-2">📭</span>
              <p className="text-sm text-gray-400">暂无订单</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
