import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';
import { getOrders } from '../store';
import OrderCard from '../components/dashboard/OrderCard';

/**
 * 老板订单管理页
 * - 显示所有订单列表
 * - 每条订单可标记完成
 * - pending 和 completed 状态区分明显
 */
export default function OwnerPage() {
  const { t } = useLanguage();
  useOrder(); // keep context available for markOrderCompleted etc
  const orders = getOrders();

  // 分离待处理和已完成订单
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="px-4 py-4 pb-8">
      {/* 页面标题 */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t('owner.title')}</h2>

      {orders.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-4">📋</span>
          <p className="text-sm font-medium">{t('owner.noOrders')}</p>
        </div>
      ) : (
        <>
          {/* 待处理订单 */}
          {pendingOrders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3">
                {t('owner.pending')} · {pendingOrders.length}
              </h3>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* 已完成订单 */}
          {completedOrders.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">
                {t('owner.completed')} · {completedOrders.length}
              </h3>
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}