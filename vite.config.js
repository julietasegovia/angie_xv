import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/angie_xv", // Set the base path for GitHub Pages deployment
  build: {
    outDir: 'build', // Changes the output folder from 'dist' to 'build'
  },
})
