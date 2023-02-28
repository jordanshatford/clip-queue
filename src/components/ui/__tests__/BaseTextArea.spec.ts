import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BaseTextArea from '../BaseTextArea.vue'

describe('BaseTextArea.vue', () => {
  const wrapper = shallowMount(BaseTextArea, {
    props: {
      modelValue: 'test'
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('emits a update model value event when inputted', async () => {
    await wrapper.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
