import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import CommandsSettings from '~/pages/settings/commands.vue'

describe('settings/commands.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(CommandsSettings)
    expect(component.exists()).toBe(true)
  })
})
