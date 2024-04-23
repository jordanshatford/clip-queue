import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ConfirmationService, ToastService } from '@cq/ui'

import OtherSettings from '../OtherSettings.vue'

describe('OtherSettings.vue', () => {
  const wrapper = shallowMount(OtherSettings, {
    global: {
      plugins: [createTestingPinia(), ConfirmationService, ToastService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
