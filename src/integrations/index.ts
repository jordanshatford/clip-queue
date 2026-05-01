export type { Clip, PlayerFormat, IntegrationProvider, Integration } from './common'
export { IntegrationID } from './indentify'
export { toClipUUID } from './common'

import type { Integration } from './common'

import { kick } from './kick'
import { twitch } from './twitch'

/**
 * A list of all supported integrations for the application.
 */
export const integrations: Integration[] = [twitch, kick]
