/**
 * Tracking of integration ID values. These are unique accross the application.
 */
export enum IntegrationID {
  /**
   * Kick integration.
   */
  KICK = 'kick',
  /**
   * Kick clips provider.
   */
  KICK_CLIPS = 'kick-clips',
  /**
   * Twitch integration.
   */
  TWITCH = 'twitch',
  /**
   * Twitch authentication.
   */
  TWITCH_AUTH = 'ttv-auth',
  /**
   * Twitch chat source.
   */
  TWITCH_CHAT = 'ttv-chat',
  /**
   * Twitch clips provider.
   */
  TWITCH_CLIPS = 'ttv-clips',
}
