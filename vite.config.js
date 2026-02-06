import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "192.168.2.65",
    port: 8080,
  },
  plugins: [react()]
})
