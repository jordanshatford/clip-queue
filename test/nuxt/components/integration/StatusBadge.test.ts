import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import IntegrationStatusBadge from '~/components/integration/StatusBadge.vue'
import { IntegrationStatus } from '~/integrations/core'

vi.mock('#paraglide/messages', () => ({
  m: {
    healthy: () => 'Healthy',
    unknown: () => 'Unknown',
    misconfigured: () => 'Misconfigured',
    error: () => 'Error',
    disabled: () => 'Disabled',
  },
}))

describe('IntegrationStatusBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    [IntegrationStatus.UNKNOWN, 'Unknown'],
    [IntegrationStatus.DISABLED, 'Disabled'],
    [IntegrationStatus.MISCONFIGURED, 'Misconfigured'],
    [IntegrationStatus.ERROR, 'Error'],
    [IntegrationStatus.HEALTHY, 'Healthy'],
  ])('renders the translated status for %s', async (status: IntegrationStatus, text: string) => {
    const wrapper = await mountSuspended(IntegrationStatusBadge, {
      props: {
        status,
      },
    })
    expect(wrapper.text()).toContain(text)
  })

  it.each([
    [IntegrationStatus.UNKNOWN, 'warning', 'lucide:triangle-alert'],
    [IntegrationStatus.DISABLED, 'neutral', 'lucide:circle-stop'],
    [IntegrationStatus.MISCONFIGURED, 'error', 'lucide:circle-alert'],
    [IntegrationStatus.ERROR, 'error', 'lucide:circle-alert'],
    [IntegrationStatus.HEALTHY, 'success', 'lucide:circle-check'],
  ])(
    'passes the correct props to UBadge for %s',
    async (status: IntegrationStatus, color: string, icon: string) => {
      const wrapper = await mountSuspended(IntegrationStatusBadge, {
        props: {
          status,
        },
      })
      const badge = wrapper.getComponent({ name: 'UBadge' })
      expect(badge.props()).toMatchObject({
        size: 'sm',
        variant: 'subtle',
        color,
        icon,
      })
    },
  )
})
