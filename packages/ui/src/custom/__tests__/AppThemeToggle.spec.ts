import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppThemeToggle from '../AppThemeToggle.vue'

describe('AppThemeToggle.vue', () => {
  const wrapper = shallowMount(AppThemeToggle, {
    props: {
      isDarkMode: false
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
