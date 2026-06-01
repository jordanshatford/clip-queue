/**
 * Common response from our OAuth validation endpoint.
 */
export type OathResponse = {
  user: {
    id: string
    name: string
    profileImageURL: string
  }
  authentication: {
    clientId: string
    accessToken: string
  }
}
