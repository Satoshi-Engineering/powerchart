import { test, expect, request } from '@playwright/test'

import { dataMay13 } from '~~/e2e/mocks/data/2025-05-13'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test('data next day is not available', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).toBeDisabled()
})

test('data next day is available', async ({ page }) => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1747087200000',
      data: dataMay13,
    },
  })
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).not.toBeDisabled()
})

test('data next day is cached', async ({ page }) => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1747087200000',
      data: [],
    },
  })
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).not.toBeDisabled()
})
