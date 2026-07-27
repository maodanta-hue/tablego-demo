/**
 * 扫码入口页
 * 当顾客扫描二维码时，访问 /table/:tableNo
 * - 自动读取桌号并验证是否存在
 * - 有效桌号 → 跳转到菜单页
 * - 无效桌号 → 跳回首页并显示提示
 * - 已停用桌号 → 跳回首页
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSlice } from '../services/storage';
import type { TableInfo } from '../data/tables';

const TABLES_KEY = 'tables';

export default function TableEntryPage() {
  const { tableNo } = useParams<{ tableNo: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableNo) {
      navigate('/', { replace: true });
      return;
    }

    const tables = getSlice<TableInfo[]>(TABLES_KEY, []);
    const upperNo = tableNo.toUpperCase();
    const table = tables.find((t) => t.number === upperNo);

    if (!table) {
      // 桌号不存在，显示错误 3 秒后跳回首页
      setError('Invalid table. Please scan the QR code again.');
      const timer = setTimeout(() => navigate('/', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }

    if (table.status !== 'active') {
      // 桌号已停用
      setError('This table is unavailable. Please contact restaurant staff.');
      const timer = setTimeout(() => navigate('/', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }

    // 有效桌号，自动跳转到菜单页
    navigate(`/menu?table=${encodeURIComponent(upperNo)}`, { replace: true });
  }, [tableNo, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#F7F7F7]">
      {error ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-semibold mb-2 text-[15px]">{error}</p>
          <p className="text-gray-400 text-[13px]">Redirecting...</p>
        </div>
      ) : (
        <>
          <div className="text-6xl mb-4 animate-bounce">🍜</div>
          <p className="text-gray-500 text-sm">Loading table...</p>
        </>
      )}
    </div>
  );
}