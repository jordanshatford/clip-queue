import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AppHamburger from '../AppHamburger.vue'

describe('AppHamburger.vue', () => {
  const wrapper = shallowMount(AppHamburger)

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
