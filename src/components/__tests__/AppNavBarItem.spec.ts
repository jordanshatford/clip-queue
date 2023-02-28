import { describe, it, expect } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'
import { shallowMount } from '@vue/test-utils'
import AppNavBarItem from '../AppNavBarItem.vue'

describe('AppNavBarItem.vue', () => {
  const wrapper = shallowMount(AppNavBarItem, {
    props: {
      isMobileMenu: false,
      route: {
        name: 'Test',
        path: '/test'
      } as RouteRecordRaw
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('has the correct route as a prop', () => {
    expect(wrapper.vm.route.name).toEqual('Test')
    expect(wrapper.vm.route.path).toEqual('/test')
  })
})
