import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { networkInterfaces } from 'node:os'
import { fileURLToPath, URL } from 'node:url'

function getNetworkIp() {
  const nets = networkInterfaces()
  for (const infos of Object.values(nets)) {
    for (const net of infos || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return '127.0.0.1'
}

const DEV_PORT = 5173
const networkIp = getNetworkIp()

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    tailwindcss(),
    ViteImageOptimizer({
      jpg: { quality: 75 },
      jpeg: { quality: 75 },
      png: { quality: 75 },
      webp: { quality: 75 },
    }),
    compression({
      algorithms: ['gzip'],
      threshold: 1024,
      include: /\.(html|xml|css|js|mjs|json|svg|txt|md|map|wasm|ttf|otf|woff2?)$/i,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: DEV_PORT,
    open: `http://${networkIp}:${DEV_PORT}`,
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 800,
  },
})
