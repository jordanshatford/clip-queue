import { reactive } from 'vue'

import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { KickAuthentication } from './authentication'
import { KickClipsProvider } from './clip'
import { KickVodProvider } from './vod'

export * from './core/types'

export const authentication = reactive<KickAuthentication>(new KickAuthentication())
export const clips = reactive(new KickClipsProvider())
export const vods = reactive(new KickVodProvider())

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
  providers: [clips, vods],
}
