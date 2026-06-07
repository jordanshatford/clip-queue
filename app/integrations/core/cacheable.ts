/**
 * Cacheable class that provider key value caching functionality.
 */
export class Cacheable<T> {
  /**
   * The cache map used to store cached data.
   */
  protected cache: Record<string, T> = {}

  /**
   * Whether the cache has any data.
   * @returns True if the cache has data, false otherwise.
   */
  public get hasCachedData(): boolean {
    return Object.keys(this.cache).length > 0
  }

  /**
   * Clear the cache by resetting the cache map to an empty object.
   */
  public clearCache(): void {
    this.cache = {}
  }

  /**
   * A cached function response promise.
   * @param key - The cache key.
   * @param factory - The factory function that generates the value to cache.
   * @returns The existing cached value if it exists, or the factory result.
   */
  protected async cached(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.cache[key]
    if (existing) {
      return existing
    }
    const value = await factory()
    this.cache[key] = value
    return value
  }
}
