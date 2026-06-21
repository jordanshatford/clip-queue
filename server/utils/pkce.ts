import { createHash, randomBytes } from 'node:crypto'

/**
 * Encodes a buffer to a base64 URL-safe string by replacing characters that are not URL-safe
 * and removing padding characters.
 * @param buffer - The buffer to encode as a base64 URL-safe string.
 * @returns A base64 URL-safe encoded string.
 */
function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Generates a random string of the specified length using cryptographic random bytes and encodes it
 * as a base64 URL-safe string.
 * @param length - The length of the random string to generate.
 * @returns A base64 URL-safe encoded random string.
 */
export function createRandomString(length: number = 32): string {
  return base64UrlEncode(randomBytes(length))
}

/**
 * PKCE (Proof Key for Code Exchange) is an extension to the OAuth 2.0 protocol that provides enhanced security
 * for public clients (such as single-page applications and mobile apps) by mitigating authorization code interception
 * attacks. The PKCE flow involves the client generating a random code verifier and a corresponding code challenge,
 * which are used during the authorization request and token exchange process to ensure that the authorization code
 * can only be exchanged for an access token by the client that initiated the request.
 */
export type PKCE = {
  method: 'S256'
  verifier: string
  challenge: string
}

/**
 * Creates a new PKCE (Proof Key for Code Exchange) object, which includes a code verifier, code challenge, and state.
 * @returns A PKCE object containing the method, verifier, challenge, and state.
 */
export function createPkce(): PKCE {
  const verifier = createRandomString()
  const challenge = base64UrlEncode(createHash('sha256').update(verifier).digest())
  return {
    method: 'S256',
    verifier,
    challenge,
  }
}

/**
 * Hash a provided value to hexidecimal.
 * @param value - The value to hash.
 * @returns A hashed value from the provided value.
 */
export function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}
