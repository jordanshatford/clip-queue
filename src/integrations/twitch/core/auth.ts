import type { AuthInfo, IDToken } from './types'

const BASE_URL = 'https://id.twitch.tv/oauth2'

/**
 * Get AuthInfo from Twitch login hash.
 * @param hash - The hash from the URL.
 * @returns The AuthInfo or null if the hash is invalid.
 */
export function login(hash: string): AuthInfo | null {
  const authInfo = processAuthHash(hash)
  if (authInfo.access_token && authInfo.id_token) {
    authInfo.decodedIdToken = parseJWT(authInfo.id_token) as IDToken
    return authInfo
  }
  return null
}

/**
 * Logout of Twitch.
 * @param clientID - The client ID to use.
 * @param token - The users Twitch token.
 */
export async function logout(clientID: string, token: string): Promise<void> {
  // Revoke the token
  const response = await fetch(`${BASE_URL}/revoke?client_id=${clientID}&token=${token}`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to revoke token')
  }
}

/**
 * Redirect to Twitch login.
 * @param clientID - The client ID to use.
 * @param redirectUri - The URI to redirect to after login.
 * @param scopes - The scopes to request.
 */
export function redirect(clientID: string, redirectUri: string, scopes: string[]): void {
  const loginURL = new URL(`${BASE_URL}/authorize`)
  loginURL.searchParams.set('client_id', clientID)
  loginURL.searchParams.set('redirect_uri', redirectUri)
  loginURL.searchParams.set('response_type', 'token id_token')
  loginURL.searchParams.set('scope', scopes.join(' '))
  loginURL.searchParams.set('claims', JSON.stringify({ id_token: { preferred_username: null } }))
  window.location.assign(loginURL)
}

/**
 * Check if a Twitch login is valid.
 * @param token - the users Twitch access token.
 * @returns True if the login is valid.
 */
export async function isLoginValid(token: string) {
  try {
    const response = await fetch(`${BASE_URL}/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Process the auth hash from the URL.
 * @param hash - The hash from the URL.
 * @returns The AuthInfo.
 */
function processAuthHash(hash: string): AuthInfo {
  const authInfo = hash
    .substring(1)
    .split('&')
    .reduce(
      (authInfo, s) => {
        const parts = s.split('=')
        const part0 = parts[0]
        const part1 = parts[1]
        if (part0 !== undefined && part1 !== undefined) {
          authInfo[part0] = decodeURIComponent(decodeURIComponent(part1))
        }
        return authInfo
        /* eslint-disable @typescript-eslint/no-explicit-any*/
      },
      {} as Record<string, any>,
    ) as AuthInfo
  return authInfo
}

/**
 * Parse a JWT token.
 * @param token - The JWT token.
 * @returns The decoded JWT token.
 */
function parseJWT(token: string) {
  const base64Url = token.split('.')[1]
  if (base64Url !== undefined) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  }
}

export default {
  login,
  logout,
  isLoginValid,
  redirect,
}
