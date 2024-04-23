import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
