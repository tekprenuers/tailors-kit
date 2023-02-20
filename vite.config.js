import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const pwaPlugin = VitePWA({
  config: require('./pwa.config.js'),
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwaPlugin]
})
