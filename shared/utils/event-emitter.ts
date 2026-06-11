/**
 * A generic type for T or a promise like of T.
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * A simple event emitter.
 */
export class EventEmitter<Events extends Record<string, unknown[]>> {
  private listeners: Partial<{
    [E in keyof Events]: Array<(...args: Events[E]) => Awaitable<void>>
  }> = {}

  /**
   * Add a listener for an event.
   * @param event - The event to listen for.
   * @param listener - The listener for the event.
   * @returns A function that can be called to remove the listener.
   */
  public on<E extends keyof Events>(
    event: E,
    listener: (...args: Events[E]) => Awaitable<void>,
  ): () => void {
    this.listeners[event] ??= []
    this.listeners[event].push(listener)

    return () => {
      const listeners = this.listeners[event]
      if (!listeners) {
        return
      }
      this.listeners[event] = listeners.filter((current) => current !== listener)
    }
  }

  /**
   * Remove a listener from an event.
   * @param event - The event name.
   * @param listener - The listener to remove.
   */
  public off<E extends keyof Events>(
    event: E,
    listener: (...args: Events[E]) => Awaitable<void>,
  ): void {
    const listeners = this.listeners[event]
    if (!listeners) {
      return
    }
    this.listeners[event] = listeners.filter((current) => current !== listener)
  }

  /**
   * Emit an event to all listeners.
   * @param event - The event to emit.
   * @param args - The arguments to pass to listeners.
   * @returns True if the event had listeners that triggered.
   */
  public emit<E extends keyof Events>(event: E, ...args: Events[E]): boolean {
    const listeners = this.listeners[event]
    if (!listeners?.length) {
      return false
    }
    for (const listener of listeners) {
      void listener(...args)
    }
    return true
  }

  /**
   * Remove all listeners.
   */
  public clear(): void {
    this.listeners = {}
  }
}
