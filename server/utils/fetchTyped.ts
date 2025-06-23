import type { NitroFetchOptions } from 'nitropack'
import type { ZodTypeAny, z } from 'zod'

export const fetchTyped = async <Schema extends ZodTypeAny>(
  url: string,
  schema: Schema,
  options?: NitroFetchOptions<string, 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'>,
): Promise<z.infer<Schema>> => {
  const data = await $fetch(
    url,
    options,
  )
  return schema.parse(data)
}
