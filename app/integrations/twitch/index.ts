import { TwitchAPI } from '#shared/twitch'

import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { TwitchAuthentication } from './authentication'
import { TwitchChatSource } from './chat'
import { TwitchClipProvider } from './clip'
import { TwitchVodProvider } from './vod'

export const authentication = new TwitchAuthentication()
export const api = new TwitchAPI(() => authentication.details)
export const source = new TwitchChatSource(() => authentication.user.name)
export const clips = new TwitchClipProvider(api)
export const vods = new TwitchVodProvider(api)

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
  source,
  providers: [clips, vods],
}
