import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { IntegrationProviderID } from '@/integrations'

import ProviderName from '../ProviderName.vue'

describe('ProviderName.vue', () => {
  const wrapper = shallowMount(ProviderName, {
    props: {
      provider: IntegrationProviderID.TWITCH_CLIPS,
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
