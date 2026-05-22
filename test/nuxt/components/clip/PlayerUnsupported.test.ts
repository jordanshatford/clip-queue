import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PlayerUnsupported from '~/components/clip/PlayerUnsupported.vue'

describe('clip/PlayerUnsupported.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(PlayerUnsupported, {
      props: {
        src: '',
        title: '',
      },
    })
    expect(component.exists()).toBe(true)
  })
})
