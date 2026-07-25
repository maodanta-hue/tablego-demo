/**
 * 下单成功页
 * - 显示成功动画
 * - 从 URL 参数读取订单号和桌号
 * - 提示等待处理
 */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function OrderSuccessPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';
  const tableNo = searchParams.get('table') || 'A1';

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 py-8">
      {/* 成功动画 */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <span className="text-5xl animate-bounce">🎉</span>
      </div>

      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
        {t('success.title')}
      </h1>

      {/* 提示 */}
      <p className="text-sm text-gray-500 text-center mb-8">
        {t('success.message')}
      </p>

      {/* 订单信息卡片 */}
      <div className="w-full max-w-xs bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 px-6 py-5 mb-6">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-green-100">
          <span className="text-sm text-gray-500">{t('success.orderId')}</span>
          <span className="text-base font-bold text-green-700">{orderId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{t('success.table')}</span>
          <span className="text-base font-bold text-gray-800">{tableNo}</span>
        </div>
      </div>

      {/* 提示文字 */}
      <p className="text-xs text-gray-400 text-center max-w-xs mb-8 leading-relaxed">
        {t('success.note')}
      </p>

      {/* 继续点餐 */}
      <button
        onClick={() => navigate('/menu')}
        className="w-full max-w-xs py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-base font-bold rounded-2xl
                   shadow-lg shadow-green-200 hover:shadow-xl active:scale-[0.97] transition-all duration-200"
      >
        {t('success.backToMenu')}
      </button>
    </div>
  );
}