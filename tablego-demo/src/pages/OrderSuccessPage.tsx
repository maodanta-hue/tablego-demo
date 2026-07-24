import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useOrder } from '../context/OrderContext';

/**
 * 下单成功页
 * - 动画提示成功
 * - 显示订单号和桌号
 * - 提示等待处理
 * - 可继续点餐
 */
export default function OrderSuccessPage() {
  const { t } = useLanguage();
  const { orders } = useOrder();
  const navigate = useNavigate();

  // 获取最新一条订单
  const latestOrder = orders[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-8">
      {/* 成功动画（简单用 emoji） */}
      <div className="text-7xl mb-4 animate-bounce">🎉</div>

      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-3">
        {t('success.title')}
      </h1>

      {/* 提示信息 */}
      <p className="text-sm text-gray-500 text-center mb-6">
        {t('success.message')}
      </p>

      {/* 订单信息卡片 */}
      {latestOrder && (
        <div className="w-full max-w-xs bg-green-50 rounded-2xl px-6 py-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">{t('success.orderId')}</span>
            <span className="text-sm font-bold text-gray-800">{latestOrder.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('success.table')}</span>
            <span className="text-sm font-bold text-gray-800">{latestOrder.tableNo}</span>
          </div>
        </div>
      )}

      {/* 温馨提醒 */}
      <p className="text-xs text-gray-400 text-center max-w-xs mb-8">
        {t('success.note')}
      </p>

      {/* 继续点餐按钮 */}
      <button
        onClick={() => navigate('/menu')}
        className="w-full max-w-xs py-4 bg-green-600 text-white text-base font-bold rounded-2xl
                   shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.97]
                   transition-all duration-200"
      >
        {t('success.backToMenu')}
      </button>
    </div>
  );
}