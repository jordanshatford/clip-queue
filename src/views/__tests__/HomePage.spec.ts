import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HomePage from '../HomePage.vue'
import config from '../../assets/config'

describe('HomePage.vue', () => {
  const wrapper = shallowMount(HomePage)

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has the proper title, tagline, description, and features from config', () => {
    // @ts-ignore
    expect(wrapper.vm.title).toEqual(config.about.title)
    // @ts-ignore
    expect(wrapper.vm.tagline).toEqual(config.about.tagline)
    // @ts-ignore
    expect(wrapper.vm.description).toEqual(config.about.description)
    // @ts-ignore
    expect(wrapper.vm.features.length).toEqual(config.about.features.length)
    // @ts-ignore
    expect(wrapper.vm.features).toEqual(config.about.features)
  })
})
