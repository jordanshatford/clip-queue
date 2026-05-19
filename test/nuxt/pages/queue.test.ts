import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Queue from '~/pages/queue.vue'

describe('queue.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Queue)
    expect(component.exists()).toBe(true)
  })
})
