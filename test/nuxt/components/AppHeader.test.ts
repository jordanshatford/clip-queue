import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppHeader from '~/components/AppHeader.vue'

describe('AppHeader.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(AppHeader)
    expect(component.exists()).toBe(true)
  })

  it('renders logo and title', async () => {
    const wrapper = await mountSuspended(AppHeader)
    expect(wrapper.text()).toContain('Clip')
    expect(wrapper.text()).toContain('Queue')
  })
})
