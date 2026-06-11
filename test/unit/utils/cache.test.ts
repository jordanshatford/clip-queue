import { describe, expect, it, vi } from 'vitest'

import { CacheMap, Cacheable } from '../../../shared/utils/cache'

class TestCacheable extends Cacheable<string> {
  public get(key: string): string | undefined {
    return this.cache.get(key)
  }

  public put(key: string, value: string): void {
    this.cache.set(key, value)
  }
}

describe('shared/utils/cache', () => {
  describe('CacheMap', () => {
    it('returns the factory value and caches it', async () => {
      const cache = new CacheMap<number>()
      const factory = vi.fn().mockResolvedValue(42)
      const result = await cache.cached('test', factory)
      expect(result).toBe(42)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(cache.get('test')).toBe(42)
    })

    it('returns an existing cached value without calling the factory', async () => {
      const cache = new CacheMap<number>()
      cache.set('test', 42)
      const factory = vi.fn().mockResolvedValue(99)
      const result = await cache.cached('test', factory)
      expect(result).toBe(42)
      expect(factory).not.toHaveBeenCalled()
    })

    it('calls the factory only once for repeated cached lookups', async () => {
      const cache = new CacheMap<number>()
      const factory = vi.fn().mockResolvedValue(42)
      const first = await cache.cached('test', factory)
      const second = await cache.cached('test', factory)
      expect(first).toBe(42)
      expect(second).toBe(42)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('does not cache a value when the factory rejects', async () => {
      const cache = new CacheMap<number>()
      const error = new Error('boom')
      const factory = vi.fn().mockRejectedValue(error)
      await expect(cache.cached('test', factory)).rejects.toThrow('boom')
      expect(factory).toHaveBeenCalledTimes(1)
      expect(cache.has('test')).toBe(false)
    })

    it('supports different keys independently', async () => {
      const cache = new CacheMap<number>()
      const firstFactory = vi.fn().mockResolvedValue(1)
      const secondFactory = vi.fn().mockResolvedValue(2)
      const first = await cache.cached('one', firstFactory)
      const second = await cache.cached('two', secondFactory)
      expect(first).toBe(1)
      expect(second).toBe(2)
      expect(firstFactory).toHaveBeenCalledTimes(1)
      expect(secondFactory).toHaveBeenCalledTimes(1)
      expect(cache.get('one')).toBe(1)
      expect(cache.get('two')).toBe(2)
    })
  })

  describe('Cacheable', () => {
    it('can be defined', () => {
      const cache = new TestCacheable()
      expect(cache).toBeDefined()
    })

    it('can store values', () => {
      const cache = new TestCacheable()
      expect(cache.hasCachedData).toBeFalsy()
      cache.put('test', 'test')
      expect(cache.hasCachedData).toBeTruthy()
      expect(cache.get('test')).toBeDefined()
      expect(cache.get('test')).toEqual('test')
    })

    it('can have its values cleared', () => {
      const cache = new TestCacheable()
      expect(cache.hasCachedData).toBeFalsy()
      cache.put('test', 'test')
      expect(cache.hasCachedData).toBeTruthy()
      cache.clearCache()
      expect(cache.hasCachedData).toBeFalsy()
    })
  })
})
