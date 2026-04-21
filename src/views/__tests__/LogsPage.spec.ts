import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import ConfirmationService from 'primevue/confirmationservice'
import { describe, expect, it, vi } from 'vitest'

import LogsPage from '../LogsPage.vue'

describe('LogsPage.vue', () => {
  const wrapper = shallowMount(LogsPage, {
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
