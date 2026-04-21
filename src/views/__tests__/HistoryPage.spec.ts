import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import ConfirmationService from 'primevue/confirmationservice'
import { describe, expect, it, vi } from 'vitest'

import HistoryPage from '../HistoryPage.vue'

describe('HistoryPage.vue', () => {
  const wrapper = shallowMount(HistoryPage, {
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
