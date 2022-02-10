import {defineConfig} from 'vite'
import {builtinModules} from 'module';

export default defineConfig({
  root: __dirname,
  envDir: process.cwd(),
  build: {
    outDir: '../dist/main-src/',
    minify: true,
    lib: {
      entry: './main.ts',
      formats: ['cjs'],
      fileName: 'main'
    },
    rollupOptions: {
      external: [
        'electron',
        'electron-devtools-installer',
        ...builtinModules,
        ...builtinModules.map(p => `node:${p}`),
      ],
      output: {
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  }
})