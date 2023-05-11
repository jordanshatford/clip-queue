import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton.vue', () => {
  const wrapper = shallowMount(BaseButton as any)

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has a default variant of primary with the correct colors', () => {
    expect(wrapper.vm.variant).toEqual('primary')
    expect(wrapper.classes()).toContain('bg-blue-500')
  })

  it('has the correct colors when primary variant is specified', async () => {
    wrapper.setProps({ variant: 'primary' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual('primary')
    expect(wrapper.classes()).toContain('bg-blue-500')
  })

  it('has the correct colors when brand variant is specified', async () => {
    wrapper.setProps({ variant: 'brand' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual('brand')
    expect(wrapper.classes()).toContain('bg-brand-500')
  })

  it('has the correct colors when danger variant is specified', async () => {
    wrapper.setProps({ variant: 'danger' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual('danger')
    expect(wrapper.classes()).toContain('bg-red-500')
  })

  it('emits a click event when clicked', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
