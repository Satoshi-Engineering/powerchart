import { FetchError } from 'ofetch'
import { beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { fetchTyped } from '../mocks/utils/fetchTyped'

import { fetchWithRateLimiting } from './fetchWithRateLimiting'
import { ErrorCode } from '#shared/utils/ErrorCode'

describe('InMemoryCache', () => {
  beforeEach(() => {
    fetchTyped.mockClear()
  })

  it('should return the data', async () => {
    const data = await fetchWithRateLimiting(
      'https://api.example.com/data',
      z.object({
        data: z.string(),
      }),
    )
    expect(data).toEqual({ data: 'mocked data' })
  })

  it('should throw an error with code apiRateLimitReached on 429', async () => {
    const error = new FetchError('Rate limit exceeded')
    error.status = 429
    fetchTyped.mockRejectedValueOnce(error)

    await expect(() => fetchWithRateLimiting(
      'https://api.example.com/rate-limited',
      z.object({
        data: z.string(),
      }),
    )).rejects.toMatchObject({
      code: ErrorCode.enum.apiRateLimitReached,
    })

    expect(fetchTyped).toHaveBeenCalledOnce()
  })

  it('should not call fetchTyped again if the first call failed with 429', async () => {
    await expect(() => fetchWithRateLimiting(
      'https://api.example.com/rate-limited',
      z.object({
        data: z.string(),
      }),
    )).rejects.toMatchObject({
      code: ErrorCode.enum.apiRateLimitWaiting,
    })

    expect(fetchTyped).not.toHaveBeenCalled()
  })

  it('should throw an error', async () => {
    const error = new FetchError('Random error')
    fetchTyped.mockRejectedValueOnce(error)

    await expect(() => fetchWithRateLimiting(
      'https://anotherapi.example.com/broken-route',
      z.object({
        data: z.string(),
      }),
    )).rejects.toThrow(FetchError)

    expect(fetchTyped).toHaveBeenCalledOnce()
  })

  it('should call the api again after an error', async () => {
    const error = new FetchError('Random error')
    fetchTyped.mockRejectedValueOnce(error)
    await expect(() => fetchWithRateLimiting(
      'https://athirdapi.example.com/temporarily-broken-route',
      z.object({
        data: z.string(),
      }),
    )).rejects.toThrow(FetchError)

    const data = await fetchWithRateLimiting(
      'https://athirdapi.example.com/temporarily-broken-route',
      z.object({
        data: z.string(),
      }),
    )
    expect(data).toEqual({ data: 'mocked data' })

    expect(fetchTyped).toHaveBeenCalledTimes(2)
  })
})
