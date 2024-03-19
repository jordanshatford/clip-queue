import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AppFeature from '../AppFeature.vue'

describe('AppFeature.vue', () => {
  const wrapper = shallowMount(AppFeature, {
    props: {
      title: 'test',
      description: 'test description',
      icon: 'test-icon'
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
