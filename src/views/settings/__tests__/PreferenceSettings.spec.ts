import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmationService, ToastService } from '@/components/ui'
import PreferenceSettings from '../PreferenceSettings.vue'

describe('PreferenceSettings.vue', () => {
  const wrapper = shallowMount(PreferenceSettings, {
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
