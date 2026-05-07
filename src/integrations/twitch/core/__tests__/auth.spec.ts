import { describe, expect, it } from 'vitest'

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
})
