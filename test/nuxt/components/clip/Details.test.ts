import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipDetails from '~/components/clip/Details.vue'

import { clipFromTwitch } from '../../../mocks'

describe('clip/Details.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipDetails, {
      props: {
        data: clipFromTwitch,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
