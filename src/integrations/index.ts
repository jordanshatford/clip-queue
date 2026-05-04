export type { Clip, IntegrationProvider, Integration } from './core'
export { IntegrationID } from './indentify'
export { toClipUUID } from './core'

import type { Integration } from './core'

import { kick } from './kick'
import { twitch } from './twitch'
import { youtube } from './youtube'

/**
 * A list of all supported integrations for the application.
 */
export const integrations: Integration[] = [twitch, kick, youtube]
