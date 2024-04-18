import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AppFeatureCard from '../AppFeatureCard.vue'

describe('AppFeatureCard.vue', () => {
  const wrapper = shallowMount(AppFeatureCard, {
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
