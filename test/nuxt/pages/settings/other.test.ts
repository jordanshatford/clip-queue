import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import OtherSettings from '~/pages/settings/other.vue'

describe('settings/other.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(OtherSettings)
    expect(component.exists()).toBe(true)
  })
})
