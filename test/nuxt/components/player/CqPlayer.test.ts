import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipPlayer from '~/components/player/CqPlayer.vue'

describe('ClipPlayer.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipPlayer, {
      props: {
        playerFormat: 'unknown',
        title: '',
        source: '',
        thumbnailUrl: '',
      },
    })
    expect(component.exists()).toBe(true)
  })
})
