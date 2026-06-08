import type { Integration } from './core'

import { kick } from './kick'
import { misc } from './misc'
import { rumble } from './rumble'
import { twitch } from './twitch'
import { youtube } from './youtube'

export type { Clip, AbstractIntegrationProvider, Integration } from './core'
export { IntegrationID } from './indentify'
export { toClipUUID } from './core'

/**
 * A list of all supported integrations for the application.
 */
export const integrations: Integration[] = [twitch, kick, youtube, rumble, misc]
