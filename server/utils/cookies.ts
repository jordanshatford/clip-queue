import type { H3Event } from 'h3'

type CookieSerializeOptions = Parameters<typeof setCookie>[3]

/**
 * Set object cookie value by name.
 * @param event - H3 event or res passed by h3 handler.
 * @param name - Name of the cookie to set.
 * @param value - Value of the cookie to set.
 * @param serializeOptions - Options for serializing the cookie.
 */
export function setObjectCookie<T>(
  event: H3Event,
  name: string,
  value: T,
  serializeOptions?: CookieSerializeOptions,
): void {
  setCookie(event, name, JSON.stringify(value), serializeOptions)
}

/**
 * Get a object cookie value by name.
 * @param event - H3 event or req passed by h3 handler.
 * @param name - Name of the cookie to get.
 * @returns Value of the cookie (T or undefined).
 */
export function getObjectCookie<T>(event: H3Event, name: string): T | undefined {
  const value = getCookie(event, name)
  if (!value) {
    return
  }
  try {
    return JSON.parse(value) as T
  } catch {
    return
  }
}

/**
 * Class used for interacting with a cookie.
 */
export class Cookie {
  public constructor(
    /**
     * The H3Event with associated cookie.
     */
    protected readonly event: H3Event,
    /**
     * The name of the cookie.
     */
    protected readonly name: string,
  ) {}

  /**
   * Get the cookie value.
   * @returns — Value of the cookie (String or undefined).
   */
  public get(): string | undefined {
    return getCookie(this.event, this.name)
  }

  /**
   * Set the cookie value.
   * @param value - Value to set.
   * @param serializeOptions - Options for serializing the cookie.
   */
  public set(value: string, serializeOptions?: CookieSerializeOptions): void {
    return setCookie(this.event, this.name, value, serializeOptions)
  }

  /**
   * Remove the cookie value.
   * @param serializeOptions - Options for serializing the cookie.
   */
  public delete(serializeOptions?: CookieSerializeOptions): void {
    return deleteCookie(this.event, this.name, serializeOptions)
  }
}

/**
 * Class used for interacting with an Object like cookie.
 */
export class ObjectCookie<T> {
  public constructor(
    /**
     * The H3Event with associated cookie.
     */
    protected readonly event: H3Event,
    /**
     * The name of the cookie.
     */
    protected readonly name: string,
  ) {}

  /**
   * Get the cookie value.
   * @returns — Value of the cookie (T or undefined).
   */
  public get(): T | undefined {
    return getObjectCookie<T>(this.event, this.name)
  }

  /**
   * Set the cookie value.
   * @param value - Value to set.
   * @param serializeOptions - Options for serializing the cookie.
   */
  public set(value: T, serializeOptions?: CookieSerializeOptions): void {
    return setObjectCookie<T>(this.event, this.name, value, serializeOptions)
  }

  /**
   * Remove the cookie value.
   * @param serializeOptions - Options for serializing the cookie.
   */
  public delete(serializeOptions?: CookieSerializeOptions): void {
    return deleteCookie(this.event, this.name, serializeOptions)
  }
}
