import { createServer } from 'node:http'

import {
  createApp,
  createRouter,
  defineEventHandler,
  getQuery,
  toNodeListener,
  type Router,
} from 'h3'

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

  protected constructor() {
    this.app = createApp()
    this.router = createRouter()
    this.app.use(this.router)
    this.server = createServer(toNodeListener(this.app))

    this.router.get(
      '/v1/marketdata',
      defineEventHandler((event) => {
        const { start } = getQuery(event)
        if (start === '1711839600000') {
          return switchToSummerTimeResponse
        }
        if (start === '1729980000000') {
          return returnToStandardTimeResponse
        }
        return defaultResponse
      }),
    )
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

const defaultResponse = {
  object: 'list',
  data: [
    {
      start_timestamp: 1747000800000,
      end_timestamp: 1747004400000,
      marketprice: 89.52,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747004400000,
      end_timestamp: 1747008000000,
      marketprice: 84.6,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747008000000,
      end_timestamp: 1747011600000,
      marketprice: 84.15,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747011600000,
      end_timestamp: 1747015200000,
      marketprice: 84.78,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747015200000,
      end_timestamp: 1747018800000,
      marketprice: 88.21,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747018800000,
      end_timestamp: 1747022400000,
      marketprice: 98.92,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747022400000,
      end_timestamp: 1747026000000,
      marketprice: 132.58,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747026000000,
      end_timestamp: 1747029600000,
      marketprice: 140.98,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747029600000,
      end_timestamp: 1747033200000,
      marketprice: 103.9,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747033200000,
      end_timestamp: 1747036800000,
      marketprice: 69.74,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747036800000,
      end_timestamp: 1747040400000,
      marketprice: 5.88,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747040400000,
      end_timestamp: 1747044000000,
      marketprice: -1.99,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747044000000,
      end_timestamp: 1747047600000,
      marketprice: -5.26,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747047600000,
      end_timestamp: 1747051200000,
      marketprice: -11.11,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747051200000,
      end_timestamp: 1747054800000,
      marketprice: -20.94,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747054800000,
      end_timestamp: 1747058400000,
      marketprice: 6.21,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747058400000,
      end_timestamp: 1747062000000,
      marketprice: 62.93,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747062000000,
      end_timestamp: 1747065600000,
      marketprice: 72.58,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747065600000,
      end_timestamp: 1747069200000,
      marketprice: 100.98,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747069200000,
      end_timestamp: 1747072800000,
      marketprice: 124.06,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747072800000,
      end_timestamp: 1747076400000,
      marketprice: 117.16,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747076400000,
      end_timestamp: 1747080000000,
      marketprice: 103.92,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747080000000,
      end_timestamp: 1747083600000,
      marketprice: 99.95,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1747083600000,
      end_timestamp: 1747087200000,
      marketprice: 90.49,
      unit: 'Eur/MWh',
    },
  ],
  url: '/at/v1/marketdata',
}

const switchToSummerTimeResponse = {
  object: 'list',
  data: [
    {
      start_timestamp: 1711839600000,
      end_timestamp: 1711843200000,
      marketprice: 56.91,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711843200000,
      end_timestamp: 1711846800000,
      marketprice: 37.09,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711846800000,
      end_timestamp: 1711850400000,
      marketprice: 17.66,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711850400000,
      end_timestamp: 1711854000000,
      marketprice: 15.96,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711854000000,
      end_timestamp: 1711857600000,
      marketprice: 29.91,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711857600000,
      end_timestamp: 1711861200000,
      marketprice: 30.33,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711861200000,
      end_timestamp: 1711864800000,
      marketprice: 32.64,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711864800000,
      end_timestamp: 1711868400000,
      marketprice: 2.46,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711868400000,
      end_timestamp: 1711872000000,
      marketprice: 0.06,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711872000000,
      end_timestamp: 1711875600000,
      marketprice: -31.39,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711875600000,
      end_timestamp: 1711879200000,
      marketprice: -14.79,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711879200000,
      end_timestamp: 1711882800000,
      marketprice: -13.27,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711882800000,
      end_timestamp: 1711886400000,
      marketprice: -3.91,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711886400000,
      end_timestamp: 1711890000000,
      marketprice: -0.57,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711890000000,
      end_timestamp: 1711893600000,
      marketprice: -12.48,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711893600000,
      end_timestamp: 1711897200000,
      marketprice: 2.43,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711897200000,
      end_timestamp: 1711900800000,
      marketprice: 35,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711900800000,
      end_timestamp: 1711904400000,
      marketprice: 48.35,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711904400000,
      end_timestamp: 1711908000000,
      marketprice: 64.92,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711908000000,
      end_timestamp: 1711911600000,
      marketprice: 56.96,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711911600000,
      end_timestamp: 1711915200000,
      marketprice: 66.17,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711915200000,
      end_timestamp: 1711918800000,
      marketprice: 61.25,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1711918800000,
      end_timestamp: 1711922400000,
      marketprice: 44.99,
      unit: 'Eur/MWh',
    },
  ],
  url: '/at/v1/marketdata',
}

const returnToStandardTimeResponse = {
  object: 'list',
  data: [
    {
      start_timestamp: 1729980000000,
      end_timestamp: 1729983600000,
      marketprice: 92.68,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1729983600000,
      end_timestamp: 1729987200000,
      marketprice: 84.07,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1729987200000,
      end_timestamp: 1729990800000,
      marketprice: 82.23,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1729990800000,
      end_timestamp: 1729994400000,
      marketprice: 80.43,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1729994400000,
      end_timestamp: 1729998000000,
      marketprice: 74.44,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1729998000000,
      end_timestamp: 1730001600000,
      marketprice: 76.21,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730001600000,
      end_timestamp: 1730005200000,
      marketprice: 87.3,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730005200000,
      end_timestamp: 1730008800000,
      marketprice: 86.43,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730008800000,
      end_timestamp: 1730012400000,
      marketprice: 87.75,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730012400000,
      end_timestamp: 1730016000000,
      marketprice: 83.92,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730016000000,
      end_timestamp: 1730019600000,
      marketprice: 66.18,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730019600000,
      end_timestamp: 1730023200000,
      marketprice: 54.72,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730023200000,
      end_timestamp: 1730026800000,
      marketprice: 42.5,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730026800000,
      end_timestamp: 1730030400000,
      marketprice: 39.99,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730030400000,
      end_timestamp: 1730034000000,
      marketprice: 40,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730034000000,
      end_timestamp: 1730037600000,
      marketprice: 64.98,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730037600000,
      end_timestamp: 1730041200000,
      marketprice: 117.38,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730041200000,
      end_timestamp: 1730044800000,
      marketprice: 131.12,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730044800000,
      end_timestamp: 1730048400000,
      marketprice: 141.72,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730048400000,
      end_timestamp: 1730052000000,
      marketprice: 141.92,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730052000000,
      end_timestamp: 1730055600000,
      marketprice: 134.38,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730055600000,
      end_timestamp: 1730059200000,
      marketprice: 123.51,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730059200000,
      end_timestamp: 1730062800000,
      marketprice: 117.04,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730062800000,
      end_timestamp: 1730066400000,
      marketprice: 116,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1730066400000,
      end_timestamp: 1730070000000,
      marketprice: 102.99,
      unit: 'Eur/MWh',
    },
  ],
  url: '/at/v1/marketdata',
}
