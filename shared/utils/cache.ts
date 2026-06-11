/**
 * Cacheable map that provider key value caching functionality.
 */
export class CacheMap<T> extends Map<string, T> {
  /**
   * A cached function response promise.
   * @param key - The cache key.
   * @param factory - The factory function that generates the value to cache.
   * @returns The existing cached value if it exists, or the factory result.
   */
  public async cached(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.get(key)
    if (existing) {
      return existing
    }
    const value = await factory()
    this.set(key, value)
    return value
  }
}

/**
 * Cacheable class that provides key value caching functionality.
 */
export class Cacheable<T> {
  /**
   * The cache map used to store cached data.
   */
  protected cache: CacheMap<T> = new CacheMap()

  /**
   * Whether the cache has any data.
   * @returns True if the cache has data, false otherwise.
   */
  public get hasCachedData(): boolean {
    return this.cache.size > 0
  }

  /**
   * Clear the cache by resetting the cache map to an empty object.
   */
  public clearCache(): void {
    this.cache.clear()
  }

  /**
   * A cached function response promise.
   * @param key - The cache key.
   * @param factory - The factory function that generates the value to cache.
   * @returns The existing cached value if it exists, or the factory result.
   */
  protected async cached(key: string, factory: () => Promise<T>): Promise<T> {
    return this.cache.cached(key, factory)
  }
}
