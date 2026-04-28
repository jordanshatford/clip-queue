import type { IntegrationAuthentication } from './authentication'
import type { IntegrationProvider } from './provider'

export * from './authentication'
export * from './clip-list'
export * from './utils'

export enum IntegrationID {
  KICK = 'kick',
  TWITCH = 'twitch',
}

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
   * The icon representing the integration as a string SVG.
   */
  readonly icon: string
  /**
   * If the integration is experimental. In most cases this will be true if one of the sub
   * integrations it has it also experimental.
   */
  readonly isExperimental: boolean
  /**
   * The ability to authenticate with this integration. Only defined if this integration can
   * be used to get authentication details required for other parts of the integration to
   * function.
   */
  readonly authentication?: IntegrationAuthentication
  /**
   * Clip providers for the integration. Many can be defined, for example, if you wanted
   * to have a separate provider for Twitch clips and Twitch VODs.
   */
  readonly providers: IntegrationProvider[]
}
