import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationCard from '~/components/integration/Card.vue'
import { twitch } from '~/integrations/twitch'

describe('integration/Card.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationCard, {
      props: {
        modelValue: twitch,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
