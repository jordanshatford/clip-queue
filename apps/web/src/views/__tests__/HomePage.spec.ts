import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HomePage from '../HomePage.vue'

describe('HomePage.vue', () => {
  const wrapper = shallowMount(HomePage)

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has the proper features', () => {
    // @ts-expect-error Test VM not typed properly
    expect(wrapper.vm.features.length).toEqual(6)
  })
})
