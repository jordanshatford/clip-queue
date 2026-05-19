import { describe, expect, it } from 'vitest'

import { Cacheable } from '../cacheable'

class TestCacheable extends Cacheable<string> {
  public get(key: string): string | undefined {
    return this.cache[key]
  }

  public put(key: string, value: string): void {
    this.cache[key] = value
  }
}

describe('integrations/core/cacheable', () => {
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
