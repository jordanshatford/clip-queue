import type { Reactive } from 'vue'

import type { IntegrationID } from '../indentify'
import type { IntegrationAuthentication } from './authentication'
import type { IntegrationProvider } from './provider'
import type { IntegrationSource } from './source'

export * from './authentication'
export * from './provider'
export * from './source'
export * from './types'
export * from './utils'

export interface Integration {
  /**
   * The unique ID for the integration. In most cases this should be the name of the platform
   * that the integration is for.
   */
  readonly id: IntegrationID
  /**
   * The display name of the integration. This is used in the UI to represent the integration.
   */
  readonly name: string
  /**
   * A URL to the integration. This is used to provide linking in the UI for the integration.
   */
  readonly url: string
  /**
   * Branding details for the integration.
   */
  readonly branding: {
    /**
     * The icon representing the integration as a string Iconify icon.
     */
    readonly icon: string
    /**
     * The primary color for the integration.
     */
    readonly primary: string
    /**
     * The optional secondary color for the integration.
     */
    readonly secondary?: string
  }
  /**
   * If the integration is experimental. An integration should be marked experimental if
   * any of it or any of its features (authentication, source, providers) are experimental.
   */
  readonly isExperimental?: boolean
  /**
   * If the integration is enabled. If it is not enabled no parts of the integration will be
   * used. If it is not defined then it is assumed the integration is enabled and cannot be
   * disabled at all.
   */
  isEnabled?: boolean
  /**
   * The ability to authenticate with this integration. Only defined if this integration can
   * be used to get authentication details required for other parts of the integration to
   * function.
   */
  readonly authentication?: IntegrationAuthentication
  /**
   * Clip source for the integration. URLs from this source will be detected.
   */
  readonly source?: Reactive<IntegrationSource>
  /**
   * Clip providers for the integration. Many can be defined, for example, if you wanted
   * to have a separate provider for Twitch clips and Twitch VODs.
   */
  readonly providers: Reactive<IntegrationProvider>[]
}
