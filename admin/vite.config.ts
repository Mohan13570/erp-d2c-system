import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // No fixed base — both /admin/* and /portal/* are served from root.
  // BrowserRouter(basename="/admin") and BrowserRouter(basename="/portal")
  // each handle their own path prefix internally.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: false,
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
