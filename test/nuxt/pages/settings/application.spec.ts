import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ApplicationSettings from '~/pages/settings/application.vue'

describe('settings/application.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(ApplicationSettings)
    expect(component.exists()).toBe(true)
  })
})
