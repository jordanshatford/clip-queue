/**
 * Common user details for Oath validation endpoint.
 */
export type OathUser = {
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
 * Common response from our OAuth validation endpoint.
 */
export type OathResponse = {
  /**
   * The users details.
   */
  user: OathUser
  authentication: {
    clientId: string
    accessToken: string
  }
}
