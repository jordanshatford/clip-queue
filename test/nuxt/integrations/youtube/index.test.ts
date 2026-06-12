import { IntegrationID } from '~/integrations/indentify'
import { youtube } from '~/integrations/youtube'

import { createIntegrationTestHarness } from '../harness'

createIntegrationTestHarness(youtube, {
  isEnabled: false,
  isExperimental: undefined,
  details: {
    id: IntegrationID.YOUTUBE,
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    icon: 'simple-icons:youtube',
    primary: '#FF0000',
    secondary: '#FFFFFF',
  },
  authentication: undefined,
  source: undefined,
  providers: [IntegrationID.YOUTUBE_SHORTS, IntegrationID.YOUTUBE_VIDEOS],
})
