import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppThemePickerButton from '~/components/AppThemePickerButton.vue'

describe('AppThemePickerButton.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(AppThemePickerButton, {
      props: {
        name: 'amber',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders color text', async () => {
    const wrapper = await mountSuspended(AppThemePickerButton, {
      props: {
        name: 'amber',
      },
    })
    expect(wrapper.text().length).toBeGreaterThan(0)
  })

  it('renders color indicator', async () => {
    const wrapper = await mountSuspended(AppThemePickerButton, {
      props: {
        name: 'amber',
      },
    })
    const indicator = wrapper.find('span')
    expect(indicator.exists()).toBe(true)
    expect(indicator.classes()).toContain('size-2')
    expect(indicator.classes()).toContain('rounded-full')
  })

  it('updates when color changes', async () => {
    const wrapper = await mountSuspended(AppThemePickerButton, {
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
