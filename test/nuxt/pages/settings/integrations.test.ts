import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationsSettings from '~/pages/settings/integrations.vue'

describe('settings/integrations.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationsSettings)
    expect(component.exists()).toBe(true)
  })
})
