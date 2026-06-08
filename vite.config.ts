import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // react({
    //   babel: {
    //     plugins: [
    //       ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
    //     ],
    //   },
    // }),
  ],

  root: 'src/webview',

  build: {
    outDir: '../../dist/webview',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Inline assets for VS Code webview compatibility
        inlineDynamicImports: false,
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          store: ['zustand'],
          icons: ['lucide-react'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
      },
    },
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/webview'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@components': path.resolve(__dirname, 'src/webview/components'),
      '@features': path.resolve(__dirname, 'src/webview/features'),
      '@store': path.resolve(__dirname, 'src/webview/store'),
      '@hooks': path.resolve(__dirname, 'src/webview/hooks'),
      '@services': path.resolve(__dirname, 'src/webview/services'),
      '@utils': path.resolve(__dirname, 'src/webview/utils'),
      '@types': path.resolve(__dirname, 'src/webview/types'),
      '@constants': path.resolve(__dirname, 'src/webview/constants'),
      '@pages': path.resolve(__dirname, 'src/webview/pages'),
      '@layouts': path.resolve(__dirname, 'src/webview/layouts'),
      '@styles': path.resolve(__dirname, 'src/webview/styles'),
      '@assets': path.resolve(__dirname, 'src/webview/assets'),
    },
  },

  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'zustand', 'lucide-react'],
  },

  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.1.0'),
  },

  server: {
    port: 5173,
    hmr: true,
  },
});