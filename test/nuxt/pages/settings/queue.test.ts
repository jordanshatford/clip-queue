import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import QueueSettings from '~/pages/settings/queue.vue'

describe('settings/queue.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(QueueSettings)
    expect(component.exists()).toBe(true)
  })
})
