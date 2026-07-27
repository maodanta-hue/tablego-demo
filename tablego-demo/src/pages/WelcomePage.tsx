/**
 * 欢迎页（首页）
 * - 餐厅 Logo、名称、欢迎语
 * - 从 tablego_db 动态读取桌号列表
 * - 支持 URL 参数 ?table=:tableNo 直接进入
 * - 语言切换
 * - 老板端入口
 */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { getSlice } from '../services/storage';
import type { TableInfo } from '../data/tables';

const TABLES_KEY = 'tables';

export default function WelcomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tables, setTables] = useState<TableInfo[]>(() => getSlice<TableInfo[]>(TABLES_KEY, []));

  // 实时同步后台桌号变化
  useEffect(() => {
    const refresh = () => setTables(getSlice<TableInfo[]>(TABLES_KEY, []));
    refresh();
    // 每次页面激活时重新读取
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  // 支持 URL 参数直接进入: ?table=A08
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (!tableParam) return;

    const upperNo = tableParam.toUpperCase();
    const table = tables.find((t) => t.number === upperNo);

    if (!table) {
      // 无效桌号，忽略参数
      return;
    }

    if (table.status !== 'active') {
      // 已停用，忽略参数
      return;
    }

    // 有效桌号，自动进入菜单
    navigate(`/menu?table=${encodeURIComponent(upperNo)}`, { replace: true });
  }, [searchParams, tables, navigate]);

  const activeTables = tables.filter((t) => t.status === 'active');
  const disabledTables = tables.filter((t) => t.status === 'disabled');
  const totalActive = activeTables.length;
  const totalDisabled = disabledTables.length;

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
          {tables.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-5xl mb-3">🪑</div>
              <p className="text-gray-500 font-semibold mb-1">No tables available</p>
              <p className="text-gray-400 text-[13px]">Please contact restaurant.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 text-center mb-3">
                📲 {totalActive} Tables Available
                {totalDisabled > 0 && ` · ${totalDisabled} Unavailable`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activeTables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => handleEnterMenu(table.number)}
                    className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-green-200
                               text-green-700 font-bold text-base
                               shadow-sm hover:shadow-md hover:border-green-400 hover:bg-green-50
                               active:scale-[0.97] transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    <span>🍽️</span>
                    {t('welcome.table')} {table.number}
                  </button>
                ))}
                {disabledTables.map((table) => (
                  <div
                    key={table.id}
                    className="w-full py-4 px-6 rounded-2xl bg-gray-50 border-2 border-gray-200
                               text-gray-300 text-base font-bold
                               flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <span>🚫</span>
                    {t('welcome.table')} {table.number}
                  </div>
                ))}
              </div>
            </>
          )}
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