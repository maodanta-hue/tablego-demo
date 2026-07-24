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
  },
})