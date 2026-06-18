/**
 * Common user details for Oath validation endpoint.
 */
export type OAuthUser = {
  /**
   * The users ID.
   */
  id: string
  /**
   * The users display name.
   */
  name: string
  /**
   * A URL to the users profile image.
   */
  profileImageURL: string
}

/**
 * Common authentication details for Oath endpoint.
 */
export type OAuthAuthentication = {
  /**
   * The client ID for this application.
   */
  clientId: string
  /**
   * The access token for the currently logged in user.
   */
  accessToken: string
}

/**
 * Common response from our OAuth validation endpoint.
 */
export type OAuthResponse = {
  /**
   * The users details.
   */
  user: OAuthUser
  /**
   * The authentication details.
   */
  authentication: OAuthAuthentication
}
