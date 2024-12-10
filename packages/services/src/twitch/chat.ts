import type { Options } from 'tmi.js'
import { Client } from 'tmi.js'

import type { TwitchUserCtx } from './types'

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
  public constructor(ctx: TwitchUserCtx, options?: Partial<Options>) {
    if (!ctx.username) {
      throw Error('No username specified in TwitchUserCtx')
    }
    super({
      ...DEFAULT_OPTIONS,
      ...options,
      identity: {
        username: ctx.username,
        password: `oauth:${ctx.token}`
      },
      channels: [ctx.username]
    })
  }
}
