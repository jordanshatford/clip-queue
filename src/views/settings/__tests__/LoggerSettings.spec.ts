import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmationService, ToastService } from '@/components/ui'
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
