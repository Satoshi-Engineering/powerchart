import {
  type EventHandler,
  type EventHandlerRequest,
  type EventHandlerObject,
  defineEventHandler,
} from 'h3'

import { ErrorCode } from '#shared/utils/ErrorCode'
import { isErrorWithCode } from '#shared/utils/ErrorWithCode'

type DefineEventHandlerWithErrorCodes = <Request extends EventHandlerRequest, Response>(handler: EventHandler<Request, Response> | EventHandlerObject<Request, Response>) => EventHandler<Request, Promise<Response>>
export const defineEventHandlerWithErrorCodes: DefineEventHandlerWithErrorCodes = (handler) => {
  if (typeof handler === 'function') {
    return defineEventHandlerWrapper({ handler })
  }
  return defineEventHandlerWrapper(handler)
}

type DefineEventHandlerWrapper = <Request extends EventHandlerRequest, Response>(handlerObject: EventHandlerObject<Request, Response>) => EventHandler<Request, Promise<Response>>
const defineEventHandlerWrapper: DefineEventHandlerWrapper = ({
  onRequest,
  handler,
}) =>
  defineEventHandler({
    onRequest,
    handler: async (event) => {
      try {
        return await handler(event)
      } catch (error) {
        if (!isErrorWithCode(error)) {
          throw error
        }
        let statusCode = 400
        if (error.code === ErrorCode.enum.maintenanceMode) {
          statusCode = 503
        }
        throw createError({
          statusCode,
          statusMessage: error.code,
          message: error.message,
        })
      }
    },
  })
