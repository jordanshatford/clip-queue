import { useStorage } from '@vueuse/core'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { DailyMotionProvider } from './dailymotion'
import { MedalProvider } from './medal'
import { SoopProvider } from './soop'
import { StreamableProvider } from './streamable'
import { VimeoProvider } from './vimeo'

export * from './core/types'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.MISCELLANEOUS, 'enabled'), false)

export const dailymotion = new DailyMotionProvider()
export const medal = new MedalProvider()
export const soop = new SoopProvider()
export const streamable = new StreamableProvider()
export const vimeo = new VimeoProvider()

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
