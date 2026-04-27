import { Client } from '@tmi.js/chat'

import { logo } from '@/integrations/twitch/core/utils'

import { BaseClipSource, ClipSource, ClipSourceStatus } from './types'

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource extends BaseClipSource {
  public name = ClipSource.TWITCH
  public svg = logo

  private channel?: string
  private chat = new Client({ token: undefined, channels: [] })

  public constructor() {
    super()
    this.chat.on('connect', async () => {
      this.handleConnected()
      if (this.channel) {
        try {
          await this.chat.join(this.channel)
        } catch (e) {
          this.handleError(e)
        }
      }
    })
    this.chat.on('join', (event) => this.handleJoin(event.channel.login))
    this.chat.on('message', (event) => {
      if (event.user.isBot) {
        return
      }
      this.handleMessage({
        channel: event.channel.login,
        username: event.user.login,
        text: event.message.text,
        isAllowedCommands: event.user.isMod || event.user.isBroadcaster,
      })
    })
    this.chat.on('moderation', (event) => {
      switch (event.type) {
        case 'deleteMessage': {
          this.handleMessageDeleted({
            channel: event.channel.login,
            username: event.user.login,
            text: event.message.text,
          })
          break
        }
        case 'ban':
        case 'timeout': {
          this.handleModeration({
            channel: event.channel.login,
            username: event.user.login,
          })
          break
        }
        default: {
          break
        }
      }
    })
    this.chat.on('part', (event) => this.handleLeave(event.channel.login))
    this.chat.on('close', (event) => this.handleDisconnected(event.reason))
  }

  public async connect(channel: string) {
    this.handleStatusUpdate(ClipSourceStatus.UNKNOWN)
    try {
      this.channel = channel
      this.chat.connect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async disconnect() {
    if (this.status !== ClipSourceStatus.CONNECTED) {
      return
    }
    this.handleStatusUpdate(ClipSourceStatus.UNKNOWN)
    try {
      if (this.channel) {
        await this.chat.part(this.channel)
      }
      this.chat.close()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async reconnect() {
    this.handleStatusUpdate(ClipSourceStatus.UNKNOWN)
    try {
      await this.chat.reconnect()
    } catch (e) {
      this.handleError(e)
    }
  }
}
