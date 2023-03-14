import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUser } from '../user'
import type { AuthInfo } from '../../services/twitch'

// Overwrite CLIENT_ID for testing
vi.mock('@/assets/config', () => {
  return {
    env: {
      CLIENT_ID: 'testClientId'
    }
  }
})

describe('user.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    import.meta.env.VITE_TWITCH_CLIENT_ID = 't'
  })

  it('redirects to twitch auth login', () => {
    const user = useUser()
    user.redirect()
  })

  it('can use twitch information to login', () => {
    const user = useUser()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.accessToken).toEqual(null)
    expect(user.idToken).toEqual(null)
    expect(user.username).toEqual(null)
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual('aToken')
    expect(user.idToken).toEqual('idToken')
    expect(user.username).toEqual('username')
    expect(user.ctx).toEqual({ id: 'testClientId', token: 'aToken' })
  })

  it('updates the login info if the username changes', () => {
    const user = useUser()
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual('aToken')
    expect(user.idToken).toEqual('idToken')
    expect(user.username).toEqual('username')
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username2' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual('aToken')
    expect(user.idToken).toEqual('idToken')
    expect(user.username).toEqual('username2')
    expect(user.ctx).toEqual({ id: 'testClientId', token: 'aToken' })
  })

  it('logs out the user', async () => {
    const user = useUser()
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual('aToken')
    expect(user.idToken).toEqual('idToken')
    expect(user.username).toEqual('username')
    await user.logout()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.accessToken).toEqual(null)
    expect(user.idToken).toEqual(null)
    expect(user.username).toEqual(null)
    expect(user.ctx).toEqual({ id: 'testClientId', token: '' })
  })
})
