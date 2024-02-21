import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      host: env.VITE_HOST,
      port: parseInt(env.VITE_PORT, 10),
      https:
        env.VITE_NODE_ENV === 'development'
          ? {
              key: fs.readFileSync(path.resolve(__dirname, './.cert/key.pem')),
              cert: fs.readFileSync(path.resolve(__dirname, './.cert/cert.pem')),
            }
          : undefined,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['**/*'],
        devOptions: {
          enabled: true,
        },
        workbox: {
          globPatterns: ['**/*.{js,jsx,css,html,pdf,json}'],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => {
                return url.pathname.startsWith('/');
              },
              handler: 'NetworkFirst',
              options: {
                cacheName: 'everytrack-cache',
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        manifest: {
          name: 'Everytrack',
          short_name: 'Everytrack',
          description: 'Everything tracked.',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          theme_color: '#F3F4F6',
          background_color: '#FFFFFF',
          icons: [
            {
              src: '/apple_touch_icons/apple_touch_icon_57x57.png',
              sizes: '48x48',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_72x72.png',
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_76x76.png',
              sizes: '76x76',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_114x114.png',
              sizes: '114x114',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_120x120.png',
              sizes: '120x120',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_144x144.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_152x152.png',
              sizes: '152x152',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon_180x180.png',
              sizes: '180x180',
              type: 'image/png',
            },
            {
              src: '/apple_touch_icons/apple_touch_icon.png',
              sizes: '194x194',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, './src/api'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@consts': path.resolve(__dirname, './src/consts'),
        '@config': path.resolve(__dirname, './src/config'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@tftypes': path.resolve(__dirname, './src/types'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@features': path.resolve(__dirname, './src/features'),
        '@components': path.resolve(__dirname, './src/components'),
      },
    },
  };
});
