import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppFooter from '~/components/AppFooter.vue'

describe('AppFooter.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(AppFooter)
    expect(component.exists()).toBe(true)
  })
})
