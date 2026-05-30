import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

import { toStorageKey, type Integration } from '../core'
import { IntegrationID } from '../indentify'
import { YouTubeShortProvider } from './providers/short'
import { YouTubeVideoProvider } from './providers/video'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.YOUTUBE, 'enabled'), false)

export const shorts = reactive(new YouTubeShortProvider())
export const videos = reactive(new YouTubeVideoProvider())

export const youtube: Integration = {
  id: IntegrationID.YOUTUBE,
  name: 'YouTube',
  url: 'https://www.youtube.com/',
  branding: {
    icon: 'simple-icons:youtube',
    primary: '#FF0000',
    secondary: '#FFFFFF',
  },
  get isEnabled(): boolean {
    return isEnabled.value
  },
  set isEnabled(value: boolean) {
    isEnabled.value = value
  },
  providers: [shorts, videos],
}
