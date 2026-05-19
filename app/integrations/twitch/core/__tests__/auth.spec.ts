import { beforeEach, describe, expect, it, vi } from 'vitest'

import TwitchAuth from '../auth'

const accessToken = 'token'
const idToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI'
const scope = 'openid+chat:read'
const tokenType = 'bearer'
const state = 'test'

const params = new URLSearchParams()
params.set('access_token', accessToken)
params.set('id_token', idToken)
params.set('scope', 'openid+chat:read')
params.set('token_type', 'bearer')
params.set('state', state)
const hash = `#${params.toString()}`

describe('integrations/twitch/core/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('parses twitch authorization hash into login details', () => {
    const authInfo = TwitchAuth.login(hash, state)
    expect(authInfo?.access_token).toEqual(accessToken)
    // This is a fake token
    expect(authInfo?.id_token).toEqual(idToken)
    expect(authInfo?.scope).toEqual(scope)
    expect(authInfo?.token_type).toEqual(tokenType)
    expect(authInfo?.decodedIdToken).toEqual({
      iat: 1422779638,
      loggedInAs: 'admin',
    })
  })

  it('returns null when state value is not present in the hash', () => {
    const p = new URLSearchParams(params)
    p.delete('state')
    const authInfo = TwitchAuth.login(`#${p.toString()}`, state)
    expect(authInfo).toEqual(null)
  })

  it('returns null when state value does not match the hash', () => {
    const authInfo = TwitchAuth.login(hash, 'differentstate')
    expect(authInfo).toEqual(null)
  })

  it('returns null when invalid authorization hash is provided', () => {
    const p = new URLSearchParams(params)
    p.delete('access_token')
    p.delete('id_token')
    const authInfo = TwitchAuth.login(`#${p.toString()}`, state)
    expect(authInfo).toEqual(null)
  })

  it('can successfully logout of twitch', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
    } as Response)
    global.fetch = fetchMock
    await TwitchAuth.logout('client-id', 'token-123')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://id.twitch.tv/oauth2/revoke?client_id=client-id&token=token-123',
      {
        method: 'POST',
      },
    )
  })

  it('throws an error when failing to logout of twitch', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: false,
    } as Response)
    global.fetch = fetchMock
    await expect(TwitchAuth.logout('client-id', 'token-123')).rejects.toThrow(
      'Failed to revoke token',
    )
  })

  it('returns true when the token is valid', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    } as Response)
    const result = await TwitchAuth.isLoginValid('token-123')
    expect(result).toEqual(true)
    expect(fetchMock).toHaveBeenCalledWith('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: 'Bearer token-123',
      },
    })
  })

  it('returns false when the token is invalid', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as Response)
    const result = await TwitchAuth.isLoginValid('token-123')
    expect(result).toEqual(false)
  })

  it('returns false when fetch throws', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))
    const result = await TwitchAuth.isLoginValid('token-123')
    expect(result).toEqual(false)
  })
})
