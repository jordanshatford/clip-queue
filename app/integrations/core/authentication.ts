import type { Reactive } from 'vue'

import type { IntegrationID } from '../indentify'

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
  readonly name: string
  /**
   * The profile image URL of the user.
   */
  readonly profileImageURL?: string
}

/**
 * Authentication details provided by an authentication integration. This can include any additional information
 * needed to authenticate with the integration's API, such as access tokens or client IDs.
 */
export interface AuthenticationDetails {
  /**
   * The client ID for this application for the integration.
   */
  clientId: string
  /**
   * The access token for the user authenticated with the integration.
   */
  accessToken: string
}

/**
 * Details from an integration OAuth authentication.
 */
export interface OAuthDetails {
  /**
   * The user details for the integration authentication.
   */
  user: UserDetails
  /**
   * The authentication details for the integration.
   */
  authentication: AuthenticationDetails
}

export interface IntegrationAuthentication {
  /**
   * The ID of the integration authentication.
   */
  readonly id: IntegrationID
  /**
   * If the user is currently logged in to the integration.
   */
  readonly isLoggedIn: boolean
  /**
   * The user details.
   */
  readonly user: UserDetails
  /**
   * The users authentication details for the integration.
   */
  readonly details: AuthenticationDetails
  /**
   * Attempts to automatically log in the user if possible. This can be used on application startup to check if the user has a
   * valid session with the integration. If auto-login is successful, it returns the user details. If auto login fails it throws
   * an error to be handled by the caller.
   */
  autoLogin: () => Promise<void>
  /**
   * Redirects the user to the authentication page of the integration to allow logging in to our application.
   */
  login: () => Promise<void>
  /**
   * Logs out the user from the integration. This should clear any stored tokens or session information
   * related to the integration.
   */
  logout: () => Promise<void>
}

/**
 * Abstract class for authentication through an integration. Each authentication integration must implement
 * this interface to provide a consistent way to handle authentication across different integrations. The user
 * will be able to authentication with one (or many) of the available integration authentications.
 */
export abstract class AbstractIntegrationAuthentication implements IntegrationAuthentication {
  protected constructor(
    /**
     * The ID of the integration authentication.
     */
    public readonly id: IntegrationID,
    /**
     * The endpoint used to redirect to oath for the integrations authentication.
     */
    private readonly redirectUrl: string,
    /**
     * The endpoint used to validate and return the user and authentication details.
     */
    private readonly validateUrl: string,
    /**
     * The endpoint used to revoke authentication.
     */
    private readonly revokeUrl: string,
  ) {}

  private state: Reactive<{
    isLoggedIn: boolean
    user: UserDetails
    details: AuthenticationDetails
  }> = reactive({
    isLoggedIn: false,
    user: { id: '', name: '', profileImageURL: '' },
    details: { clientId: '', accessToken: '' },
  })

  public get isLoggedIn(): boolean {
    return this.state.isLoggedIn
  }

  public get user(): UserDetails {
    return this.state.user
  }

  public get details(): AuthenticationDetails {
    return this.state.details
  }

  public async autoLogin(): Promise<void> {
    const current = await $fetch<OAuthDetails>(this.validateUrl, {
      method: 'POST',
    })
    if (!current) {
      throw new Error(`[${this.id}]: No valid session found.`)
    }
    this.state.user = current.user
    this.state.details = current.authentication
    this.state.isLoggedIn = true
  }

  public async login(): Promise<void> {
    await navigateTo(this.redirectUrl, { external: true })
  }

  public async logout(): Promise<void> {
    this.state.isLoggedIn = false
    this.state.user = { id: '', name: '', profileImageURL: '' }
    this.state.details = { clientId: '', accessToken: '' }
    return await $fetch(this.revokeUrl, { method: 'POST' })
  }
}
