import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import PlayerUnsupported from '~/components/clip/PlayerUnsupported.vue'

vi.mock('#paraglide/messages', () => ({
  m: {
    unsupported_clip: () => 'Unsupported clip',
    unsupported_clip_description: () => 'Unsupported clip description',
  },
}))

describe('clip/PlayerUnsupported.vue', () => {
  it('renders successfully', async () => {
    const wrapper = await mountSuspended(PlayerUnsupported)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders unsupported clip message', async () => {
    const wrapper = await mountSuspended(PlayerUnsupported)
    expect(wrapper.text()).toContain('Unsupported clip')
    expect(wrapper.text()).toContain('Unsupported clip description')
  })
})
