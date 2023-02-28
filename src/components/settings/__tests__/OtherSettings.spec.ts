import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OtherSettings from '../OtherSettings.vue'

describe('OtherSettings.vue', () => {
  const wrapper = shallowMount(OtherSettings, {
    global: {
      plugins: [createTestingPinia()]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
