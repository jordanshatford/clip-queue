import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ToastService from 'primevue/toastservice'
import QueueSettings from '../QueueSettings.vue'

describe('QueueSettings.vue', () => {
  const wrapper = shallowMount(QueueSettings, {
    global: {
      plugins: [createTestingPinia(), ToastService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
