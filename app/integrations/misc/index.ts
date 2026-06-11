import { useStorage } from '@vueuse/core'

import { OEmbedAPI } from '#shared/oembed'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { DailyMotionProvider } from './dailymotion'
import { MedalProvider } from './medal'
import { SoopProvider } from './soop'
import { StreamableProvider } from './streamable'
import { VimeoProvider } from './vimeo'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.MISCELLANEOUS, 'enabled'), false)

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
  get isEnabled(): boolean {
    return isEnabled.value
  },
  set isEnabled(value: boolean) {
    isEnabled.value = value
  },
  providers: [dailymotion, medal, soop, streamable, vimeo],
}
