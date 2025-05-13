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
        if (start === '1743289200000') {
          console.log('Returning startSummerTimeResponse')
          return startSummerTimeResponse
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
  url: 'https://api.awattar.at/v1/marketdata?start=1747000800000&end=1747087200000',
}

const startSummerTimeResponse = {
  object: 'list',
  data: [
    {
      start_timestamp: 1743289200000,
      end_timestamp: 1743292800000,
      marketprice: 46.22,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743292800000,
      end_timestamp: 1743296400000,
      marketprice: 15.88,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743296400000,
      end_timestamp: 1743300000000,
      marketprice: 5.09,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743300000000,
      end_timestamp: 1743303600000,
      marketprice: 1.2,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743303600000,
      end_timestamp: 1743307200000,
      marketprice: 0.09,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743307200000,
      end_timestamp: 1743310800000,
      marketprice: 0.72,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743310800000,
      end_timestamp: 1743314400000,
      marketprice: 0.75,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743314400000,
      end_timestamp: 1743318000000,
      marketprice: 1.11,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743318000000,
      end_timestamp: 1743321600000,
      marketprice: 0.06,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743321600000,
      end_timestamp: 1743325200000,
      marketprice: 0,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743325200000,
      end_timestamp: 1743328800000,
      marketprice: -1.65,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743328800000,
      end_timestamp: 1743332400000,
      marketprice: -15.98,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743332400000,
      end_timestamp: 1743336000000,
      marketprice: -23.41,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743336000000,
      end_timestamp: 1743339600000,
      marketprice: -24.02,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743339600000,
      end_timestamp: 1743343200000,
      marketprice: -12.34,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743343200000,
      end_timestamp: 1743346800000,
      marketprice: -4.05,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743346800000,
      end_timestamp: 1743350400000,
      marketprice: 1.36,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743350400000,
      end_timestamp: 1743354000000,
      marketprice: 39.82,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743354000000,
      end_timestamp: 1743357600000,
      marketprice: 92,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743357600000,
      end_timestamp: 1743361200000,
      marketprice: 86,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743361200000,
      end_timestamp: 1743364800000,
      marketprice: 78.95,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743364800000,
      end_timestamp: 1743368400000,
      marketprice: 77.85,
      unit: 'Eur/MWh',
    },
    {
      start_timestamp: 1743368400000,
      end_timestamp: 1743372000000,
      marketprice: 55.99,
      unit: 'Eur/MWh',
    },
  ],
  url: 'https://api.awattar.at/v1/marketdata?start=1743289200000&end=1743372000000',
}
