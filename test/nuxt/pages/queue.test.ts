import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { UTooltipStub } from '~~/test/mocks/stubs'

import Queue from '~/pages/queue.vue'

describe('queue.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Queue, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })
    expect(component.exists()).toBe(true)
  })
})
