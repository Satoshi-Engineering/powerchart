import { test, expect, request } from '@playwright/test'

import { dataMay11 } from '~~/e2e/mocks/data/2025-05-11'
import { dataMay12 } from '~~/e2e/mocks/data/2025-05-12'
import { dataMay13 } from '~~/e2e/mocks/data/2025-05-13'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(dataMay11, dataMay12)
})

test('data next day is not available', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).toBeDisabled()
})

test('data next day not available is cached', async ({ page }) => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1747087200000',
      data: dataMay13,
    },
  })
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).toBeDisabled()
})

test('data next day is available', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-11T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).not.toBeDisabled()
})

test('data next day available is cached', async ({ page }) => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3050/mock/setdata', {
    data: {
      start: '1747000800000',
      data: [],
    },
  })
  await page.clock.setFixedTime(new Date('2025-05-11T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('button-next-day')).not.toBeDisabled()
})
