import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { clipFromTwitch } from '@/__tests__/mocks'

import ClipCard from '../ClipCard.vue'

describe('ClipCard.vue', () => {
  const wrapper = shallowMount(ClipCard, {
    props: {
      clip: clipFromTwitch,
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
