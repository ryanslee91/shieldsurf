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
        options:    resolve(__dirname, 'src/options/options.ts'),
        // 팝업 없는 버전이라면 popup 엔트리 불필요
      },
      output: {
        entryFileNames: chunk => {
          return chunk.name === 'options'
            ? 'options/[name].js'
            : '[name].js';
        },

        assetFileNames: assetInfo => {
          // assetInfo.name 예시: 'options.css', 'background.css' 등
          const name = assetInfo.name || '';
          // options 관련 CSS만 폴더 안으로
          if (name.startsWith('options') && name.endsWith('.css')) {
            return 'options/[name].[ext]';
          }
          // 나머지는 기본 플랫
          return '[name].[ext]';
        }
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
