import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { KickClipsProvider } from './providers/clip'
import { KickVodProvider } from './providers/vod'

export * from './core/types'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.KICK, 'enabled'), true)

export const clips = reactive(new KickClipsProvider())
export const vods = reactive(new KickVodProvider())

export const kick: Integration = {
  id: IntegrationID.KICK,
  name: 'Kick',
  url: 'https://kick.com/',
  icon: 'simple-icons:kick',
  isExperimental: false,
  get isEnabled(): boolean {
    return isEnabled.value
  },
  set isEnabled(value: boolean) {
    isEnabled.value = value
  },
  providers: [clips, vods],
}
