import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { clipFromTwitch } from '@/__tests__/mocks'

import ClipThumbnail from '../ClipThumbnail.vue'

describe('ClipThumbnail.vue', () => {
  const wrapper = shallowMount(ClipThumbnail, {
    props: {
      src: clipFromTwitch.thumbnailUrl,
      alt: clipFromTwitch.title,
    },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
