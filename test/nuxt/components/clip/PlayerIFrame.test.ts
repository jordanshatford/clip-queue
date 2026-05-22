import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PlayerIFrame from '~/components/clip/PlayerIFrame.vue'

describe('PlayerIFrame.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(PlayerIFrame, {
      props: {
        src: '',
        title: '',
      },
    })
    expect(component.exists()).toBe(true)
  })
})
