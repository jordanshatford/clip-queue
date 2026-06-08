import { useStorage } from '@vueuse/core'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { RumbleShortProvider } from './short'
import { RumbleVideoProvider } from './video'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.RUMBLE, 'enabled'), false)

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
  get isEnabled(): boolean {
    return isEnabled.value
  },
  set isEnabled(value: boolean) {
    isEnabled.value = value
  },
  providers: [shorts, videos],
}
