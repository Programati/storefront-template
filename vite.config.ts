import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Solo se carga con ANALYZE=1: el build normal, el de CI y el de Netlify no lo tocan.
const analyzerPlugins =
  process.env.ANALYZE === '1'
    ? [
        (await import('rolldown/experimental')).bundleAnalyzerPlugin({
          format: 'md',
        }),
      ]
    : []

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  build: {
    rolldownOptions: { plugins: analyzerPlugins },
  },
  test: {
    // node por defecto: la mayoría son funciones puras. Los tests de componentes
    // piden el DOM por archivo con `// @vitest-environment jsdom`.
    environment: 'node',
  },
})
