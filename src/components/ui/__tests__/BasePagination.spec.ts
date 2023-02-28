import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BasePagination from '../BasePagination.vue'

describe('BasePagination.vue', () => {
  const wrapper = shallowMount(BasePagination, {
    props: {
      modelValue: 4,
      totalPages: 10
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('shows the correct number options', () => {
    // @ts-ignore
    expect(wrapper.vm.clickableNumbers).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
})
