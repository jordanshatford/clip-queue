import { KickAPI } from '#shared/kick'

import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { KickAuthentication } from './authentication'
import { KickChatSource } from './chat'
import { KickClipsProvider } from './clip'
import { KickVodProvider } from './vod'

export const authentication = new KickAuthentication()
export const api = new KickAPI()
export const source = new KickChatSource(() => authentication.user.name)
export const clips = reactive(new KickClipsProvider(api))
export const vods = reactive(new KickVodProvider(api))

export const kick: Integration = {
  id: IntegrationID.KICK,
  name: 'Kick',
  url: 'https://kick.com/',
  branding: {
    icon: 'simple-icons:kick',
    primary: '#00E701',
    secondary: '#0B0E0F',
  },
  authentication,
  source,
  providers: [clips, vods],
}
