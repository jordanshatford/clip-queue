import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import History from '~/pages/history.vue'

describe('history.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(History)
    expect(component.exists()).toBe(true)
  })
})
