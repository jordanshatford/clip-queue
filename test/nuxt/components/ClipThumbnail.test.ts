import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipThumbnail from '~/components/ClipThumbnail.vue'

import { clipFromTwitch } from '../../mocks'

describe('ClipThumbnail.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ClipThumbnail, {
      props: {
        src: clipFromTwitch.thumbnailUrl,
        alt: clipFromTwitch.title,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
