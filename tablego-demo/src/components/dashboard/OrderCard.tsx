/**
 * 老板端订单卡片
 * 显示：桌号、时间、商品明细（多语言）、总价、状态、完成按钮
 */
import type { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const { t, language } = useLanguage();
  const { markOrderCompleted } = useOrder();

  const isPending = order.status === 'pending';

  /** 从多语言文本中获取当前语言的文本 */
  const localizedText = (text: Record<string, string>): string => {
    if (!text) return '';
    switch (language) {
      case 'vi': return text.vi || text.en || text.zh;
      case 'zh': return text.zh || text.en || text.vi;
      case 'en': return text.en || text.vi || text.zh;
      default:   return text.en || text.vi || text.zh;
    }
  };

  /** 格式化时间：ISO → 简短显示 */
  const formatTime = (iso: string): string => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

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
          <div key={idx} className="text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 flex-1">
                {localizedText(item.name)}
                <span className="text-gray-400 ml-1">× {item.quantity}</span>
              </span>
              <span className="text-gray-600 font-medium">
                {t('app.currency')}{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
            {item.remark && (
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                  📝 {item.remark}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底行：总价 + 按钮 */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400">{t('owner.total')}: </span>
          <span className="text-base font-bold text-green-700">
            {t('app.currency')}{order.totalPrice.toLocaleString()}
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