import type { NitroFetchOptions } from 'nitropack'
import { FetchError } from 'ofetch'
import type { ZodTypeAny, z } from 'zod'

import { ErrorCode } from '#shared/utils/ErrorCode'

export const fetchWithRateLimiting = async <Schema extends ZodTypeAny>(
  url: string,
  schema: Schema,
  options?: NitroFetchOptions<string, 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'>,
): Promise<z.infer<Schema>> => {
  const urlObject = new URL(url)
  assertRateLimit(urlObject.origin)

  try {
    return await fetchTyped(url, schema, options)
  } catch (error) {
    if (
      !(error instanceof FetchError)
      || error.status !== 429
    ) {
      throw error
    }

    handleRateLimitError(urlObject.origin)
  }
}

type origin = string
const waitTime = 2 // minutes
const waitWithRequestsUntil: Record<origin, Date | undefined> = {}

const assertRateLimit = (origin: origin) => {
  if (waitWithRequestsUntil[origin] == null) {
    return
  }
  if (waitWithRequestsUntil[origin] > new Date()) {
    throw new ErrorWithCode(`API rate limit waiting for recovery: ${origin}`, ErrorCode.enum.apiRateLimitWaiting)
  }
  waitWithRequestsUntil[origin] = undefined
}

const handleRateLimitError = (origin: origin) => {
  waitWithRequestsUntil[origin] = new Date(Date.now() + waitTime * 60 * 1_000)
  throw new ErrorWithCode(`API rate limit exceeded for: ${origin}`, ErrorCode.enum.apiRateLimitReached)
}
