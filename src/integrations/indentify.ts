/**
 * Integration IDs used to uniquely identify different integrations supported by the application.
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
   * Kick VODs provider.
   */
  KICK_VODS = 'kick-vods',
  /**
   * Integration containing miscellaneous providers.
   */
  MISCELLANEOUS = 'misc',
  /**
   * Soop videos provider.
   */
  SOOP = 'soop',
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
  /**
   * Twitch VODs provider.
   */
  TWITCH_VODS = 'ttv-vods',
  /**
   * YouTube integration.
   */
  YOUTUBE = 'youtube',
  /**
   * YouTube shorts provider.
   */
  YOUTUBE_SHORTS = 'yt-shorts',
  /**
   * YouTube videos provider.
   */
  YOUTUBE_VIDEOS = 'yt-vids',
  /**
   * Unknown. This should never be used on purpose.
   */
  UNKNOWN = 'unknown',
  /**
   * Vimeo videos provider.
   */
  VIMEO = 'vimeo',
}
