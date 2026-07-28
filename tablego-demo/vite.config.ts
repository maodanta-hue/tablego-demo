import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 手机预览优化
  server: {
    host: true, // 允许局域网访问，方便手机扫码测试
    port: 5173,
    // 预转换请求，加速冷启动
    preTransformRequests: true,
  },
  build: {
    // 减小 chunk 体积警告阈值
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 核心框架单独打包，利于浏览器缓存
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
})
