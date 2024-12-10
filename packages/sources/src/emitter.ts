export class EventEmitter<
  Events extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => void | Promise<void>
  }
> {
  private listeners: Partial<Record<keyof Events, Array<Events[keyof Events]>>>

  public constructor() {
    this.listeners = {}
  }

  public on<E extends keyof Events>(event: E, listener: Events[E]): this {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
    return this
  }

  public emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean {
    const listeners = this.listeners[event]
    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => listener(...args))
      return true
    }
    return false
  }
}
