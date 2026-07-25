import { useState, useEffect } from 'react';
import { getOrders } from '../../store';
import { subscribe } from '../../services/sync';
import { formatPrice } from '../../hooks/useFormat';
import type { Order } from '../../types';

/**
 * 商家后台 Dashboard 首页
 * - 今日订单数量
 * - 今日营业额
 * - 待处理订单
 * - 热门商品
 * - 无数据时提供 Demo 生成按钮
 */
export default function DashboardPage() {
  const [orders, setOrders] = useState(() => getOrders());

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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

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
      </div>

      {/* 热门商品 */}
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
          <p className="text-sm text-gray-400">暂无销售数据</p>
        )}
      </div>
    </div>
  );
}
