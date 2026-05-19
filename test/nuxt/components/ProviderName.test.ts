import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import { IntegrationID } from '@/integrations'
import ProviderName from '~/components/ProviderName.vue'

describe('ProviderName.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ProviderName, {
      props: {
        provider: IntegrationID.TWITCH_CLIPS,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
