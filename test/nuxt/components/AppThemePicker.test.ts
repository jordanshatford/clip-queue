import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppThemePicker from '~/components/AppThemePicker.vue'

describe('ThemePicker.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(AppThemePicker)
    expect(component.exists()).toBe(true)
  })
})
