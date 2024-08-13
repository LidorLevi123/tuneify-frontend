import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      VitePWA({
        manifest: {
          name: 'Tuneify',
          short_name: 'Tuneify',
          version: env.VITE_TUNEIFY_VERSION,
          theme_color: '#1ed760',
          background_color: '#000000',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/icons/192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    build: {
      outDir: '../backend/public',
      emptyOutDir: true,
    },
  }
})

