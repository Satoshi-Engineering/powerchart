import { consola } from 'consola'
import TelegramSender from 'telegram-sender'
import consoleHooks from 'console-hooks'

const config = useRuntimeConfig()

const initErrorLogging = () => {
  consola.info('Init Telegram Error Logging')

  const telegramSender = initTelegramSender()

  consoleHooks({
    onError: async (message: string) => {
      await telegramSender?.sendMessage({ message })
    },
  })
}

const initTelegramSender = () => {
  if (
    config.telegramSender.token.length === 0
    || config.telegramSender.defaultChatId.length === 0
  ) {
    consola.warn('TelegramSender token or defaultChatId are not set.\nWill not send error messages to Telegram.')
    return null
  }

  return new TelegramSender({
    token: config.telegramSender.token,
    defaultChatId: config.telegramSender.defaultChatId,
    messagePrefix: config.telegramSender.messagePrefix ?? undefined,
    messageMaxLength: config.telegramSender.messageMaxLength ?? 4000,
  })
}

export default defineNitroPlugin(initErrorLogging)
