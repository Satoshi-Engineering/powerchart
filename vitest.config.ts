import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    exclude: [
      'e2e/**',
      '**/node_modules/**',
    ],
  },
})
