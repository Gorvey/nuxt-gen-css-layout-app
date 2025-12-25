// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // 你的自定义配置
  {
    // 关闭所有与 Prettier 冲突的规则
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/semi': 'off',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/single-word-component-names': 'off',
    },
  },
  // Prettier 配置必须在最后，以覆盖其他规则
  ...withNuxt(),
  {
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  }
)
