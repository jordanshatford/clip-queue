import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AppNavBar from '../AppNavBar.vue'

describe('AppNavBar.vue', () => {
  const wrapper = shallowMount(AppNavBar, {
    global: {
      plugins: [createTestingPinia()]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
