import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import ToastService from 'primevue/toastservice'
import { describe, expect, it, vi } from 'vitest'

import ApplicationSettings from '../ApplicationSettings.vue'

describe('ApplicationSettings.vue', () => {
  const wrapper = shallowMount(ApplicationSettings, {
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

  it('has the same settings values as previous', () => {
    // @ts-expect-error Test VM not typed properly
    expect(wrapper.vm.formSettings.prefix).toEqual('!cq')
  })

  it('resets the form to the settings when not saved', async () => {
    // @ts-expect-error Test VM not typed properly
    wrapper.vm.formSettings.prefix = '~'
    await wrapper.vm.$nextTick()
    // @ts-expect-error Test VM not typed properly
    wrapper.vm.onReset()
    // @ts-expect-error Test VM not typed properly
    expect(wrapper.vm.formSettings.prefix).toEqual('!cq')
  })
})
