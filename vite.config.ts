import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//自动引入插件
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        //todo 配置proxy - 后面改为后端服务端口
        target: 'http://127.0.0.1:8001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    react(),
    //减少 import 导入的插件
    AutoImport({
      imports: ['react']
    })
  ],
  optimizeDeps: {
    include: ['fabric']   // 强制预构建 fabric
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
