import z from 'zod'

export const ErrorCode = z.enum([
  'maintenanceMode',
  'apiRateLimitWaiting',
  'apiRateLimitReached',
])
export type ErrorCode = z.infer<typeof ErrorCode>
