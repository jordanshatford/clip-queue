import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import ConfirmationService from 'primevue/confirmationservice'
import { describe, expect, it, vi } from 'vitest'

import LoggerSettings from '../logs.vue'

describe('settings/logs.vue', () => {
  const wrapper = shallowMount(LoggerSettings, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
        ConfirmationService,
      ],
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
