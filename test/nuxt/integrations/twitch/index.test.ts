import { IntegrationID } from '~/integrations/indentify'
import { twitch } from '~/integrations/twitch'

import { createIntegrationTestHarness } from '../harness'

createIntegrationTestHarness(twitch, {
  isExperimental: undefined,
  details: {
    id: IntegrationID.TWITCH,
    name: 'Twitch',
    url: 'https://www.twitch.tv/',
    icon: 'simple-icons:twitch',
    primary: '#8956FB',
    secondary: '#FFFFFF',
  },
  authentication: IntegrationID.TWITCH_AUTH,
  source: IntegrationID.TWITCH_CHAT,
  providers: [IntegrationID.TWITCH_CLIPS, IntegrationID.TWITCH_VODS],
})
