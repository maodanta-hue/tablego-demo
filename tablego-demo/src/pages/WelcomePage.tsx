/**
 * 欢迎页（首页）
 * - 餐厅 Logo、名称、欢迎语
 * - 模拟扫码选择桌号 → 进入菜单
 * - 语言切换
 * - 老板端入口
 */
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

/** 演示桌号列表 */
const DEMO_TABLES = ['A01', 'A02', 'A03', 'B01'];

export default function WelcomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEnterMenu = (tableNo: string) => {
    navigate(`/menu?table=${encodeURIComponent(tableNo)}`);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-56px)] px-6 py-8">
      {/* 上部：品牌区 */}
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-200 flex items-center justify-center mb-5">
          <span className="text-5xl">🍜</span>
        </div>

        {/* 标题 */}
        <h1 className="text-2xl font-bold text-gray-800 text-center leading-snug mb-2">
          {t('welcome.title')}
        </h1>

        <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
          {t('welcome.subtitle')}
        </p>

        {/* 扫码示意卡片 */}
        <div className="w-full max-w-sm bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 px-5 py-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
            <span className="text-3xl">📱</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-green-800 mb-0.5">Scan QR Code</p>
            <p className="text-xs text-green-600 leading-relaxed">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* 桌号选择 */}
        <div className="w-full max-w-sm mb-6">
          <p className="text-xs text-gray-400 text-center mb-3">
            📲 {t('welcome.enter')} — {t('welcome.start')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_TABLES.map((tableNo) => (
              <button
                key={tableNo}
                onClick={() => handleEnterMenu(tableNo)}
                className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-green-200
                           text-green-700 font-bold text-base
                           shadow-sm hover:shadow-md hover:border-green-400 hover:bg-green-50
                           active:scale-[0.97] transition-all duration-200
                           flex items-center justify-center gap-2"
              >
                <span>🍽️</span>
                {t('welcome.table')} {tableNo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 下部：语言切换 + 老板入口 */}
      <div className="flex flex-col items-center w-full max-w-sm">
        <div className="w-full mb-4">
          <p className="text-xs text-gray-400 text-center mb-3">🌐 Language</p>
          <LanguageSwitcher />
        </div>

        {/* 老板端入口 */}
        <button
          onClick={() => navigate('/owner')}
          className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          👑 {t('owner.title')}
        </button>
      </div>
    </div>
  );
}