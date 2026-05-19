import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ColorName from '~/components/ColorName.vue'

describe('ColorName.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ColorName, {
      name: 'amber',
    })
    expect(component.exists()).toBe(true)
  })
})
