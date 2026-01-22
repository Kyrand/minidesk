import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import electron from 'vite-plugin-electron/simple';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte(),
    electron({
      main: {
        entry: 'src/main/index.ts',
      },
      preload: {
        input: 'src/preload/preload.ts',
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      $lib: resolve(__dirname, './src/renderer/src/lib'),
      $components: resolve(__dirname, './src/renderer/src/components'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
