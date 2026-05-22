import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PlayerVideo from '~/components/clip/PlayerVideo.vue'

describe('clip/PlayerVideo.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(PlayerVideo, {
      props: {
        title: '',
        poster: '',
        src: '',
      },
    })
    expect(component.exists()).toBe(true)
  })
})
