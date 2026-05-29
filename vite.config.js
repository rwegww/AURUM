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
    // The remaining large chunk is the isolated 3D lab runtime, not app-shell code.
    chunkSizeWarningLimit: 950,
    modulePreload: {
      resolveDependencies(_url, deps) {
        return deps.filter(dep => ![
          'vendor-3d',
          'vendor-charts',
          'vendor-katex',
        ].some(chunkName => dep.includes(chunkName)));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll('\\', '/');
          if (normalizedId.includes('node_modules')) {
            // Keep heavy 3D libraries separate without producing one giant chunk
            if (normalizedId.includes('@react-three/fiber')) {
              return 'vendor-3d-fiber';
            }
            if (normalizedId.includes('@react-three/drei') || normalizedId.includes('three-stdlib')) {
              return 'vendor-3d-drei';
            }
            if (normalizedId.includes('@react-spring')) {
              return 'vendor-3d-spring';
            }
            if (normalizedId.includes('node_modules/three')) {
              return 'vendor-3d-three';
            }
            // Keep animations separate
            if (normalizedId.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // Keep charts (Recharts, D3) separate
            if (normalizedId.includes('recharts') || normalizedId.includes('d3')) {
              return 'vendor-charts';
            }
            // Keep math/markdown parsing separate
            if (normalizedId.includes('katex') || normalizedId.includes('rehype-katex') || normalizedId.includes('remark-math') || normalizedId.includes('react-markdown')) {
              return 'vendor-katex';
            }
            // Keep avatar libraries separate
            if (normalizedId.includes('@dicebear') || normalizedId.includes('multiavatar')) {
              return 'vendor-avatars';
            }
            // Keep Supabase separate
            if (normalizedId.includes('supabase') || normalizedId.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Keep Lucide icons separate
            if (normalizedId.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Core UI React/Router/Zustand
            if (normalizedId.includes('react') || normalizedId.includes('react-dom') || normalizedId.includes('react-router-dom') || normalizedId.includes('zustand') || normalizedId.includes('scheduler')) {
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
