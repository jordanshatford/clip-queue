import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ClipSourceStatus } from '@/sources'

import SourceIndicator from '../SourceIndicator.vue'

describe('SourceIndicator.vue', () => {
  const wrapper = shallowMount(SourceIndicator, {
    props: {
      status: ClipSourceStatus.CONNECTED,
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
