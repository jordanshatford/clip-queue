import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Logs from '~/pages/logs.vue'

describe('logs.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Logs)
    expect(component.exists()).toBe(true)
  })
})
