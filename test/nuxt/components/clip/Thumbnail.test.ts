import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ClipThumbnail from '~/components/clip/Thumbnail.vue'

import { clipFromTwitch } from '../../../mocks'

describe('clip/Thumbnail.vue', () => {
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
