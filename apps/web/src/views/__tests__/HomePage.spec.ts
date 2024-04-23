import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import config from '@/config'
import HomePage from '../HomePage.vue'

describe('HomePage.vue', () => {
  const wrapper = shallowMount(HomePage)

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has the proper tagline, description, and features from config', () => {
    // @ts-ignore
    expect(wrapper.vm.tagline).toEqual(config.about.tagline)
    // @ts-ignore
    expect(wrapper.vm.features.length).toEqual(config.about.features.length)
    // @ts-ignore
    expect(wrapper.vm.features).toEqual(config.about.features)
  })
})
