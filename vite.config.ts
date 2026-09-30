import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'node', // son funciones puras, no tocan el DOM. Cuando testeemos componentes (Fase 13), ahí sí vamos a necesitar 'jsdom'.
  },
})
