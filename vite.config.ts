import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      host: env.VITE_HOST,
      port: parseInt(env.VITE_PORT, 10),
      https: {
        key: fs.readFileSync(path.resolve(__dirname, './.cert/key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, './.cert/cert.pem')),
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, './src/lib'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@tftypes': path.resolve(__dirname, './src/types'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@features': path.resolve(__dirname, './src/features'),
        '@components': path.resolve(__dirname, './src/components'),
      },
    },
  };
});
