import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default withVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      'docs/**',
      'dist/**',
      'node_modules/**',
      '_legacy/**',
      'public/**',
      '.history/**',
    ],
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    rules: {
      // 页面模块统一使用 index.vue，允许单单词文件名
      'vue/multi-word-component-names': 'off',
      // 统一 SFC 块顺序：template → script → style
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
    },
  },
  skipFormatting,
)
