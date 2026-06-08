import { reactive } from 'vue'

import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { TwitchAuthentication } from './authentication'
import { TwitchChatSource } from './chat'
import { TwitchClipProvider } from './clip'
import { TwitchVodProvider } from './vod'

export * from './core/types'

export const authentication = reactive<TwitchAuthentication>(new TwitchAuthentication())
export const source = reactive(new TwitchChatSource(() => authentication.user.name))
export const clips = new TwitchClipProvider(() => authentication.details)
export const vods = new TwitchVodProvider(() => authentication.details)

export const twitch: Integration = {
  id: IntegrationID.TWITCH,
  name: 'Twitch',
  url: 'https://www.twitch.tv/',
  branding: {
    icon: 'simple-icons:twitch',
    primary: '#8956FB',
    secondary: '#FFFFFF',
  },
  authentication,
  providers: [clips, vods],
  source,
}
