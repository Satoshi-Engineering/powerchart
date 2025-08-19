import { z } from 'zod'

export const FeedbackFormDto = z.object({
  contact: z.string().optional(),
  message: z.string(),
})

export type FeedbackFormDto = z.infer<typeof FeedbackFormDto>
