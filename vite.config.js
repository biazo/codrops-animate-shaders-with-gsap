import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      // Use a relative alias instead of an absolute one
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        demo1: resolve(__dirname, 'index.html'),
        demo2: resolve(__dirname, 'index2.html'),
        demo3: resolve(__dirname, 'index3.html'),
        demo4: resolve(__dirname, 'index4.html'),
      },
    },
  },
});
