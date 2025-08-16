import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'pages/Home/index.html',
        projects: 'pages/Projects/index.html',
        skills: 'pages/About-me/index.html',
        contact: 'pages/contact-me/index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'src'
})