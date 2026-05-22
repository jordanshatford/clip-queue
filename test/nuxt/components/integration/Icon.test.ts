import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationIcon from '~/components/integration/Icon.vue'
import { IntegrationID } from '~/integrations'

describe('integration/Icon.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationIcon, {
      props: {
        id: IntegrationID.TWITCH,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
