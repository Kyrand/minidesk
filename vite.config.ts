import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import electron from 'vite-plugin-electron/simple';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable browser mode for tests
        dev: process.env.NODE_ENV !== 'production'
      }
    }),
    electron({
      main: {
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist/main',
            rollupOptions: {
              external: ['better-sqlite3'],
              output: {
                entryFileNames: 'index.js'
              }
            }
          }
        }
      },
      preload: {
        input: 'src/preload/preload.ts',
        vite: {
          build: {
            outDir: 'dist/preload',
            rollupOptions: {
              output: {
                entryFileNames: 'preload.js'
              }
            }
          }
        }
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      $lib: resolve(__dirname, './src/renderer/src/lib'),
      $components: resolve(__dirname, './src/renderer/src/components'),
    },
    conditions: ['browser', 'default'],
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
    alias: {
      // Force Svelte to use browser mode in tests
      'svelte/src/runtime': 'svelte/src/runtime/index.js',
    },
    server: {
      deps: {
        inline: ['svelte']
      }
    },
    resolve: {
      conditions: ['browser']
    }
  },
});
