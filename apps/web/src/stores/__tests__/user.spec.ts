import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TwitchUser } from '@cq/services/twitch'

import { useUser } from '../user'

const mockTwitchUser: TwitchUser = {
  id: 'testuser',
  login: 'testuser',
  display_name: 'Test User',
  type: 'user',
  broadcaster_type: 'affiliate',
  description: 'This is a test user',
  profile_image_url: 'https://twitch.tv/testuser/profile_image',
  offline_image_url: 'https://twitch.tv/testuser/offline_image',
  email: 'testuser@twitch.com',
  created_at: '2024-02-22T08:47:27.000Z',
  view_count: 1000
}

const USERNAME_JWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MzQzNTY4OTYsImV4cCI6MTc2NTg5Mjg5NiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXJuYW1lIn0.xh0Av0EJaMtHtSMP_-S1tnaq_XDSSAeEuNdtWpIaA6k'
const USERNAME2_JWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MzQzNTY4OTYsImV4cCI6MTc2NTg5Mjg5NiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXJuYW1lMiJ9.-Vg9EiryQCeHWJFkyhrdsyKn7DKmj21UJ_GEfjCtfxI'

describe('user.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Overwrite CLIENT_ID for testing
    vi.mock('@/config', async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import('@/config')>()),
        env: {
          CLIENT_ID: 'testClientId'
        }
      }
    })
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => {
          const data: TwitchUser[] = []
          return Promise.resolve({ data })
        }
      })
    )
  })

  it('redirects to twitch auth login', () => {
    const user = useUser()
    user.redirect()
  })

  it('can use twitch information to login', async () => {
    const user = useUser()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.ctx.id).toEqual('testClientId')
    expect(user.ctx.token).toEqual(undefined)
    expect(user.ctx.username).toEqual(undefined)
    const hash = `#access_token=aToken&id_token=${USERNAME_JWT}`
    await user.login(hash)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username')
    expect(user.ctx).toEqual({
      id: 'testClientId',
      token: 'aToken',
      username: 'username'
    })
  })

  it('can use twitch login information if successfully fetched', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => {
          const data = [mockTwitchUser]
          return Promise.resolve({ data })
        }
      })
    )
    const user = useUser()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.ctx.id).toEqual('testClientId')
    expect(user.ctx.token).toEqual(undefined)
    expect(user.ctx.username).toEqual(undefined)
    const hash = `#access_token=aToken&id_token=${USERNAME_JWT}`
    await user.login(hash)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('testuser')
    expect(user.ctx).toEqual({
      id: 'testClientId',
      token: 'aToken',
      username: 'testuser'
    })
  })

  it('updates the login info if the username changes', async () => {
    const user = useUser()
    await user.login(`#access_token=aToken&id_token=${USERNAME_JWT}`)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username')
    await user.login(`#access_token=aToken&id_token=${USERNAME2_JWT}`)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username2')
    expect(user.ctx).toEqual({
      id: 'testClientId',
      token: 'aToken',
      username: 'username2'
    })
  })

  it('logs out the user', async () => {
    const user = useUser()
    await user.login(`#access_token=aToken&id_token=${USERNAME_JWT}`)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username')
    await user.logout()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.ctx.token).toEqual(undefined)
    expect(user.ctx.username).toEqual(undefined)
    expect(user.ctx).toEqual({
      id: 'testClientId',
      token: undefined,
      username: undefined
    })
  })
})
