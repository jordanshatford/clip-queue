import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ToastService from 'primevue/toastservice'
import ChatSettings from '../ChatSettings.vue'

describe('ChatSettings.vue', () => {
  const wrapper = shallowMount(ChatSettings, {
    global: {
      plugins: [createTestingPinia(), ToastService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has the same settings values as previous', () => {
    // @ts-ignore
    expect(wrapper.vm.formSettings.prefix).toEqual('!cq')
  })

  it('resets the form to the settings when not saved', async () => {
    // @ts-ignore
    wrapper.vm.formSettings.prefix = '~'
    await wrapper.vm.$nextTick()
    // @ts-ignore
    wrapper.vm.onReset()
    // @ts-ignore
    expect(wrapper.vm.formSettings.prefix).toEqual('!cq')
  })
})
