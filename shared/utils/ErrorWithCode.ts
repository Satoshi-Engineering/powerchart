import { ErrorCode } from './ErrorCode'

export default class ErrorWithCode extends Error {
  constructor(message: string, readonly code: ErrorCode) {
    super(message)
    Object.setPrototypeOf(this, ErrorWithCode.prototype)
  }
}

export const isErrorWithCode = (error: unknown): error is ErrorWithCode => {
  return (
    error instanceof ErrorWithCode
    && ErrorCode.options.includes(error.code)
  )
}
