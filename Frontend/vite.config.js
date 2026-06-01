import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Avoid node_modules/.vite — OneDrive often locks it and causes EPERM on Windows
  cacheDir: '.vite',
})
