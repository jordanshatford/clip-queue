import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationDropdownMenu from '~/components/integration/DropdownMenu.vue'
import { twitch } from '~/integrations/twitch'

describe('integration/DropdownMenu.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(IntegrationDropdownMenu, {
      props: {
        integration: twitch,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
