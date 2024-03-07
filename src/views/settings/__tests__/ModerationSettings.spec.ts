import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ToastService from 'primevue/toastservice'
import ModerationSettings from '../ModerationSettings.vue'

describe('ModerationSettings.vue', () => {
  const wrapper = shallowMount(ModerationSettings, {
    global: {
      plugins: [createTestingPinia(), ToastService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
