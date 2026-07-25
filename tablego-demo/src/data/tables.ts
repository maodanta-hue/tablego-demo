// ============================================================
// 桌号数据模型
// 模拟数据库中所有桌子的信息
// ============================================================

export interface TableInfo {
  id: string;
  number: string;   // 桌号，如 A01
  status: 'active' | 'disabled';  // active=使用中, disabled=停用
}

/** 模拟桌号列表 — 未来可从数据库 / API 获取 */
export const tables: TableInfo[] = [
  { id: '001', number: 'A01', status: 'active' },
  { id: '002', number: 'A02', status: 'active' },
  { id: '003', number: 'A03', status: 'active' },
  { id: '004', number: 'A04', status: 'active' },
  { id: '005', number: 'A05', status: 'active' },
  { id: '006', number: 'B01', status: 'active' },
  { id: '007', number: 'B02', status: 'active' },
  { id: '008', number: 'B03', status: 'active' },
];

/** 根据桌号查找 TableInfo */
export function getTableByNumber(number: string): TableInfo | undefined {
  return tables.find((t) => t.number === number);
}

/** 生成桌子的二维码图片 URL（Mock） */
export function getTableQRUrl(tableNo: string): string {
  // 这里直接生成 /table/{tableNo} 路径
  // 例如：扫码后访问 https://yourdomain.com/table/A03
  return `/table/${tableNo}`;
}