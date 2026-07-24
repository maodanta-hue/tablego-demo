import type { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';
import { formatPrice, formatTime } from '../../hooks/useFormat';

interface Props {
  order: Order;
}

/**
 * 老板端订单卡片
 * 显示：桌号、时间、商品清单、总价、状态、完成按钮
 */
export default function OrderCard({ order }: Props) {
  const { t } = useLanguage();
  const { markOrderCompleted } = useOrder();

  const isPending = order.status === 'pending';

  return (
    <div
      className={`
        rounded-xl border p-4 transition-all duration-300
        ${isPending
          ? 'bg-white border-l-4 border-l-orange-500 shadow-sm'
          : 'bg-gray-50 border-gray-200 opacity-75'
        }
      `}
    >
      {/* 顶部：桌号 + 状态 + 时间 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800">
            🪑 {order.tableNo}
          </span>
          <span
            className={`
              text-[11px] font-bold px-2 py-0.5 rounded-full
              ${isPending
                ? 'bg-orange-50 text-orange-600'
                : 'bg-green-50 text-green-600'
              }
            `}
          >
            {isPending ? t('owner.pending') : t('owner.completed')}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {formatTime(order.createdAt)}
        </span>
      </div>

      {/* 商品列表 */}
      <div className="space-y-1.5 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-700 flex-1">
              {t(item.nameKey)}
              <span className="text-gray-400 ml-1">× {item.quantity}</span>
            </span>
            <span className="text-gray-600 font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* 底行：总价 + 按钮 */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400">{t('owner.total')}: </span>
          <span className="text-base font-bold text-green-700">
            {formatPrice(order.totalPrice)}
          </span>
        </div>

        {isPending && (
          <button
            onClick={() => markOrderCompleted(order.id)}
            className="px-5 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg
                       hover:bg-green-700 active:scale-95 transition-all duration-200"
          >
            ✓ {t('owner.markDone')}
          </button>
        )}
      </div>
    </div>
  );
}