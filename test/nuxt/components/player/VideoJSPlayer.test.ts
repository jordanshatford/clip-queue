import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import VideoJSPlayer from '~/components/player/VideoJSPlayer.vue'

describe('VideoJSPlayer.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(VideoJSPlayer, {
      props: {
        title: '',
        poster: '',
        source: '',
      },
    })
    expect(component.exists()).toBe(true)
  })
})
