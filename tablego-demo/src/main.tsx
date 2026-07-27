import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initDevTools } from './lib/devtools';
import { initializeIfEmpty } from './services/storage';

/**
 * 应用入口
 * 挂载 React 应用到 #root
 */

// 首次启动初始化：如果数据库为空，自动填充演示数据
initializeIfEmpty();

// 初始化开发者工具（浏览器控制台 window.tablego）
initDevTools();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
