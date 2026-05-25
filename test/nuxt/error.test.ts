import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Err from '~/error.vue'

describe('error.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Err, {
      error: {
        error: true,
        status: 400,
        statusText: 'Test',
      },
    })
    expect(component.exists()).toBe(true)
  })
})
