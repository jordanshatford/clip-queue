import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppNavBar from '../AppNavBar.vue'

describe('AppNavBar.vue', () => {
  const wrapper = shallowMount(AppNavBar, {
    global: {
      plugins: [createTestingPinia()],
      stubs: {
        img: true,
      },
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
