import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { describe, expect, it, vi } from 'vitest'

import LoggerSettings from '../LoggerSettings.vue'

describe('LoggerSettings.vue', () => {
  const wrapper = shallowMount(LoggerSettings, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
        ConfirmationService,
        ToastService,
      ],
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
