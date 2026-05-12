import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { IntegrationID } from '@/integrations'

import IntegrationIcon from '../IntegrationIcon.vue'

describe('IntegrationIcon.vue', () => {
  const wrapper = shallowMount(IntegrationIcon, {
    props: {
      id: IntegrationID.TWITCH,
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
