import { createServer } from 'node:http'

import {
  createApp,
  createRouter,
  toNodeListener,
  type Router,
} from 'h3'

export class MockApiBase {
  static async init<T extends MockApiBase>(
    this: typeof MockApiBase,
    port: number,
  ): Promise<T> {
    if (MockApiBase.instances.has(this.name)) {
      console.error(`${this.name} already initialized`)
      return this.getInstance() as T
    }
    const instance = new (this as unknown as new () => T)()
    MockApiBase.instances.set(this.name, instance)
    instance.status = 'started'
    await instance.startServer(port)
    instance.status = 'running'
    console.info(`${this.name} running on port ${port}`)
    return instance
  }

  static async stop() {
    const instance = this.getInstance()
    if (instance?.status !== 'running') {
      console.error(`${this.name} stop called when not running`)
      return
    }
    instance.status = 'stopping'
    await instance.stopServer()
    instance.status = 'stopped'
    console.info(`${this.name} stopped`)
    MockApiBase.instances.delete(this.name)
  }

  static getInstance<T extends MockApiBase>(this: typeof MockApiBase) {
    return MockApiBase.instances.get(this.name) as T | undefined
  }

  public readonly router: Router

  private static instances = new Map<string, unknown>()

  protected status: 'started' | 'running' | 'stopping' | 'stopped' = 'stopped'
  protected app
  protected server

  protected constructor() {
    this.app = createApp()
    this.router = createRouter()
    this.app.use(this.router)
    this.server = createServer(toNodeListener(this.app))
    this.initRoutes()
  }

  protected initRoutes(): void {
    console.warn(`${this.constructor.name}.initRoutes must be overridden`)
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
