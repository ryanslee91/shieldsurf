import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    resolve: {
    alias: {
      '@utils': resolve(__dirname, 'src/utils'),
      // 필요한 다른 별칭도 추가 가능
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/background.ts'),
        // 팝업 없는 버전이라면 popup 엔트리 불필요
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    emptyOutDir: true
  },
  plugins: [
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'icons', dest: 'dist' }, // 아이콘 폴더도 함께
        { src: 'src/options/options.html', dest: 'dist/options' }
      ],
      hook: 'writeBundle'
    })
  ]
});
