/**
 * A generic type for T or a promise like of T.
 */
export type Awaitable<T> = PromiseLike<T> | T

/**
 * A simple event emitter.
 */
export class EventEmitter<
  Events extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => Awaitable<void>
  },
> {
  private listeners: Partial<Record<keyof Events, Array<Events[keyof Events]>>>

  public constructor() {
    this.listeners = {}
  }

  /**
   * Add a listener for an event.
   * @param event - The event to listen for.
   * @param listener - The listener for the event.
   * @returns This instance.
   */
  public on<E extends keyof Events>(event: E, listener: Events[E]): this {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
    return this
  }

  /**
   * Emit an event.
   * @param event - The event to emit.
   * @param args - The arguments to pass to the listeners.
   * @returns True if the event was emitted.
   */
  public emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean {
    const listeners = this.listeners[event]
    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => listener(...args))
      return true
    }
    return false
  }
}
