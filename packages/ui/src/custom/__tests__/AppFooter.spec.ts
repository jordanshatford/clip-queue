import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppFooter from '../AppFooter.vue'

describe('AppFooter.vue', () => {
  const wrapper = shallowMount(AppFooter, {
    props: {
      github: 'testgithub',
      copyright: {
        owner: 'testowner',
        year: 2024
      }
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has the proper copyright and github from config', () => {
    expect(wrapper.vm.copyright).toEqual({ owner: 'testowner', year: 2024 })
    expect(wrapper.vm.github).toEqual('testgithub')
  })
})
