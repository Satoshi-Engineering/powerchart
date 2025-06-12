import { test, expect } from '@playwright/test'

import { dataApr7 } from '~~/e2e/mocks/data/2025-04-07'
import { dataApr8 } from '~~/e2e/mocks/data/2025-04-08'
import { dataApr9 } from '~~/e2e/mocks/data/2025-04-09'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

const currentDate = new Date('2025-04-08T10:00:00+02:00')

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(dataApr7, dataApr8, dataApr9)
})

test('price table renders with dynamic colors', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('checkbox-show-dynamic-colors').check()

  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveText('4.39')
  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveClass(/.*bg-lime-100.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveText('17.99')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveClass(/.*bg-red-200.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveText('13.68')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveClass(/.*bg-orange-100.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveClass(/.*bg-yellow-100.*/)
  expect(page.url()).toContain('dynamicColors=true')
})

test('price table renders with dynamic colors via url', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table?dynamicColors=true')

  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveText('4.39')
  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveClass(/.*bg-lime-100.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveText('17.99')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveClass(/.*bg-red-200.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveText('13.68')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveClass(/.*bg-orange-100.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveClass(/.*bg-yellow-100.*/)
})

test('disable dynamic colors', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table?dynamicColors=true')

  await page.getByTestId('checkbox-show-dynamic-colors').uncheck()

  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveText('4.39')
  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveClass(/.*bg-lime-100.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveText('17.99')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveClass(/.*bg-orange-200.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveText('13.68')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveClass(/.*bg-orange-100.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveClass(/.*bg-yellow-100.*/)
  expect(page.url()).not.toContain('dynamicColors=true')
})
