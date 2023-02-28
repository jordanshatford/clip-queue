import axios from 'axios'
import type { IDToken, TokenInfo, AuthInfo } from './types'

const BASE_URL = 'https://id.twitch.tv/oauth2'

export function login(hash: string): AuthInfo | null {
  const authInfo = processAuthHash(hash)
  if (authInfo.access_token && authInfo.id_token) {
    authInfo.decodedIdToken = parseJWT(authInfo.id_token) as IDToken
    return authInfo
  }
  return null
}

export async function logout(clientId: string, token: string): Promise<void> {
  // Revoke the token
  await axios.post(`${BASE_URL}/revoke?client_id=${clientId}&token=${token}`)
}

export function redirect(clientId: string, redirectUri: string, scopes: string[]): void {
  const loginUrl = encodeURI(
    `${BASE_URL}/authorize?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=token id_token` +
      `&scope=${scopes.join(' ')}` +
      `&claims={"id_token":{"preferred_username":null}}`
  )
  window.location.assign(loginUrl)
}

export async function isTokenStillValid(token: string) {
  const { status } = await axios.get<TokenInfo>(`${BASE_URL}/validate`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return status === 200
}

function processAuthHash(hash: string): AuthInfo {
  const authInfo = hash
    .substring(1)
    .split('&')
    .reduce((authInfo, s) => {
      const parts = s.split('=')
      authInfo[parts[0]] = decodeURIComponent(decodeURIComponent(parts[1]))
      return authInfo
      /* eslint-disable @typescript-eslint/no-explicit-any*/
    }, {} as Record<string, any>) as AuthInfo
  return authInfo
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
function parseJWT(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export default {
  login,
  logout,
  isTokenStillValid,
  redirect
}
