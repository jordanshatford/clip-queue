import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { api } from '../misc/index'
import { YouTubeShortProvider } from './short'
import { YouTubeVideoProvider } from './video'

export const shorts = new YouTubeShortProvider(api)
export const videos = new YouTubeVideoProvider(api)

export const youtube: Integration = {
  id: IntegrationID.YOUTUBE,
  name: 'YouTube',
  url: 'https://www.youtube.com/',
  branding: {
    icon: 'simple-icons:youtube',
    primary: '#FF0000',
    secondary: '#FFFFFF',
  },
  providers: [shorts, videos],
}
