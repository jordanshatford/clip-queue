export type { Clip, PlayerFormat, IntegrationProvider } from './common/provider'
export { IntegrationID } from './indentify'
export type { Integration } from './common'

import type { Integration } from './common'

import { kick } from './kick'
import { twitch } from './twitch'

export const integrations: Integration[] = [twitch, kick]
