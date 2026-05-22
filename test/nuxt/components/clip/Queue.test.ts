import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipQueue from '~/components/clip/Queue.vue'

describe('clip/Queue.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipQueue, {
      props: {
        clips: [],
      },
    })
    expect(component.exists()).toBe(true)
  })
})
