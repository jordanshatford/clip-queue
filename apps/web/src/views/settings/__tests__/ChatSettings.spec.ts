import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ToastService } from '@cq/ui'

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
