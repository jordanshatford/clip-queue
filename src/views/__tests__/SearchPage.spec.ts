import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import SearchPage from '../SearchPage.vue'

describe('SearchPage.vue', () => {
  const wrapper = shallowMount(SearchPage, {
    global: {
      plugins: [createTestingPinia()]
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
