/**
 * Additional page meta properties for the application.
 * @property icon - The icon to display for the page.
 * @property requiresAuth - Whether the page requires authentication to access.
 * @property hidden - Whether the page should be hidden from navigation.
 * @property order - The order in which the page should be displayed in navigation.
 */

declare module '#app' {
  interface PageMeta {
    requiresAuth?: boolean
    icon?: string
    hidden?: boolean
    order?: number
  }
}

export {}
