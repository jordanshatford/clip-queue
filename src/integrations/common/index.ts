import type { IntegrationAuthentication } from './authentication'

export * from './authentication'
export * from './utils'

export enum IntegrationID {
  TWITCH = 'twitch',
}

export interface Integration {
  readonly id: IntegrationID
  readonly name: string
  readonly isExperimental?: boolean
  readonly authentication?: IntegrationAuthentication
}
