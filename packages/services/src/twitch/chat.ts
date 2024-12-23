import type { Options } from 'tmi.js'
import { Client } from 'tmi.js'

/**
 * The default options for the Twitch chat client.
 */
const DEFAULT_OPTIONS: Options = {
  options: {
    skipMembership: true,
    skipUpdatingEmotesets: true
  },
  connection: {
    reconnect: true,
    secure: true
  }
}

/**
 * A Twitch chat client.
 */
export default class TwitchChat extends Client {
  public constructor(options?: Partial<Options>) {
    super({
      ...DEFAULT_OPTIONS,
      ...options
    })
  }
}
