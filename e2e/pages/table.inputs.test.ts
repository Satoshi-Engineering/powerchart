import { test, expect, request } from '@playwright/test'

import { dataApr7 } from '~~/e2e/mocks/data/2025-04-07'
import { dataApr8 } from '~~/e2e/mocks/data/2025-04-08'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

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

test('add vat and fixed costs', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('checkbox-add-vat').check()
  await page.getByTestId('input-fixed-costs').fill('8')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('19.44')
  expect(page.url()).toBe('http://localhost:3000/table?vat=true&fixedCosts=8')
})

test('deeplink with vat and fixed costs', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/table?vat=true&fixedCosts=8')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('19.44')
})
