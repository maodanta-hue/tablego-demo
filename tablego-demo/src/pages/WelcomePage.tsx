/**
 * 欢迎页（首页）— 商业级桌号选择（参考瑞幸首页）
 *
 * - 品牌 Logo 区域加大
 * - 餐厅名 H1（24px Bold）
 * - 标语 Body（14px 灰色）
 * - 桌号卡片：圆角 L/16px，阴影 XS，悬浮 S
 * - 语言切换按钮使用主色
 * - 从 storage 动态读取桌号列表
 * - 老板端入口
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { getSlice } from '../services/storage';
import type { TableInfo } from '../data/tables';

const TABLES_KEY = 'tables';

export default function WelcomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tables, setTables] = useState<TableInfo[]>(() => getSlice<TableInfo[]>(TABLES_KEY, []));

  // 实时同步后台桌号变化
  useEffect(() => {
    const refresh = () => setTables(getSlice<TableInfo[]>(TABLES_KEY, []));
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeTables = tables.filter((t) => t.status === 'active');
  const disabledTables = tables.filter((t) => t.status === 'disabled');

  const handleEnterMenu = (tableNo: string) => {
    navigate(`/menu?table=${encodeURIComponent(tableNo)}`);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-56px)] px-6 py-8">
      {/* 上部：品牌区 */}
      <div className="flex flex-col items-center w-full">
        {/* 品牌渐变头图 */}
        <div className="w-full max-w-sm rounded-[20px] bg-gradient-to-br from-[#1A6B3C] to-[#0D4A2A] px-6 py-8 mb-8 flex flex-col items-center shadow-[0_4px_16px_rgba(26,107,60,0.25)]">
          {/* Logo — 白色背景 */}
          <div className="w-20 h-20 rounded-[16px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center mb-5">
            <span className="text-[40px] leading-none">🍜</span>
          </div>

          {/* 标题 — 白色 */}
          <h1 className="text-[24px] font-bold text-white text-center leading-snug mb-1.5">
            {t('welcome.title')}
          </h1>

          {/* 标语 — 白色/80 */}
          <p className="text-[14px] text-white/80 text-center max-w-xs">
            {t('welcome.subtitle')}
          </p>
        </div>

        {/* 扫码示意卡片 — 主色浅背景 */}
        <div className="w-full max-w-sm bg-[#E8F5E9] rounded-[16px] border border-[#C8E6C9] px-5 py-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0">
            <span className="text-3xl">📱</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#1A6B3C] mb-0.5">Scan QR Code</p>
            <p className="text-[12px] text-[#4A4A5A] leading-relaxed">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* 桌号选择 — 商业级网格 */}
        <div className="w-full max-w-sm mb-6">
          {tables.length === 0 ? (
            <div className="text-center py-8 text-[#9A9AAB]">
              <p className="text-[14px]">暂无桌号，请先在后台添加</p>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-[#9A9AAB] text-center mb-3">
                📲 {activeTables.length} 个可用桌号
                {disabledTables.length > 0 && ` · ${disabledTables.length} 个已停用`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activeTables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => handleEnterMenu(table.number)}
                    className="w-full py-4 px-6 rounded-[16px] bg-white border border-[#EEEEF0]
                               text-[#1A6B3C] font-semibold text-[16px]
                               shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                               hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#1A6B3C]
                               active:scale-[0.97] transition-all duration-150
                               flex items-center justify-center gap-2"
                  >
                    <span>🍽️</span>
                    {t('welcome.table')} {table.number}
                  </button>
                ))}
                {disabledTables.map((table) => (
                  <div
                    key={table.id}
                    className="w-full py-4 px-6 rounded-[16px] bg-[#F8F9FA] border border-[#EEEEF0]
                               text-[#BDBDC5] text-[16px] font-semibold
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

      {/* 下部：语言切换 — 主色按钮风格 */}
      <div className="flex flex-col items-center w-full max-w-sm">
        <div className="w-full mb-4">
          <p className="text-[12px] text-[#9A9AAB] text-center mb-3">🌐 Language</p>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}