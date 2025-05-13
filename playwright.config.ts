import { defineConfig, devices } from '@playwright/test'
import { isCI, isWindows } from 'std-env'

export default defineConfig({
  tsconfig: './tsconfig.json',
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    timezoneId: 'Europe/Vienna',
  },
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run build; TZ=\'Europe/Vienna\' node --env-file=.env.e2e ./.output/server/index.mjs',
    url: 'http://localhost:3000/boot',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests */
  workers: 1,
  timeout: isWindows ? 60000 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  globalSetup: './e2e/mocks/mocks.setup',
  globalTeardown: './e2e/mocks/mocks.teardown',
  projects: [
    {
      name: 'chrome with mocks',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
