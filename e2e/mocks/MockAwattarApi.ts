import { createServer } from 'node:http'

import {
  createApp,
  createRouter,
  defineEventHandler,
  getValidatedQuery,
  readValidatedBody,
  toNodeListener,
  type Router,
} from 'h3'
import { z } from 'zod'

import { AwattarPrice } from '~~/shared/data/AwattarPrice'

import { dataSwitchToSummerTime } from '~~/e2e/mocks/data/2024-03-31'
import { dataReturnToStandardTimeResponse } from '~~/e2e/mocks/data/2024-10-27'
import { dataMay12 } from '~~/e2e/mocks/data/2025-05-12'

export class MockAwattarApi {
  static async init(port: number) {
    if (this.instance) {
      throw new Error('MockAwattarApi already initialized')
    }
    this.instance = new MockAwattarApi()
    this.status = 'started'
    await this.instance.startServer(port)
    this.status = 'running'
    console.info(`MockAwattarApi running on port ${port}`)
  }

  static async stop() {
    if (this.status !== 'running') {
      throw new Error('MockAwattarApi stop called when not running')
    }
    this.status = 'stopping'
    await this.instance.stopServer()
    this.status = 'stopped'
    console.info('MockAwattarApi stopped')
  }

  public readonly router: Router

  protected static instance: MockAwattarApi
  protected static status: 'started' | 'running' | 'stopping' | 'stopped'

  protected app
  protected server
  protected data: Record<string, AwattarPrice[]> = {}

  protected constructor() {
    this.app = createApp()
    this.router = createRouter()
    this.app.use(this.router)
    this.server = createServer(toNodeListener(this.app))
    this.initData()
    this.initGetDataRoute()
    this.initSetDataRoute()
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
  }

  protected initData() {
    this.data['1711839600000'] = dataSwitchToSummerTime
    this.data['1729980000000'] = dataReturnToStandardTimeResponse
    this.data['1747000800000'] = dataMay12
  }

  protected startServer(port: number) {
    return new Promise((resolve, reject) => {
      this.server.on('error', reject)
      this.server.listen(port, () => {
        resolve(this.server)
      })
    })
  }

  protected stopServer() {
    return new Promise<void>((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
