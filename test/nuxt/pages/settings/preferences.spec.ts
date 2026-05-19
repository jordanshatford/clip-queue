import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PreferencesSettings from '~/pages/settings/preferences.vue'

describe('settings/preferences.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(PreferencesSettings)
    expect(component.exists()).toBe(true)
  })
})
