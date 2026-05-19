import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipCard from '~/components/ClipCard.vue'

import { clipFromTwitch } from '../../mocks'

describe('ClipCard.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipCard, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
