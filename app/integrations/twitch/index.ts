import { reactive } from 'vue'

import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { TwitchAuthentication } from './authentication'
import { TwitchClipProvider } from './providers/clip'
import { TwitchVodProvider } from './providers/vod'
import { TwitchChatSource } from './sources/chat'

export * from './core/types'

export const authentication = reactive<TwitchAuthentication>(new TwitchAuthentication())
export const source = reactive(new TwitchChatSource(() => authentication.user.name))
export const clips = reactive(new TwitchClipProvider(() => authentication.token))
export const vods = reactive(new TwitchVodProvider(() => authentication.token))

export const twitch: Integration = {
  id: IntegrationID.TWITCH,
  name: 'Twitch',
  url: 'https://www.twitch.tv/',
  branding: {
    icon: 'simple-icons:twitch',
    primary: '#8956FB',
    secondary: '#FFFFFF',
  },
  isExperimental: false,
  authentication,
  providers: [clips, vods],
  source,
}
