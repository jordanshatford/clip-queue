import { IntegrationID } from '~/integrations/indentify'
import { rumble } from '~/integrations/rumble'

import { createIntegrationTestHarness } from '../harness'

createIntegrationTestHarness(rumble, {
  isExperimental: undefined,
  details: {
    id: IntegrationID.RUMBLE,
    name: 'Rumble',
    url: 'https://www.rumble.com/',
    icon: 'simple-icons:rumble',
    primary: '#85C742',
    secondary: '#A9B8C3',
  },
  authentication: undefined,
  source: undefined,
  providers: [IntegrationID.RUMBLE_SHORTS, IntegrationID.RUMBLE_VIDEOS],
})
