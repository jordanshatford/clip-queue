import { describe, expect, it } from 'vitest'

import TwitchAuth from '../auth'

describe('twitch-auth.ts', () => {
  it('parses twitch authorization hash into login details', () => {
    const authHash =
      '#access_token=token&id_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI&scope=openid+chat%3Aread&token_type=bearer'
    const authInfo = TwitchAuth.login(authHash)
    expect(authInfo?.access_token).toEqual('token')
    // This is a fake token
    expect(authInfo?.id_token).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI'
    )
    expect(authInfo?.scope).toEqual('openid+chat:read')
    expect(authInfo?.token_type).toEqual('bearer')
    expect(authInfo?.decodedIdToken).toEqual({
      iat: 1422779638,
      loggedInAs: 'admin'
    })
  })

  it('returns null when invalid authorization hash is provided', () => {
    const authHash = ''
    const authInfo = TwitchAuth.login(authHash)
    expect(authInfo).toEqual(null)
  })
})
