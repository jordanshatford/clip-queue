import { Client, type Options } from 'tmi.js'
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
  public constructor(ctx: TwitchUserCtx, options?: Options) {
    if (!ctx.username) {
      throw Error('No username specified in TwitchUserCtx')
    }
    super({
      ...{ ...DEFAULT_OPTIONS, ...options },
      identity: {
        username: ctx.username,
        password: `oauth:${ctx.token}`
      },
      channels: [ctx.username]
    })

    this.connect()
      .then(() => {
        console.info(`Connected to channel ${ctx.username}.`)
      })
      .catch((e) => {
        console.error('Failed to connect to twitch chat.', e)
      })

    this.on('disconnected', () => {
      console.info('Disconnected from twitch chat.')
    })
  }
}
