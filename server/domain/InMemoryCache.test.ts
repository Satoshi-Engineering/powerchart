import { describe, it, test, expect, beforeEach } from 'vitest'

import InMemoryCache from './InMemoryCache'

describe('InMemoryCache', () => {
  let cache: InMemoryCache<string>

  beforeEach(() => {
    cache = new InMemoryCache<string>()
  })

  it('should cache and retrieve a value', () => {
    cache.cacheValue('testKey', 'testValue', { forMS: 1000 })
    const value = cache.getValue('testKey')
    expect(value).toBe('testValue')
  })

  it('should cache a value until a specific date', () => {
    const futureDate = new Date(Date.now() + 1000)
    cache.cacheValue('testKey', 'testValue', { until: futureDate })
    const value = cache.getValue('testKey')
    expect(value).toBe('testValue')
  })

  it('should delete a cached value', () => {
    cache.cacheValue('testKey', 'testValue', { forMS: 1000 })
    cache.deleteValue('testKey')
    expect(() => cache.getValue('testKey')).toThrow('Key not found: testKey')
  })

  it('should throw an error if the key does not exist', () => {
    expect(() => cache.getValue('nonExistentKey')).toThrow('Key not found: nonExistentKey')
  })

  it('should throw an error if the key has expired', async () => {
    cache.cacheValue('expiredTextKey', 'testValue', { forMS: 10 })
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(() => cache.getValue('expiredTextKey')).toThrow('Key expired: expiredTextKey')
  })

  it('should delete expired keys automatically', async () => {
    cache.cacheValue('testKey', 'testValue', { forMS: 10 })
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(() => cache.getValue('testKey')).toThrow('Key expired: testKey')
    expect(() => cache.getValue('testKey')).toThrow('Key not found: testKey')
  })

  it('should clear all cached values', () => {
    cache.cacheValue('testKey1', 'testValue1', { forMS: 1000 })
    cache.cacheValue('testKey2', 'testValue2', { forMS: 1000 })
    cache.clearAllValues()
    expect(() => cache.getValue('testKey1')).toThrow('Key not found: testKey1')
    expect(() => cache.getValue('testKey2')).toThrow('Key not found: testKey2')
  })

  it('should return undefined for a safe get if the key does not exist', () => {
    const value = cache.safeGetValue('nonExistentKey')
    expect(value).toBeUndefined()
  })

  it('should return undefined for a safe get if the key has expired', async () => {
    cache.cacheValue('expiredKey', 'testValue', { forMS: 10 })
    await new Promise((resolve) => setTimeout(resolve, 20))
    const value = cache.safeGetValue('expiredKey')
    expect(value).toBeUndefined()
  })

  test('getExpiredValue should return an expired value', async () => {
    cache.cacheValue('expiredKey', 'testValue', { forMS: 10 })
    await new Promise((resolve) => setTimeout(resolve, 20))
    const value = cache.getExpiredValue('expiredKey')
    expect(value).toBe('testValue')
  })

  test('getExpiredValue should throw an error if the key does not exist', async () => {
    expect(() => cache.getValue('nonExistentKey')).toThrow('Key not found: nonExistentKey')
  })

  test('getExpiredValue should return undefined for a safe get if the key does not exist', async () => {
    const value = cache.safeGetExpiredValue('expiredKey')
    expect(value).toBeUndefined()
  })
})
