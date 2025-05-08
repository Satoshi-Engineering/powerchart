import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import INLINE_ELEMENTS from 'eslint-plugin-vue/lib/utils/inline-non-void-elements.json' with { type: 'json' }

export default createConfigForNuxt({
  features: {
    stylistic: {
      semi: false,
      indent: 2,
      quotes: 'single',
      arrowParens: true,
      braceStyle: '1tbs',
      jsx: false,
    },
  },
})
  .overrideRules({
    'vue/singleline-html-element-content-newline': ['error', {
      ignores: [...INLINE_ELEMENTS, 'LinkDefault'],
    }],
  })
