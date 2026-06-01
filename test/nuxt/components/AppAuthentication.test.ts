import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import UserMenu from '~/components/AppAuthentication.vue'

const loginMock = vi.fn()
const logoutMock = vi.fn()
const sourceMock = vi.fn()

const integrationsMock = {
  integrations: [],
  isLoggedIn: false,
  login: loginMock,
  logoutAll: logoutMock,
  source: sourceMock,
}

mockNuxtImport('useIntegrations', () => () => integrationsMock)

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
    integrationsMock.isLoggedIn = false
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
    expect(loginMock).toHaveBeenCalled()
  })

  it('creates settings and logout menu items', async () => {
    integrationsMock.isLoggedIn = true
    const wrapper = await mountSuspended(UserMenu)
    const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
    const items = dropdown.props('items')
    expect(items[0][0].label).toBe('Settings')
    expect(items[1][0].label).toBe('Logout')
  })

  it('logout menu item calls logout handler', async () => {
    integrationsMock.isLoggedIn = true
    const wrapper = await mountSuspended(UserMenu)
    const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
    const items = dropdown.props('items')
    await items[1][0].onSelect()
    expect(logoutMock).toHaveBeenCalled()
  })
})
