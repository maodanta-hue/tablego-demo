/**
 * 开发者工具
 * 挂载 window.tablego，方便在浏览器控制台调试与管理数据
 *
 * 使用方式（浏览器控制台）：
 *   tablego.help()              // 查看所有可用命令
 *   tablego.db()                // 查看整个数据库
 *   tablego.reset()             // 重置数据库
 *   tablego.seed()              // 填充演示数据
 *   tablego.orders()            // 查看所有订单
 *   tablego.menu()              // 查看菜单
 *   tablego.cats()              // 查看分类
 *   tablego.restaurant()        // 查看餐厅信息
 *   tablego.export()            // 导出 JSON
 *   tablego.version()           // 查看数据库版本
 */

import { getDB, resetDatabase, seedDemo, exportDatabase } from '../services/storage';

export interface TablegoDevTools {
  help: () => void;
  db: () => ReturnType<typeof getDB>;
  reset: () => void;
  seed: () => void;
  orders: () => unknown;
  menu: () => unknown;
  cats: () => unknown;
  restaurant: () => unknown;
  export: () => string;
  version: () => string;
}

const helpText = `
🔧 Tablego DevTools 可用命令：
  tablego.help()       显示此帮助
  tablego.db()         查看整个数据库
  tablego.reset()      重置数据库（清空所有数据）
  tablego.seed()       填充演示种子数据
  tablego.orders()     查看所有订单
  tablego.menu()       查看菜单
  tablego.cats()       查看分类
  tablego.restaurant() 查看餐厅信息
  tablego.export()     导出数据库为 JSON 字符串
  tablego.version()    查看数据库版本信息
`;

export function initDevTools(): void {
  const tools: TablegoDevTools = {
    help() {
      console.log(helpText);
    },
    db() {
      return getDB();
    },
    reset() {
      resetDatabase();
      console.log('✅ 数据库已重置。刷新页面生效。');
    },
    seed() {
      seedDemo();
      console.log('✅ 演示数据已填充。刷新页面生效。');
    },
    orders() {
      const db = getDB();
      console.table(
        db.orders.map((o) => ({
          ID: o.id,
          Table: o.tableNo,
          Status: o.status,
          Items: o.items.length,
          Total: o.totalPrice,
          Created: o.createdAt,
        }))
      );
      return db.orders;
    },
    menu() {
      const db = getDB();
      console.table(
        db.menuItems.map((m) => ({
          ID: m.id,
          Name: m.name.zh,
          Category: m.categoryId,
          Price: m.price,
          Available: m.available,
        }))
      );
      return db.menuItems;
    },
    cats() {
      const db = getDB();
      console.table(
        db.categories.map((c) => ({
          ID: c.id,
          Name: c.name.zh,
          Icon: c.icon,
        }))
      );
      return db.categories;
    },
    restaurant() {
      const db = getDB();
      console.table(db.restaurant);
      return db.restaurant;
    },
    export() {
      const json = exportDatabase();
      console.log('📋 数据库 JSON 已复制到控制台：');
      console.log(json);
      // 尝试复制到剪贴板
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(json).then(
          () => console.log('✅ 已复制到剪贴板'),
          () => console.log('⚠️ 复制失败，请手动复制上方 JSON')
        );
      }
      return json;
    },
    version() {
      const db = getDB();
      console.log(`📦 数据库版本：${db.version}`);
      console.log(`📦 代码版本：${import.meta.env.VITE_APP_VERSION || 'dev'}`);
      return `DB v${db.version}`;
    },
  };

  (window as unknown as Record<string, TablegoDevTools>).tablego = tools;
  console.log('🔧 Tablego DevTools 已就绪。输入 tablego.help() 查看可用命令。');
}