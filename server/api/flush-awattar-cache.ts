import { flushCache } from '~~/server/services/loadAwattarPrices'

export default defineEventHandlerWithErrorCodes(async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 403,
      statusMessage: 'This is only allowed during development or testing',
    })
  }
  flushCache()
})
