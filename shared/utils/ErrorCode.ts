import z from 'zod'

export const ErrorCode = z.enum([
  'maintenanceMode',
])
export type ErrorCode = z.infer<typeof ErrorCode>
