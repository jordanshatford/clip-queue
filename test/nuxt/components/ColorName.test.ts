import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ColorName from '~/components/ColorName.vue'

describe('ColorName.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(ColorName, {
      props: {
        name: 'amber',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders color text', async () => {
    const wrapper = await mountSuspended(ColorName, {
      props: {
        name: 'amber',
      },
    })
    expect(wrapper.text().length).toBeGreaterThan(0)
  })

  it('renders color indicator', async () => {
    const wrapper = await mountSuspended(ColorName, {
      props: {
        name: 'amber',
      },
    })
    const indicator = wrapper.find('span')
    expect(indicator.exists()).toBe(true)
    expect(indicator.classes()).toContain('h-4')
    expect(indicator.classes()).toContain('w-4')
    expect(indicator.classes()).toContain('rounded-full')
  })

  it('updates when color changes', async () => {
    const wrapper = await mountSuspended(ColorName, {
      props: {
        name: 'amber',
      },
    })
    const originalText = wrapper.text()
    await wrapper.setProps({
      name: 'neutral',
    })
    expect(wrapper.text()).not.toBe(originalText)
  })
})
