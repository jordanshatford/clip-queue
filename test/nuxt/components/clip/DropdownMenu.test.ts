import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { clipFromTwitch } from '~~/test/mocks'

import ClipDropdownMenu from '~/components/clip/DropdownMenu.vue'

describe('clip/DropdownMenu.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(ClipDropdownMenu, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
