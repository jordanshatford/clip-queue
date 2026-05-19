import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import IntegrationAuthentication from '~/components/integrations/IntegrationAuthentication.vue'
import { authentication } from '~/integrations/twitch'

describe('IntegrationAuthentication.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(IntegrationAuthentication, {
      props: {
        modelValue: authentication,
      },
    })
    expect(component.exists()).toBe(true)
  })
})
