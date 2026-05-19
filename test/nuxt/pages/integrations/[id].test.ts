import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Integrations from '~/pages/integrations/[id].vue'

describe('integrations/[id].vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Integrations)
    expect(component.exists()).toBe(true)
  })
})
