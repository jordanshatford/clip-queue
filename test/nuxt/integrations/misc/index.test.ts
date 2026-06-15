import { IntegrationID } from '~/integrations/indentify'
import { misc } from '~/integrations/misc'

import { createIntegrationTestHarness } from '../harness'

createIntegrationTestHarness(misc, {
  isExperimental: true,
  details: {
    id: IntegrationID.MISCELLANEOUS,
    name: 'Miscellaneous',
    url: '',
    icon: 'lucide:folder',
    primary: '',
  },
  authentication: undefined,
  source: undefined,
  providers: [
    IntegrationID.DAILYMOTION,
    IntegrationID.MEDAL,
    IntegrationID.SOOP,
    IntegrationID.STREAMABLE,
    IntegrationID.VIMEO,
  ],
})
