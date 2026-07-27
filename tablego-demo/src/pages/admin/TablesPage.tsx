import { useState, useEffect } from 'react';
import { getSlice, setSlice } from '../../services/storage';
import { generateId } from '../../store/menuStore';
import type { TableInfo } from '../../data/tables';
import Modal from '../../components/ui/Modal';

const TABLES_KEY = 'tables';

/** 根据桌号生成二维码图片 URL（使用免费在线 QR API，零依赖） */
function getQRUrl(tableNumber: string): string {
  const url = `${window.location.origin}/table/${tableNumber}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
}

function getTables(): TableInfo[] {
  return getSlice<TableInfo[]>(TABLES_KEY, []);
}

function saveTables(tables: TableInfo[]): void {
  setSlice(TABLES_KEY, tables);
}

/**
 * 商家后台 - 桌号管理页面
 * - 单个新增
 * - 批量生成（前缀 + 起始号 + 数量）
 * - 持久化到 tablego_db
 */
export default function TablesPage() {
  const [tables, setTablesState] = useState<TableInfo[]>(() => getTables());
  const [singleInput, setSingleInput] = useState('');
  const [batchPrefix, setBatchPrefix] = useState('A');
  const [batchStart, setBatchStart] = useState('01');
  const [batchCount, setBatchCount] = useState('20');
  const [qrTable, setQrTable] = useState<string | null>(null);

  // 页面切换时刷新
  useEffect(() => {
    setTablesState(getTables());
  }, []);

  /** 单个添加 */
  const handleAddSingle = () => {
    const number = singleInput.trim().toUpperCase();
    if (!number) return;
    if (tables.some((t) => t.number === number)) {
      alert('桌号已存在');
      return;
    }
    const newTable: TableInfo = {
      id: generateId(),
      number,
      status: 'active',
    };
    const updated = [...tables, newTable];
    saveTables(updated);
    setTablesState(updated);
    setSingleInput('');
  };

  /** 批量生成 */
  const handleBatchGenerate = () => {
    const prefix = batchPrefix.trim().toUpperCase();
    const start = parseInt(batchStart, 10);
    const count = parseInt(batchCount, 10);
    if (!prefix || isNaN(start) || isNaN(count) || count < 1 || count > 100) {
      alert('请输入有效的前缀、起始号和数量（1-100）');
      return;
    }

    const newTables: TableInfo[] = [];
    for (let i = 0; i < count; i++) {
      const num = start + i;
      const number = `${prefix}${String(num).padStart(2, '0')}`;
      if (!tables.some((t) => t.number === number)) {
        newTables.push({ id: generateId(), number, status: 'active' });
      }
    }

    if (newTables.length === 0) {
      alert('所有桌号已存在');
      return;
    }

    const updated = [...tables, ...newTables];
    saveTables(updated);
    setTablesState(updated);
  };

  /** 删除桌号 */
  const handleDelete = (id: string) => {
    const updated = tables.filter((t) => t.id !== id);
    saveTables(updated);
    setTablesState(updated);
  };

  /** 切换启用/停用 */
  const handleToggle = (id: string) => {
    const updated = tables.map((t) =>
      t.id === id ? { ...t, status: t.status === 'active' ? ('disabled' as const) : ('active' as const) } : t,
    );
    saveTables(updated);
    setTablesState(updated);
  };

  const activeTables = tables.filter((t) => t.status === 'active');
  const disabledTables = tables.filter((t) => t.status === 'disabled');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">桌号管理</h2>

      {/* 单个添加 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-4">单个添加</h3>
        <div className="flex gap-3">
          <input
            value={singleInput}
            onChange={(e) => setSingleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSingle()}
            placeholder="例如: A01"
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
          />
          <button
            onClick={handleAddSingle}
            className="px-6 py-2.5 rounded-xl bg-[#E53935] text-white text-[13px] font-semibold hover:bg-[#C62828] active:scale-95 transition-all"
          >
            添加
          </button>
        </div>
      </div>

      {/* 批量生成 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-4">批量生成</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">前缀</label>
            <input
              value={batchPrefix}
              onChange={(e) => setBatchPrefix(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
            />
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">起始号</label>
            <input
              value={batchStart}
              onChange={(e) => setBatchStart(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
            />
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1">数量</label>
            <input
              value={batchCount}
              onChange={(e) => setBatchCount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#E53935]/20"
            />
          </div>
        </div>
        <button
          onClick={handleBatchGenerate}
          className="w-full h-11 rounded-xl bg-[#E53935] text-white text-[14px] font-semibold hover:bg-[#C62828] active:scale-[0.98] shadow-sm shadow-red-200 transition-all"
        >
          生成 {batchPrefix}{batchStart} ~ {batchPrefix}{String(parseInt(batchStart, 10) + parseInt(batchCount, 10) - 1).padStart(2, '0')}
        </button>
      </div>

      {/* 桌号网格 */}
      {tables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-5xl block mb-3">🪑</span>
          <p className="text-gray-400">暂无桌号，请添加</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">共 {tables.length} 个桌号</p>
          </div>

          {/* 启用桌号 */}
          {activeTables.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-3 font-medium">🟢 启用中 ({activeTables.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {activeTables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center relative group hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-1">🪑</div>
                    <p className="text-base font-bold text-gray-800">{table.number}</p>
                    <p className="text-[11px] text-green-600 font-medium mt-0.5">空闲</p>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setQrTable(table.number)}
                        className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] flex items-center justify-center"
                        title="展示二维码"
                      >
                        ◈
                      </button>
                      <button
                        onClick={() => handleToggle(table.id)}
                        className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 text-[11px] flex items-center justify-center"
                        title="停用"
                      >
                        ⏸
                      </button>
                      <button
                        onClick={() => handleDelete(table.id)}
                        className="w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-[11px] flex items-center justify-center"
                        title="删除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 停用桌号 */}
          {disabledTables.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-3 font-medium">🔴 已停用 ({disabledTables.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {disabledTables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center relative group opacity-50 hover:opacity-100 transition-all"
                  >
                    <div className="text-2xl mb-1">🚫</div>
                    <p className="text-base font-bold text-gray-400 line-through">{table.number}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">已停用</p>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setQrTable(table.number)}
                        className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] flex items-center justify-center"
                        title="展示二维码"
                      >
                        ◈
                      </button>
                      <button
                        onClick={() => handleToggle(table.id)}
                        className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 text-[11px] flex items-center justify-center"
                        title="启用"
                      >
                        ▶
                      </button>
                      <button
                        onClick={() => handleDelete(table.id)}
                        className="w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-[11px] flex items-center justify-center"
                        title="删除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 二维码弹窗 */}
      <Modal open={qrTable !== null} onClose={() => setQrTable(null)} title="桌号二维码">
        {qrTable && (
          <div className="flex flex-col items-center py-4">
            <img
              src={getQRUrl(qrTable)}
              alt={`Table ${qrTable} QR code`}
              className="w-56 h-56 rounded-xl shadow-sm mb-4"
            />
            <p className="text-base font-bold text-gray-800 mb-1">桌号 {qrTable}</p>
            <p className="text-[13px] text-gray-500 mb-4 text-center break-all">
              {window.location.origin}/table/{qrTable}
            </p>
            <p className="text-[12px] text-gray-400">顾客扫码后自动进入点餐页面</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
