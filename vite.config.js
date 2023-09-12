import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  define: {
    'process.env': {},
    // 'global.window': 'window'
    // global: {}
  },
  build: {
    lib: {
      entry: path.resolve(
        __dirname,
        'hydra-element.js'
      ),
      name: 'hydra-element',
      fileName: (format) =>
        format == "umd" ?
        `hydra-element.js` :
        `hydra-element.${format}.js`,
    },
    minify: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})