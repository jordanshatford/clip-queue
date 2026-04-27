export type { Clip, PlayerFormat, IntegrationProvider } from './common/provider'
export { IntegrationProviderID } from './common/provider'

import type { Integration } from './common'

import { kick } from './kick'
import { twitch } from './twitch'

export const integrations: Integration[] = [kick, twitch]
