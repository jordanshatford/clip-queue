import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UTooltipStub } from '~~/test/mocks/stubs'

import IntegrationAvatars from '~/components/integration/Avatars.vue'
import { IntegrationStatus } from '~/integrations/core'

const integrationsMock = vi.fn()

mockNuxtImport('useIntegrations', () => {
  return () => integrationsMock()
})

describe('integration/Avatars.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders avatars for logged in integrations only', async () => {
    integrationsMock.mockReturnValue({
      integrations: [
        {
          authentication: {
            isLoggedIn: true,
            user: {
              name: 'Twitch User',
              profileImageURL: 'https://cdn.test/twitch.png',
            },
          },
          source: {
            status: IntegrationStatus.HEALTHY,
          },
        },
        {
          authentication: {
            isLoggedIn: false,
            user: {
              name: 'YouTube User',
              profileImageURL: 'https://cdn.test/youtube.png',
            },
          },
          source: {
            status: IntegrationStatus.HEALTHY,
          },
        },
      ],
    })

    const wrapper = await mountSuspended(IntegrationAvatars, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })
    const avatars = wrapper.findAllComponents({ name: 'UAvatar' })
    expect(avatars).toHaveLength(1)
    expect(avatars[0]?.props('src')).toBe('https://cdn.test/twitch.png')
    expect(avatars[0]?.props('alt')).toBe('Twitch User')
  })

  it('passes chip color when integration has a source', async () => {
    integrationsMock.mockReturnValue({
      integrations: [
        {
          authentication: {
            isLoggedIn: true,
            user: {
              name: 'Kick User',
              profileImageURL: 'https://cdn.test/kick.png',
            },
          },
          source: {
            status: IntegrationStatus.HEALTHY,
          },
        },
      ],
    })

    const wrapper = await mountSuspended(IntegrationAvatars, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })
    const avatar = wrapper.findComponent({ name: 'UAvatar' })
    expect(avatar.props('chip')).toEqual({
      inset: true,
      color: 'success',
    })
  })

  it('does not pass chip when source is missing', async () => {
    integrationsMock.mockReturnValue({
      integrations: [
        {
          authentication: {
            isLoggedIn: true,
            user: {
              name: 'User',
              profileImageURL: 'https://cdn.test/user.png',
            },
          },
          source: undefined,
        },
      ],
    })

    const wrapper = await mountSuspended(IntegrationAvatars, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })
    const avatar = wrapper.findComponent({ name: 'UAvatar' })
    expect(avatar.props('chip')).toBeUndefined()
  })

  it('renders tooltip text from avatar alt', async () => {
    integrationsMock.mockReturnValue({
      integrations: [
        {
          authentication: {
            isLoggedIn: true,
            user: {
              name: 'Streamer',
              profileImageURL: 'https://cdn.test/streamer.png',
            },
          },
          source: {
            status: IntegrationStatus.HEALTHY,
          },
        },
      ],
    })

    const wrapper = await mountSuspended(IntegrationAvatars, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })
    const tooltip = wrapper.findComponent({ name: 'UTooltip' })
    expect(tooltip.props('text')).toBe('Streamer')
  })

  it('renders no avatars when nobody is logged in', async () => {
    integrationsMock.mockReturnValue({
      integrations: [
        {
          authentication: {
            isLoggedIn: false,
          },
        },
      ],
    })

    const wrapper = await mountSuspended(IntegrationAvatars, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })
    const avatars = wrapper.findAllComponents({ name: 'UAvatar' })
    expect(avatars).toHaveLength(0)
  })
})
