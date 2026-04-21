import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import ToastService from 'primevue/toastservice'
import { describe, expect, it, vi } from 'vitest'

import QueueSettings from '../QueueSettings.vue'

describe('QueueSettings.vue', () => {
  const wrapper = shallowMount(QueueSettings, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
        ToastService,
      ],
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
