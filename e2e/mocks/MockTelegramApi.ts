import {
  defineEventHandler,
  readValidatedBody,
} from 'h3'
import { z } from 'zod'
import { MockApiBase } from './MockApiBase'

export class MockTelegramApi extends MockApiBase {
  protected messages: Array<{ chat_id: number, text: string }> = []

  protected getLastMessage() {
    return this.messages[this.messages.length - 1]
  }

  protected override initRoutes(): void {
    this.initSendMessageRoute()
    this.initGetLastMessageRoute()
  }

  protected initSendMessageRoute() {
    const token = process.env.NUXT_TELEGRAM_SENDER_TOKEN
    const path = `/bot${token}/sendMessage`

    this.router.post(
      path,
      defineEventHandler(async (event) => {
        const { chat_id, text } = await readValidatedBody(
          event,
          z.object({
            chat_id: z.number(),
            text: z.string(),
          }).parse,
        )
        this.messages.push({ chat_id, text })
        return { ok: true }
      }),
    )
  }

  protected initGetLastMessageRoute() {
    this.router.get(
      '/mock/lastMessage',
      defineEventHandler(async () => {
        const lastMessage = this.getLastMessage()
        if (!lastMessage) {
          return { error: 'No messages found' }
        }
        return lastMessage
      }),
    )
  }
}
