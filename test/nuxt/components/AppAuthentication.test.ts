import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import type { UserDetails } from '~/integrations/core'

import UserMenu from '~/components/AppAuthentication.vue'

const redirectMock = vi.fn()
const logoutMock = vi.fn()

const userMock = {
  isLoggedIn: false,
  details: undefined as UserDetails | undefined,
  redirect: redirectMock,
  logout: logoutMock,
}

const sourceMock = vi.fn()

mockNuxtImport('useUser', () => () => userMock)

mockNuxtImport('useIntegrations', () => () => ({
  source: sourceMock,
}))

vi.mock('#paraglide/messages', () => ({
  m: {
    login: () => 'Login',
    logout: () => 'Logout',
    settings: () => 'Settings',
  },
}))

describe('UserMenu.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userMock.isLoggedIn = false
    userMock.details = undefined
    sourceMock.mockReturnValue({
      status: 'connected',
    })
  })

  it('renders login button when logged out', async () => {
    const wrapper = await mountSuspended(UserMenu)
    expect(wrapper.text()).toContain('Login')
  })

  it('calls redirect when login button clicked', async () => {
    const wrapper = await mountSuspended(UserMenu)
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(redirectMock).toHaveBeenCalled()
  })

  it('renders user name when logged in', async () => {
    userMock.isLoggedIn = true
    userMock.details = {
      id: '',
      name: 'Jordan',
      profileImageURL: 'https://example.com/avatar.png',
    }
    const wrapper = await mountSuspended(UserMenu)
    expect(wrapper.text()).toContain('Jordan')
  })

  it('builds avatar using profile image', async () => {
    userMock.isLoggedIn = true
    userMock.details = {
      id: '',
      name: 'Jordan',
      profileImageURL: 'https://example.com/avatar.png',
    }
    const wrapper = await mountSuspended(UserMenu)
    const button = wrapper.findComponent({ name: 'UButton' })
    expect(button.props('avatar')).toMatchObject({
      src: 'https://example.com/avatar.png',
      loading: 'lazy',
      icon: 'lucide:image',
    })
  })

  it('creates settings and logout menu items', async () => {
    userMock.isLoggedIn = true
    userMock.details = {
      id: '',
      name: 'Jordan',
      profileImageURL: 'avatar.png',
    }
    const wrapper = await mountSuspended(UserMenu)
    const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
    const items = dropdown.props('items')
    expect(items[0][0].label).toBe('Settings')
    expect(items[1][0].label).toBe('Logout')
  })

  it('logout menu item calls logout handler', async () => {
    userMock.isLoggedIn = true
    userMock.details = {
      id: '',
      name: 'Jordan',
      profileImageURL: 'avatar.png',
    }
    const wrapper = await mountSuspended(UserMenu)
    const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
    const items = dropdown.props('items')
    await items[1][0].onSelect()
    expect(logoutMock).toHaveBeenCalled()
  })
})
