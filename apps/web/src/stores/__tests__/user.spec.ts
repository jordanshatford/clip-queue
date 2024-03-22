import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { AuthInfo } from '@cq/services/twitch'
import { useUser } from '../user'

// Overwrite CLIENT_ID for testing
vi.mock('@/assets/config', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/assets/config')>()),
    env: {
      CLIENT_ID: 'testClientId'
    }
  }
})

describe('user.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('redirects to twitch auth login', () => {
    const user = useUser()
    user.redirect()
  })

  it('can use twitch information to login', () => {
    const user = useUser()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.ctx.id).toEqual('testClientId')
    expect(user.ctx.token).toEqual(undefined)
    expect(user.ctx.username).toEqual(undefined)
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username')
    expect(user.ctx).toEqual({ id: 'testClientId', token: 'aToken', username: 'username' })
  })

  it('updates the login info if the username changes', () => {
    const user = useUser()
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username')
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username2' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username2')
    expect(user.ctx).toEqual({ id: 'testClientId', token: 'aToken', username: 'username2' })
  })

  it('logs out the user', async () => {
    const user = useUser()
    user.login({
      access_token: 'aToken',
      id_token: 'idToken',
      decodedIdToken: { preferred_username: 'username' }
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.ctx.token).toEqual('aToken')
    expect(user.ctx.username).toEqual('username')
    await user.logout()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.ctx.token).toEqual(undefined)
    expect(user.ctx.username).toEqual(undefined)
    expect(user.ctx).toEqual({ id: 'testClientId', token: undefined, username: undefined })
  })
})
