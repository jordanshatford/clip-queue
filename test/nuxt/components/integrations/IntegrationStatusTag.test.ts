import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationStatusTag from '~/components/integrations/IntegrationStatusTag.vue'
import { IntegrationStatus } from '~/integrations/core'

describe('IntegrationStatusTag.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationStatusTag, {
      props: {
        status: IntegrationStatus.HEALTHY,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
