import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppNavBar from '~/components/AppNavBar.vue'

describe('AppNavBar.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(AppNavBar)
    expect(component.exists()).toBe(true)
  })
})
