import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getOrders, addOrder, generateOrderId, updateOrderStatus } from '../../store';
import { getMenuItems } from '../../store/menuStore';
import { seedDemo } from '../../services/storage';
import { subscribe } from '../../services/sync';
import type { OrderItem, Order } from '../../types';
import { formatPrice } from '../../hooks/useFormat';

/**
 * 商家后台 - 订单管理页面
 * - 显示所有订单
 * - 空订单时显示 No Orders Yet + Demo Data 按钮
 * - 支持 Pending → Preparing → Completed 状态流转
 * - 订阅实时更新，解决空白页问题
 */
export default function OrdersPage() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // 订阅订单变更，实时刷新
  useEffect(() => {
    const unsub = subscribe<Order[]>('orders', (updatedOrders) => {
      setOrders(updatedOrders);
    });
    return unsub;
  }, []);

  // 每次重新挂载时刷新数据
  useEffect(() => {
    setOrders(getOrders());
  }, []);

  /** 生成演示数据 */
  const generateDemoData = useCallback(() => {
    setLoading(true);
    let menuItems = getMenuItems().filter((m) => m.available);
    if (menuItems.length === 0) {
      // 如果没有菜品数据，先写入种子数据
      seedDemo();
      menuItems = getMenuItems().filter((m) => m.available);
    }
    if (menuItems.length === 0) {
      setLoading(false);
      return;
    }

    const demoOrders = [
      { table: 'A01', items: [menuItems[0], menuItems[1]], status: 'pending' as const },
      { table: 'B02', items: [menuItems[2], menuItems[3], menuItems[0]], status: 'pending' as const },
      { table: 'C03', items: [menuItems[4]], status: 'preparing' as const },
      { table: 'A01', items: [menuItems[1], menuItems[5]], status: 'completed' as const },
      { table: 'D04', items: [menuItems[6], menuItems[7], menuItems[0]], status: 'pending' as const },
      { table: 'E05', items: [menuItems[2], menuItems[1]], status: 'preparing' as const },
    ];

    demoOrders.forEach((demo) => {
      const orderItems: OrderItem[] = demo.items.map((mi) => ({
        menuItemId: mi.id,
        name: { ...mi.name },
        price: mi.price,
        quantity: Math.floor(Math.random() * 2) + 1,
      }));
      const totalPrice = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

      addOrder({
        id: generateOrderId(),
        tableNo: demo.table,
        items: orderItems,
        totalPrice,
        status: demo.status,
        createdAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        completedAt: demo.status === 'completed' ? new Date().toISOString() : undefined,
      });
    });

    setTimeout(() => {
      setOrders(getOrders());
      setLoading(false);
    }, 300);
  }, []);

  /** 状态对应样式 */
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'preparing':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-600 border-green-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  /** 状态文本 */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return language === 'vi' ? 'Đang chờ' : language === 'en' ? 'Pending' : '待处理';
      case 'preparing':
        return language === 'vi' ? 'Đang làm' : language === 'en' ? 'Preparing' : '准备中';
      case 'completed':
        return language === 'vi' ? 'Hoàn thành' : language === 'en' ? 'Completed' : '已完成';
      default:
        return status;
    }
  };

  /** 流转到下一个状态 */
  const advanceStatus = (orderId: string, currentStatus: string) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'preparing');
    } else if (currentStatus === 'preparing') {
      updateOrderStatus(orderId, 'completed');
    }
    // 订阅机制会自动更新订单列表，无需手动调用setOrders
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {language === 'en' ? 'Orders' : '订单管理'}
        </h2>
        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{orders.length}</span>
      </div>

      {/* 状态筛选 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['all', 'pending', 'preparing', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-[12px] text-sm font-medium transition-all ${
              statusFilter === s
                ? 'bg-[#E53935] text-white shadow-sm shadow-red-200'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {s === 'all' ? (language === 'en' ? 'All' : '全部') : getStatusText(s)}
            {s !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 fade-in">
          <span className="text-6xl block mb-4">📋</span>
          <p className="text-gray-400 text-lg mb-2">No Orders Yet</p>
          <p className="text-gray-300 text-sm mb-6">
            {language === 'en'
              ? 'Click to generate demo data'
              : '还没有订单，点击下方按钮生成演示数据'}
          </p>
          <button
            onClick={generateDemoData}
            disabled={loading}
            className="px-8 py-3 rounded-[12px] bg-[#E53935] text-white font-semibold text-base shadow-lg shadow-red-200 hover:bg-[#C62828] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {language === 'en' ? 'Generating...' : '生成中...'}
              </span>
            ) : (
              <span>🚀 {language === 'en' ? 'Generate Demo Orders' : '生成演示数据'}</span>
            )}
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 fade-in">
          <span className="text-4xl block mb-3">🔍</span>
          <p className="text-gray-400">
            {language === 'en' ? 'No orders matching filter' : '当前筛选条件下没有订单'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 fade-in">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${
                order.status === 'completed'
                  ? 'border-gray-100 opacity-70'
                  : 'border-gray-200'
              }`}
            >
              {/* 订单头部 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-base">{order.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* 桌号 + 时间 */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">🪑 {order.tableNo}</span>
                <span className="flex items-center gap-1">
                  🕐 {new Date(order.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* 商品明细 */}
              <div className="space-y-1.5 mb-3 py-3 border-y border-gray-50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-mono w-6 text-right">{item.quantity}x</span>
                      <span className="text-gray-700">{item.name.zh || item.name.en}</span>
                    </div>
                    <span className="text-gray-600 font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* 底部：总价 + 操作 */}
              <div className="flex items-center justify-between">
                <div className="text-base font-bold text-gray-800">
                  {language === 'en' ? 'Total: ' : '合计: '}{formatPrice(order.totalPrice)}
                </div>
                <div className="flex gap-2">
                  {order.status === 'completed' ? (
                    <span className="text-sm text-gray-400 py-2">✅ {language === 'en' ? 'Completed' : '已完成'}</span>
                  ) : (
                    <button
                      onClick={() => advanceStatus(order.id, order.status)}
                      className={`px-4 py-2 rounded-[12px] text-sm font-semibold text-white active:scale-[0.97] transition-all ${
                        order.status === 'pending'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-[#4CAF50] hover:bg-[#388E3C]'
                      }`}
                    >
                      {order.status === 'pending'
                        ? (language === 'en' ? 'Accept' : '接单')
                        : (language === 'en' ? 'Complete' : '完成')}
                    </button>
                  )}
                </div>
              </div>

              {/* 备注 */}
              {order.customerNote && (
                <div className="mt-3 pt-3 border-t border-gray-50 text-sm text-gray-400">
                  📝 {language === 'en' ? 'Note: ' : '备注: '}{order.customerNote}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}