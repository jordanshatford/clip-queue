import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { clipFromKick, clipFromTwitch } from '~~/test/mocks'

import Player from '~/components/clip/Player.vue'

describe('Player.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(Player, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(component.exists()).toBe(true)
  })

  it('mounts successfully when using video.js', async () => {
    const component = await mountSuspended(Player, {
      props: {
        clip: clipFromKick,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
