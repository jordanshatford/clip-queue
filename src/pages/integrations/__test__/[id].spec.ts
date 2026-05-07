import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { IntegrationID } from '@/integrations'

import IntegrationPage from '../[id].vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: IntegrationID.TWITCH,
    },
  }),
}))

describe('integrations/[id].vue', () => {
  const wrapper = shallowMount(IntegrationPage, {
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
