import { test, expect, request } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  locale: 'en-US',
  timezoneId: 'Europe/Vienna',
})

test('feedback form', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')
  const testContact = 'I am groot'
  const testFeedback = 'This is my very specific feedback text for testing'

  await page.getByTestId('open-feedback-form').click()
  const feedbackForm = page.getByTestId('feedback-form')
  await expect(feedbackForm).toBeVisible()
  await feedbackForm.locator('[name="message"]').fill(testFeedback)
  await feedbackForm.locator('[name="contact"]').fill(testContact)
  await feedbackForm.getByTestId('feedback-form-submit').click()

  await expect(page.getByTestId('feedback-form-success')).toBeVisible()
  const lastMessage = await getLastTelegramMessage()
  expect(lastMessage.chat_id).toEqual(expect.any(Number))
  expect(lastMessage.text).toEqual(expect.stringContaining(testContact))
  expect(lastMessage.text).toEqual(expect.stringContaining(testFeedback))
})

const getLastTelegramMessage = async () => {
  const telegramApiContext = await request.newContext()
  return await telegramApiContext.get('http://localhost:3060/mock/lastMessage').then((response) => response.json())
}
