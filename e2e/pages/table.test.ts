import { test, expect, request } from '@playwright/test'

import { dataApr7 } from '~~/e2e/mocks/data/2025-04-07'
import { dataApr8 } from '~~/e2e/mocks/data/2025-04-08'
import { dataApr9 } from '~~/e2e/mocks/data/2025-04-09'
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

test('price table renders all hours', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/table')

  await expect(page.getByTestId('electricity-prices-table')).toBeVisible()
  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"]')).toHaveCount(24)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"]')).toHaveCount(24)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
})

test('price table hightlights the current hour', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/table')

  for (let i = 0; i < 24; i++) {
    await expect(page.locator('[data-testid="price-item"][data-test-day="prev"]').nth(i)).not.toHaveClass(/.*border-black.*/)
    if (i === 10) {
      await expect(page.locator('[data-testid="price-item"][data-test-day="current"]').nth(i)).toHaveClass(/.*border-black.*/)
    } else {
      await expect(page.locator('[data-testid="price-item"][data-test-day="current"]').nth(i)).not.toHaveClass(/.*border-black.*/)
    }
  }
})

test('cell background colors depend on price', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/table')

  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveText('4.39')
  await expect(page.locator('[data-testid="price-item"][data-test-day="prev"][data-test-hour="12"]')).toHaveClass(/.*bg-green-200.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveText('17.99')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="7"]')).toHaveClass(/.*bg-red-300.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveText('13.68')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="8"]')).toHaveClass(/.*bg-orange-200.*/)
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveClass(/.*bg-yellow-100.*/)
})

test('next day is missing', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/table')

  await expect(page.locator('[data-testid="price-item"][data-test-day="next"]')).toHaveCount(0)
  await expect(page.getByTestId('button-next-day')).toBeDisabled()
})

test('next day is available', async ({ page }) => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1744149600000',
      data: dataApr9,
    },
  })
  await page.clock.setFixedTime(new Date('2025-04-08T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/table')

  await expect(page.locator('[data-testid="price-item"][data-test-day="next"]')).toHaveCount(24)
  await expect(page.getByTestId('button-next-day')).toBeEnabled()
})
