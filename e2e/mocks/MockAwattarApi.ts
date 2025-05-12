import { createServer } from 'node:http'

import {
  createApp,
  createRouter,
  toNodeListener,
  type Router,
} from 'h3'

export class MockAwattarApi {
  static init(port: number) {
    if (this.instance) {
      throw new Error('MockAwattarApi already initialized')
    }
    this.instance = new MockAwattarApi(port)
    this.status = 'running'
  }

  static async stop() {
    if (this.status !== 'running') {
      throw new Error('MockAwattarApi stop called when not running')
    }
    this.status = 'stopping'
    await new Promise<void>((resolve, reject) => {
      this.instance.server.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
    console.info('MockAwattarApi stopped')
    this.status = 'stopped'
  }

  public readonly router: Router

  protected static instance: MockAwattarApi
  protected static status: 'started' | 'running' | 'stopping' | 'stopped' = 'started'

  protected app
  protected server

  protected constructor(port: number) {
    this.app = createApp()
    this.router = createRouter()
    this.app.use(this.router)

    this.server = createServer(toNodeListener(this.app)).listen(port)

    console.info(`MockAwattarApi running on port ${port}`)
  }
}
