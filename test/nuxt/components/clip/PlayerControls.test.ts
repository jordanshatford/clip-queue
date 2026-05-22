import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { clipFromTwitch } from '~~/test/mocks'

import PlayerControls from '~/components/clip/PlayerControls.vue'

describe('PlayerControls.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(PlayerControls, {
      props: {
        clip: clipFromTwitch,
        previousDisabled: false,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
