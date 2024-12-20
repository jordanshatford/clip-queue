import type { Options } from 'tmi.js'
import { Client } from 'tmi.js'

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

export default class TwitchChat extends Client {
  public constructor(options?: Partial<Options>) {
    super({
      ...DEFAULT_OPTIONS,
      ...options
    })
  }
}
