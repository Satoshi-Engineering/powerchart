import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    exclude: [
      'e2e/**',
      'e2e-stromchart/**',
      '**/node_modules/**',
    ],
    include: [
      '**/*.test.ts',
    ],
  },
})
