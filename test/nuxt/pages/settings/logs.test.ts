import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import LogsSettings from '~/pages/settings/logs.vue'

describe('settings/logs.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(LogsSettings)
    expect(component.exists()).toBe(true)
  })
})
