import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationSource from '~/components/integration/Source.vue'
import { source } from '~/integrations/twitch'

describe('integration/Source.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationSource, {
      props: {
        modelValue: source,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
