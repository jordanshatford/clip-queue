import type { Integration } from '../core'

import { IntegrationID } from '../indentify'
import { api } from '../misc/index'
import { RumbleShortProvider } from './short'
import { RumbleVideoProvider } from './video'

export const shorts = new RumbleShortProvider(api)
export const videos = new RumbleVideoProvider(api)

export const rumble: Integration = {
  id: IntegrationID.RUMBLE,
  name: 'Rumble',
  url: 'https://www.rumble.com/',
  branding: {
    icon: 'simple-icons:rumble',
    primary: '#85C742',
    secondary: '#A9B8C3',
  },
  providers: [shorts, videos],
}
