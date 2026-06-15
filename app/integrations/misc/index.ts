import { OEmbedAPI } from '#shared/oembed'

import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { DailyMotionProvider } from './dailymotion'
import { MedalProvider } from './medal'
import { SoopProvider } from './soop'
import { StreamableProvider } from './streamable'
import { VimeoProvider } from './vimeo'

export const api = new OEmbedAPI()
export const dailymotion = new DailyMotionProvider(api)
export const medal = new MedalProvider(api)
export const soop = new SoopProvider(api)
export const streamable = new StreamableProvider(api)
export const vimeo = new VimeoProvider(api)

export const misc: Integration = {
  id: IntegrationID.MISCELLANEOUS,
  name: 'Miscellaneous',
  url: '',
  branding: {
    icon: 'lucide:folder',
    primary: '',
  },
  isExperimental: true,
  providers: [dailymotion, medal, soop, streamable, vimeo],
}
