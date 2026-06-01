/**
 * Integration IDs used to uniquely identify different integrations supported by the application.
 */
export enum IntegrationID {
  /**
   * Dailymotion videos provider.
   */
  DAILYMOTION = 'dailymotion',
  /**
   * Kick integration.
   */
  KICK = 'kick',
  /**
   * Kick authentication.
   */
  KICK_AUTH = 'kick-auth',
  /**
   * Kick chat source.
   */
  KICK_CHAT = 'kick-chat',
  /**
   * Kick clips provider.
   */
  KICK_CLIPS = 'kick-clips',
  /**
   * Kick VODs provider.
   */
  KICK_VODS = 'kick-videos',
  /**
   * Medal tv clips provider.
   */
  MEDAL = 'medal',
  /**
   * Integration containing miscellaneous providers.
   */
  MISCELLANEOUS = 'misc',
  /**
   * Rumble integration.
   */
  RUMBLE = 'rumble',
  /**
   * Rumble shorts provider.
   */
  RUMBLE_SHORTS = 'rumble-shorts',
  /**
   * Rumble videos provider.
   */
  RUMBLE_VIDEOS = 'rumble-videos',
  /**
   * Soop videos provider.
   */
  SOOP = 'soop',
  /**
   * Streamable videos provider.
   */
  STREAMABLE = 'streamable',
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
  TWITCH_VODS = 'ttv-videos',
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
  YOUTUBE_VIDEOS = 'yt-videos',
  /**
   * Unknown. This should never be used on purpose.
   */
  UNKNOWN = 'unknown',
  /**
   * Vimeo videos provider.
   */
  VIMEO = 'vimeo',
}
