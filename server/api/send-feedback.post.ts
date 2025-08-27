import TelegramSender from 'telegram-sender'

import { FeedbackFormDto } from '~~/shared/data/FeedbackFormDto'

const config = useRuntimeConfig()

const sender = new TelegramSender({
  token: config.telegramSender.token,
  defaultChatId: config.telegramSender.feedbackChatId,
  messagePrefix: config.telegramSender.messagePrefix ?? undefined,
  messageMaxLength: config.telegramSender.messageMaxLength ?? 4000,
  telegramApiOriginOverride: config.telegramSender.telegramApiOriginOverride || undefined,
})

export default defineEventHandlerWithErrorCodes(async (event): Promise<object> => {
  const { contact, message } = await readValidatedBody(
    event,
    FeedbackFormDto.parse,
  )

  await sender.sendMessage({
    message: contact
      ? `❤️ USER FEEDBACK ❤️\n${contact}\n${message}`
      : `❤️ USER FEEDBACK ❤️\n${message}`,
  })

  return {}
})
