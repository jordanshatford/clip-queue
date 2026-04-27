import type { Ref } from 'vue'

/**
 * User details provided by an authentication integration.
 */
export interface UserDetails {
  /**
   * The ID of the user.
   */
  readonly id: string
  /**
   * The display name of the user.
   */
  name: string
  /**
   * The profile image URL of the user.
   */
  profileImageURL?: string
}

/**
 * Interface representing an authentication integration. Each authentication integration must implement
 * this interface to provide a consistent way to handle authentication across different providers.
 */
export interface IntegrationAuthentication {
  /**
   * The unique identifier for the authentication integration. This is used to identify the integration in the system and should be unique across all integrations.
   */
  readonly id: string
  /**
   * The display name of the authentication integration. This is used in the UI to represent the integration.
   */
  readonly name: string
  /**
   * The icon representing the authentication integration. This can be a URL to an image or an SVG string.
   */
  readonly icon: string
  /**
   * A boolean indicating whether the user is currently logged in with this integration.
   */
  readonly isLoggedIn?: Ref<boolean>
  /**
   * The user details.
   */
  readonly user?: Ref<UserDetails>
  /**
   * An authentication token provided by the integration.
   */
  readonly token?: Ref<string>
  /**
   * Redirects the user to the authentication page of the provider. This is typically called when the user initiates a login action.
   */
  redirect: () => Promise<void>
  /**
   * Attempts to automatically log in the user if possible. This can be used on app startup to check if the user has a valid session with the provider.
   * If auto login is successful, it returns the user details. If auto login fails (e.g. no valid session), it should return a rejected promise or throw an error.
   */
  autoLogin: () => Promise<UserDetails>
  /**
   * Logs in the user using the provided hash from the authentication redirect. This is typically called after the user is redirected back to the app from the provider's authentication page.
   * The hash parameter contains the authentication information returned by the provider, which can be used to retrieve user details and establish a session.
   */
  login: (hash: string) => Promise<UserDetails>
  /**
   * Logs out the user from the provider. This should clear any stored tokens or session information related to the provider.
   */
  logout: () => Promise<void>
}
