import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import router from '@/router'

import SettingsPage from '../settings.vue'

describe('settings.vue', () => {
  const wrapper = shallowMount(SettingsPage, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
      stubs: {
        RouterLink: true,
        RouterView: true,
      },
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
