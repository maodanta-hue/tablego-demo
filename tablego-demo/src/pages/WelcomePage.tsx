import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

/**
 * 欢迎页（首页）
 * - 餐厅欢迎语
 * - 默认桌号 A1
 * - 语言切换
 * - 开始点餐按钮
 */
export default function WelcomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/menu');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 py-8">
      {/* Logo / 图标 */}
      <div className="text-7xl mb-6">🍜</div>

      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-800 text-center leading-snug mb-2 whitespace-pre-line">
        {t('welcome.title')}
      </h1>

      {/* 副标题 */}
      <p className="text-sm text-gray-500 text-center max-w-xs mb-2">
        {t('welcome.subtitle')}
      </p>

      {/* 桌号 */}
      <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
        <span>🪑</span>
        <span>{t('welcome.table', { tableNo: 'A1' })}</span>
      </div>

      {/* 开始按钮 */}
      <button
        onClick={handleStart}
        className="w-full max-w-xs py-4 bg-green-600 text-white text-lg font-bold rounded-2xl
                   shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.97]
                   transition-all duration-200 mb-8"
      >
        {t('welcome.start')}
      </button>

      {/* 语言切换 */}
      <div className="w-full max-w-xs">
        <p className="text-xs text-gray-400 text-center mb-3">
          {t('welcome.switchLang')}
        </p>
        <LanguageSwitcher />
      </div>
    </div>
  );
}