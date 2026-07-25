import { useState } from 'react';
import { tables } from '../../data/tables';

/**
 * 商家后台 - 桌号管理页面
 * 展示桌号列表和当前状态（演示版只读）
 */
export default function TablesPage() {
  const [tableStatuses, setTableStatuses] = useState<Record<string, 'empty' | 'occupied'>>(
    Object.fromEntries(tables.map((t) => [t.id, 'empty']))
  );

  const toggleStatus = (tableId: string) => {
    setTableStatuses((prev) => ({
      ...prev,
      [tableId]: prev[tableId] === 'empty' ? 'occupied' : 'empty',
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">桌号管理</h2>

      {/* 桌号网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => toggleStatus(table.id)}
            className={`bg-white rounded-2xl p-5 shadow-sm border text-center transition-all hover:shadow-md active:scale-[0.97] ${
              tableStatuses[table.id] === 'occupied'
                ? 'border-orange-300 bg-orange-50'
                : 'border-gray-100'
            }`}
          >
            <div className="text-2xl mb-2">
              {tableStatuses[table.id] === 'occupied' ? '🧑‍🍳' : '🪑'}
            </div>
            <p className="text-lg font-bold text-gray-800">{table.number}</p>
            <p className={`text-xs mt-1 font-medium ${
              tableStatuses[table.id] === 'occupied'
                ? 'text-orange-600'
                : 'text-green-600'
            }`}>
              {tableStatuses[table.id] === 'occupied' ? '用餐中' : '空闲'}
            </p>
          </button>
        ))}
      </div>

      {/* 说明 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">💡 提示</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          点击桌号可切换状态（空闲 ↔ 用餐中）。<br />
          演示版仅展示桌号管理界面，完整版可添加/删除桌号、查看桌号订单历史。
        </p>
      </div>
    </div>
  );
}