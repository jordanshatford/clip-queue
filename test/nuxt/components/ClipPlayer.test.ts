import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipPlayer from '~/components/ClipPlayer.vue'

import { clipFromKick, clipFromTwitch } from '../../mocks'

describe('ClipPlayer.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipPlayer, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(component.exists()).toBe(true)
  })

  it('mounts successfully when using video.js', async () => {
    const component = await mountSuspended(ClipPlayer, {
      props: {
        clip: clipFromKick,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
