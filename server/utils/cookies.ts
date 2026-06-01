import type { H3Event } from 'h3'

type CookieSerializeOptions = Parameters<typeof setCookie>[3]

/**
 * Set object cookie value by name.
 * @param event - H3 event or res passed by h3 handler
 * @param name - Name of the cookie to set
 * @param value - Value of the cookie to set
 * @param serializeOptions - Options for serializing the cookie
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
 * @param event - H3 event or req passed by h3 handler
 * @param name - Name of the cookie to get
 * @returns Value of the cookie (T or undefined)
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
