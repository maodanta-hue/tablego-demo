/**
 * OrderCard — 订单卡片（我的订单）
 * 显示：Order Number、Table、Status（颜色编码）、Time、Items
 * Status colors: Pending (orange), Preparing (blue), Completed (green)
 */
import type { Order } from '../../types/order';
import type { Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface OrderCardProps {
  order: Order;
}

const statusConfig: Record<string, { color: string; bg: string; label: Record<string, string> }> = {
  pending: {
    color: '#F57C00',
    bg: '#FFF3E0',
    label: { zh: '待确认', en: 'Pending', vi: 'Đang chờ', ko: '대기 중', ja: '保留中' },
  },
  preparing: {
    color: '#1976D2',
    bg: '#E3F2FD',
    label: { zh: '准备中', en: 'Preparing', vi: 'Đang chuẩn bị', ko: '준비 중', ja: '準備中' },
  },
  completed: {
    color: '#388E3C',
    bg: '#E8F5E9',
    label: { zh: '已完成', en: 'Completed', vi: 'Đã hoàn thành', ko: '완료됨', ja: '完了' },
  },
};

function getItemName(name: { zh: string; en: string; vi: string; ko?: string; ja?: string }, lang: Language): string {
  const map: Record<string, string> = { zh: name.zh, en: name.en, vi: name.vi, ko: name.ko ?? name.en, ja: name.ja ?? name.en };
  return map[lang] || name.en;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return iso;
  }
}

export default function OrderCard({ order }: OrderCardProps) {
  const { t, language } = useLanguage();
  const config = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="bg-white rounded-[14px] p-4 shadow-sm border border-gray-50 mx-4 mb-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[12px] text-gray-400 font-medium">{t('orderNumber') || 'Order'} #{order.id.slice(-6).toUpperCase()}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-gray-300">🪑 {t('table') || 'Table'} {order.tableNo}</span>
            <span className="text-[11px] text-gray-300">·</span>
            <span className="text-[11px] text-gray-300">{formatTime(order.createdAt)}</span>
          </div>
        </div>
        <span
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
          style={{ color: config.color, backgroundColor: config.bg }}
        >
          {config.label[language] || config.label.en || t(order.status)}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[13px] text-gray-600">
            <span className="line-clamp-1 flex-1 mr-4">
              {item.quantity}x {getItemName(item.name, language)}
            </span>
            <span className="flex-shrink-0 text-[13px] font-medium text-gray-800">
              ¥{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-[14px] font-semibold text-gray-900">{t('total') || 'Total'}</span>
        <span className="text-[16px] font-bold text-[#E53935]">¥{order.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}