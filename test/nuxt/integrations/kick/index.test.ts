import { IntegrationID } from '~/integrations/indentify'
import { kick } from '~/integrations/kick'

import { createIntegrationTestHarness } from '../harness'

createIntegrationTestHarness(kick, {
  isEnabled: undefined,
  isExperimental: undefined,
  details: {
    id: IntegrationID.KICK,
    name: 'Kick',
    url: 'https://kick.com/',
    icon: 'simple-icons:kick',
    primary: '#00E701',
    secondary: '#0B0E0F',
  },
  authentication: IntegrationID.KICK_AUTH,
  source: IntegrationID.KICK_CHAT,
  providers: [IntegrationID.KICK_CLIPS, IntegrationID.KICK_VODS],
})
