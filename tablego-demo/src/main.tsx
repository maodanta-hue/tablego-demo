import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initDevTools } from './lib/devtools';

/**
 * 应用入口
 * 挂载 React 应用到 #root
 */

// 初始化开发者工具（浏览器控制台 window.tablego）
initDevTools();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
