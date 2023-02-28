import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import RedditPage from '../RedditPage.vue'

describe('RedditPage.vue', () => {
  const wrapper = shallowMount(RedditPage, {
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
