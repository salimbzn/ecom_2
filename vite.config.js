import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  server: {
    historyApiFallback: true, // ✅ This is the key line!
  }
  ,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
