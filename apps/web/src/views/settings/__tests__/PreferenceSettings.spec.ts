import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ConfirmationService, ToastService } from '@cq/ui'

import PreferenceSettings from '../PreferenceSettings.vue'

describe('PreferenceSettings.vue', () => {
  const wrapper = shallowMount(PreferenceSettings, {
    global: {
      plugins: [createTestingPinia(), ConfirmationService, ToastService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
