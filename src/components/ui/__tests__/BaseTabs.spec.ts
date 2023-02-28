import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BaseTabs from '../BaseTabs.vue'

describe('BaseTabs.vue', () => {
  const wrapper = shallowMount(BaseTabs, {
    props: {
      modelValue: 'test',
      options: [{ label: 'test' }, { label: 'test2' }]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
