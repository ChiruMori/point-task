import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 将所有 /api 开头的请求代理到后端的 3001 端口
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true, // 需要虚拟主机站点
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
