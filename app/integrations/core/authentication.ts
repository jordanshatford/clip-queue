import type { Reactive } from 'vue'

import type { OAuthAuthentication, OAuthResponse, OAuthUser } from '#shared/utils'

import type { IntegrationID } from '../indentify'

/**
 * Interface for an integrations authentication.
 */
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
  readonly user: OAuthUser
  /**
   * The users authentication details for the integration.
   */
  readonly details: OAuthAuthentication
  /**
   * Attempts to automatically log in the user if possible. This can be used on application startup to check if the user has a
   * valid session with the integration. If auto-login is successful, it returns the user details. If auto login fails it throws
   * an error to be handled by the caller.
   */
  autoLogin(): Promise<void>
  /**
   * Redirects the user to the authentication page of the integration to allow logging in to our application.
   */
  login(): Promise<void>
  /**
   * Logs out the user from the integration. This should clear any stored tokens or session information
   * related to the integration.
   */
  logout(): Promise<void>
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
  ) {
    this.state = reactive({
      isLoggedIn: false,
      user: { id: '', name: '', profileImageURL: '' },
      details: { clientId: '', accessToken: '' },
    })
  }

  private state: Reactive<{
    isLoggedIn: boolean
    user: OAuthUser
    details: OAuthAuthentication
  }>

  public get isLoggedIn(): boolean {
    return this.state.isLoggedIn
  }

  public get user(): OAuthUser {
    return this.state.user
  }

  public get details(): OAuthAuthentication {
    return this.state.details
  }

  public async autoLogin(): Promise<void> {
    const current = await $fetch<OAuthResponse>(this.validateUrl, {
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
