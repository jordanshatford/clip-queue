import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipCard from '~/components/clip/Card.vue'

import { clipFromTwitch } from '../../../mocks'

describe('clip/Card.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipCard, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
