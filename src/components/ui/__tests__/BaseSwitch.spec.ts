import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BaseSwitch from '../BaseSwitch.vue'

describe('BaseSwitch.vue', () => {
  const wrapper = shallowMount(BaseSwitch, {
    props: {
      id: 'test',
      modelValue: false
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
