import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { DailyMotionProvider } from './providers/dailymotion'
import { SoopProvider } from './providers/soop'
import { StreamableProvider } from './providers/streamable'
import { VimeoProvider } from './providers/vimeo'

export * from './core/types'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.MISCELLANEOUS, 'enabled'), false)

export const dailymotion = reactive(new DailyMotionProvider())
export const soop = reactive(new SoopProvider())
export const streamable = reactive(new StreamableProvider())
export const vimeo = reactive(new VimeoProvider())

export const misc: Integration = {
  id: IntegrationID.MISCELLANEOUS,
  name: 'Miscellaneous',
  url: '',
  icon: `
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <title>Miscellaneous</title>
      <path fill="#FFA000" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"/>
      <path fill="#FFCA28" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"/>
    </svg>
  `,
  isExperimental: true,
  get isEnabled(): boolean {
    return isEnabled.value
  },
  set isEnabled(value: boolean) {
    isEnabled.value = value
  },
  providers: [dailymotion, soop, streamable, vimeo],
}
