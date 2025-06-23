import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test('footer link to privacy policy opens in new tab', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.getByRole('link', { name: 'Privacy policy' }).click(),
  ])

  await newPage.waitForLoadState()
  expect(newPage.url()).toContain('/privacy-policy')
})

test('footer link to legal notice opens in new tab', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.getByRole('link', { name: 'Legal notice' }).click(),
  ])

  await newPage.waitForLoadState()
  expect(newPage.url()).toContain('/legal-notice')
})

test('footer link to github opens in new tab', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.getByRole('link', { name: 'GitHub' }).click(),
  ])

  await newPage.waitForLoadState()
  expect(newPage.url()).toBe('https://github.com/Satoshi-Engineering/powerchart')
})
