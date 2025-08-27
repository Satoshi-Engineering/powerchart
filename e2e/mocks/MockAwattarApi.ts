import {
  defineEventHandler,
  getValidatedQuery,
  readValidatedBody,
} from 'h3'
import { z } from 'zod'

import { AwattarPrice } from '~~/shared/data/AwattarPrice'
import { MockApiBase } from './MockApiBase'

export class MockAwattarApi extends MockApiBase {
  protected mockName: string = 'MockAwattarApi'
  protected data: Record<string, AwattarPrice[]> = {}

  protected override initRoutes() {
    this.initGetDataRoute()
    this.initSetDataRoute()
  }

  protected constructor() {
    super()
  }

  protected initGetDataRoute() {
    this.router.get(
      '/v1/marketdata',
      defineEventHandler(async (event) => {
        const { start } = await getValidatedQuery(
          event,
          z.object({
            start: z.string(),
          }).parse,
        )
        if (this.data[start]) {
          return {
            object: 'list',
            data: this.data[start],
            url: '/at/v1/marketdata',
          }
        }
        return {
          object: 'list',
          data: [],
          url: '/at/v1/marketdata',
        }
      }),
    )
  }

  protected initSetDataRoute() {
    this.router.post(
      '/mock/setdata',
      defineEventHandler(async (event) => {
        const { start, data } = await readValidatedBody(
          event,
          z.object({
            start: z.string(),
            data: AwattarPrice.array(),
          }).parse,
        )
        this.data[start] = data
      }),
    )
    this.router.post(
      '/mock/flushdata',
      defineEventHandler(async () => {
        this.data = {}
      }),
    )
  }
}
