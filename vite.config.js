import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep heavy 3D libraries separate
            if (id.includes('three') || id.includes('@react-three') || id.includes('three-stdlib') || id.includes('@react-spring')) {
              return 'vendor-3d';
            }
            // Keep Firebase database/auth separate
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'vendor-firebase';
            }
            // Keep animations separate
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // Keep charts (Recharts, D3) separate
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Keep math/markdown parsing separate
            if (id.includes('katex') || id.includes('rehype-katex') || id.includes('remark-math') || id.includes('react-markdown')) {
              return 'vendor-katex';
            }
            // Keep avatar libraries separate
            if (id.includes('@dicebear') || id.includes('multiavatar')) {
              return 'vendor-avatars';
            }
            // Keep Supabase separate
            if (id.includes('supabase') || id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Keep Lucide icons separate
            if (id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Core UI React/Router/Zustand
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('zustand') || id.includes('scheduler')) {
              return 'vendor-core';
            }
            return 'vendor-misc';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        proxyTimeout: 30000,
        timeout: 30000,
      },
    },
  },
})
