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
 * needed to authenticate with the provider's API, such as access tokens or client IDs.
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
 * Abstract class for authentication through an integration. Each authentication integration must implement
 * this interface to provide a consistent way to handle authentication across different integrations. The user
 * will be able to authentication with one (or many) of the available integration authentications.
 */
export abstract class AbstractIntegrationAuthentication {
  protected constructor(
    /**
     * The ID of the integration provider.
     */
    public readonly id: IntegrationID,
  ) {}
  protected _isLoggedIn: boolean = false
  /**
   * If the user is currently logged in to the integration.
   */
  public get isLoggedIn(): boolean {
    return this._isLoggedIn
  }
  protected _user: UserDetails = { id: '', name: '', profileImageURL: '' }
  /**
   * The user details.
   */
  public get user(): UserDetails {
    return this._user
  }
  protected _details: AuthenticationDetails = { clientId: '', accessToken: '' }
  /**
   * The users authentication details for the integration.
   */
  public get details(): AuthenticationDetails {
    return this._details
  }
  /**
   * Reset details back to the original values.
   */
  protected reset(): void {
    this._isLoggedIn = false
    this._user = { id: '', name: '', profileImageURL: '' }
    this._details = { clientId: '', accessToken: '' }
  }
  /**
   * Attempts to automatically log in the user if possible. This can be used on application startup to check if the user has a
   * valid session with the provider. If auto-login is successful, it returns the user details. If auto login fails it throws
   * an error to be handled by the caller.
   */
  public abstract autoLogin(): Promise<void>
  /**
   * Redirects the user to the authentication page of the integration to allow logging in to our application.
   */
  public abstract login(): Promise<void>
  /**
   * Logs out the user from the provider. This should clear any stored tokens or session information related to the provider.
   */
  public abstract logout(): Promise<void>
}
