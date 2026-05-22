import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationSource from '~/components/integration/Source.vue'
import { chat } from '~/integrations/twitch'

describe('IntegrationSource.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationSource, {
      props: {
        modelValue: chat,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
