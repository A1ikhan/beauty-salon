import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' — сайт работает из любой подпапки (например, на GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: './',
})
