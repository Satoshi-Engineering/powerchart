import { test, expect, request } from '@playwright/test'

import { dataApr7 } from '~~/e2e/mocks/data/2025-04-07'
import { dataApr8 } from '~~/e2e/mocks/data/2025-04-08'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

const currentDate = new Date('2025-04-08T10:00:00+02:00')

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1743976800000',
      data: dataApr7,
    },
  })
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1744063200000',
      data: dataApr8,
    },
  })
})

test('add fixed costs', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('input-fixed-costs').fill('8')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('16.20')
  expect(page.url()).toBe('http://localhost:3000/table?fixedCosts=8')
})

test('deeplink with fixed costs', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/table?fixedCosts=8')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('16.20')
})

test('remove fixed costs', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table?fixedCosts=8')

  await page.getByTestId('input-fixed-costs').fill('')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  expect(page.url()).toBe('http://localhost:3000/table')
})
