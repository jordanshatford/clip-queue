import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Index from '~/pages/index.vue'

describe('index.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Index)
    expect(component.exists()).toBe(true)
  })
})
