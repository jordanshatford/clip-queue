import type { AuthInfo, IDToken, TwitchUserCtx } from './types'

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
 * @param ctx - The Twitch user context.
 */
export async function logout(ctx: TwitchUserCtx): Promise<void> {
  // Revoke the token
  const response = await fetch(`${BASE_URL}/revoke?client_id=${ctx.id}&token=${ctx.token}`, {
    method: 'POST'
  })
  if (!response.ok) {
    throw new Error('Failed to revoke token')
  }
}

/**
 * Redirect to Twitch login.
 * @param ctx - The Twitch user context.
 * @param redirectUri - The URI to redirect to after login.
 * @param scopes - The scopes to request.
 */
export function redirect(ctx: Partial<TwitchUserCtx>, redirectUri: string, scopes: string[]): void {
  const loginUrl = encodeURI(
    `${BASE_URL}/authorize?client_id=${ctx.id}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=token id_token` +
      `&scope=${scopes.join(' ')}` +
      `&claims={"id_token":{"preferred_username":null}}`
  )
  window.location.assign(loginUrl)
}

/**
 * Check if a Twitch login is valid.
 * @param ctx - The Twitch user context.
 * @returns True if the login is valid.
 */
export async function isLoginValid(ctx: TwitchUserCtx) {
  try {
    const response = await fetch(`${BASE_URL}/validate`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`
      }
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
      {} as Record<string, any>
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
        .join('')
    )
    return JSON.parse(jsonPayload)
  }
}

export default {
  login,
  logout,
  isLoginValid,
  redirect
}
