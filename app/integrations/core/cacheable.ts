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
}
