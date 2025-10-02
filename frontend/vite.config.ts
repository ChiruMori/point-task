import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,
    proxy: {
      // 将所有 /api 开头的请求代理到后端的 3001 端口
      '/api': {
        target: 'http://backend:3001', // Docker 内部网络
        // target: 'http://localhost:3001', // 本地开发环境
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      shared: path.resolve(__dirname, '../packages/shared/src'),
    },
  },
  optimizeDeps: {
    include: ['shared'],
  },
})
