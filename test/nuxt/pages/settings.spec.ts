import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Settings from '~/pages/settings.vue'

describe('settings.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Settings)
    expect(component.exists()).toBe(true)
  })
})
