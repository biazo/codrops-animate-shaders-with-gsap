import { fileURLToPath } from 'url'
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      input: {
        demo1: fileURLToPath(new URL('./index.html', import.meta.url)),
        demo2: fileURLToPath(new URL('./index2.html', import.meta.url)),
        demo3: fileURLToPath(new URL('./index3.html', import.meta.url)),
        demo4: fileURLToPath(new URL('./index4.html', import.meta.url)),
      },
    },
  },
});
