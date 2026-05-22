import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationProviders from '~/components/integration/Providers.vue'
import { clips } from '~/integrations/twitch'

describe('IntegrationProviders.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationProviders, {
      modelValue: [clips],
    })
    expect(component.exists()).toBe(true)
  })
})
