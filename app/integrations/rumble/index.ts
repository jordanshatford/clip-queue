import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { RumbleShortProvider } from './providers/short'
import { RumbleVideoProvider } from './providers/video'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.RUMBLE, 'enabled'), true)

export const shorts = reactive(new RumbleShortProvider())
export const videos = reactive(new RumbleVideoProvider())

export const rumble: Integration = {
  id: IntegrationID.RUMBLE,
  name: 'Rumble',
  url: 'https://www.rumble.com/',
  branding: {
    icon: 'simple-icons:rumble',
    primary: '#85C742',
    secondary: '#A9B8C3',
  },
  isExperimental: false,
  get isEnabled(): boolean {
    return isEnabled.value
  },
  set isEnabled(value: boolean) {
    isEnabled.value = value
  },
  providers: [shorts, videos],
}
