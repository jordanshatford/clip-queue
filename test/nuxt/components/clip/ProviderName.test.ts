import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import { IntegrationID } from '@/integrations'
import ProviderName from '~/components/clip/ProviderName.vue'

const { providerMock } = vi.hoisted(() => ({
  providerMock: vi.fn(),
}))

mockNuxtImport('useIntegrations', () => {
  return () => ({
    initialize: vi.fn(),
    provider: providerMock,
  })
})

describe('clip/ProviderName.vue', () => {
  it('renders provider name from integration provider()', async () => {
    providerMock.mockReturnValue({
      name: 'Twitch',
    })
    const wrapper = await mountSuspended(ProviderName, {
      props: {
        id: IntegrationID.TWITCH_CLIPS,
      },
      global: {
        stubs: {
          IntegrationIcon: true,
        },
      },
    })
    expect(wrapper.text()).toContain('Twitch')
    expect(providerMock).toHaveBeenCalledWith(IntegrationID.TWITCH_CLIPS)
  })

  it('renders undefined provider safely', async () => {
    providerMock.mockReturnValue(undefined)
    const wrapper = await mountSuspended(ProviderName, {
      props: {
        id: IntegrationID.TWITCH_CLIPS,
      },
      global: {
        stubs: {
          IntegrationIcon: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
