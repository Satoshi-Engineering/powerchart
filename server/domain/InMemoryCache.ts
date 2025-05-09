type CacheOptions =
  | { until: Date, forMS?: never }
  | { forMS: number, until?: never }

export default class InMemoryCache<T> {
  cacheValue(key: string, value: T, options: CacheOptions): void {
    const expiresAt = options.until !== undefined
      ? options.until.getTime()
      : Date.now() + options.forMS

    this.store.set(key, { value, expiresAt })
  }

  deleteValue(key: string) {
    this.store.delete(key)
  }

  clearAllValues() {
    this.store.clear()
  }

  getValue(key: string): T {
    const cached = this.store.get(key)

    if (!cached) {
      throw new Error(`Key not found: ${key}`)
    }

    if (Date.now() > cached.expiresAt) {
      this.deleteValue(key)
      throw new Error(`Key expired: ${key}`)
    }

    return cached.value
  }

  getExpiredValue(key: string): T {
    const cached = this.store.get(key)

    if (!cached) {
      throw new Error(`Key not found: ${key}`)
    }

    return cached.value
  }

  safeGetValue(key: string): T | undefined {
    try {
      return this.getValue(key)
    } catch {
      return undefined
    }
  }

  safeGetExpiredValue(key: string): T | undefined {
    try {
      return this.getExpiredValue(key)
    } catch {
      return undefined
    }
  }

  private store = new Map<string, { value: T, expiresAt: number }>()
}
