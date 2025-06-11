import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test('surrounding layout', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('the-default-layout')).toHaveCount(1)
  await expect(page.getByTestId('layout-header')).toHaveCount(1)
  await expect(page.getByTestId('layout-main')).toHaveCount(1)
  await expect(page.getByTestId('layout-footer')).toHaveCount(1)
})

test('disable surrounding layout', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('checkbox-disable-surrounding-layout').check()

  await expect(page.getByTestId('the-default-layout')).toHaveCount(0)
  await expect(page.getByTestId('layout-header')).toHaveCount(0)
  await expect(page.getByTestId('layout-main')).toHaveCount(0)
  await expect(page.getByTestId('layout-footer')).toHaveCount(0)
  expect(page.url()).toContain('disableSurroundingLayout=true')
})

test('disable surrounding layout via url', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table?disableSurroundingLayout=true')

  await expect(page.getByTestId('the-default-layout')).toHaveCount(0)
  await expect(page.getByTestId('layout-header')).toHaveCount(0)
  await expect(page.getByTestId('layout-main')).toHaveCount(0)
  await expect(page.getByTestId('layout-footer')).toHaveCount(0)
})

test('reenable surrounding layout via url', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table?disableSurroundingLayout=true')

  await page.getByTestId('checkbox-disable-surrounding-layout').uncheck()

  await expect(page.getByTestId('the-default-layout')).toHaveCount(1)
  await expect(page.getByTestId('layout-header')).toHaveCount(1)
  await expect(page.getByTestId('layout-main')).toHaveCount(1)
  await expect(page.getByTestId('layout-footer')).toHaveCount(1)
  expect(page.url()).not.toContain('disableSurroundingLayout=true')
})
