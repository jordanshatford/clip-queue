import twitch, { TwitchChat } from '@cq/services/twitch'

import { BaseClipSource, ClipSource, ClipSourceStatus } from './types'

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource extends BaseClipSource {
  public name = ClipSource.TWITCH_CHAT
  public svg = twitch.logo

  private chat = new TwitchChat()

  /**
   * Convert channel string to channel name.
   * @param channel - The channel string.
   * @returns The channel name.
   */
  private toChannel(channel: string) {
    // Remove initial # at start of the channel string.
    return channel.substring(1)
  }

  public constructor() {
    super()
    this.chat.on('connected', () => this.handleConnected())
    this.chat.on('join', (channel) => this.handleJoin(this.toChannel(channel)))
    this.chat.on('message', (channel, userstate, message, self) => {
      if (self || !userstate.username) {
        return
      }
      this.handleMessage({
        channel: this.toChannel(channel),
        username: userstate.username,
        text: message,
        isAllowedCommands: twitch.isModerator(userstate)
      })
    })
    this.chat.on('messagedeleted', (channel, username, message) =>
      this.handleMessageDeleted({ channel: this.toChannel(channel), username, text: message })
    )
    this.chat.on('timeout', (channel, username) =>
      this.handleModeration({ channel: this.toChannel(channel), username })
    )
    this.chat.on('ban', (channel, username) =>
      this.handleModeration({ channel: this.toChannel(channel), username })
    )
    this.chat.on('part', (channel) => this.handleLeave(this.toChannel(channel)))
    this.chat.on('disconnected', (reason) => this.handleDisconnected(reason))
  }

  public async connect() {
    try {
      await this.chat.connect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async disconnect() {
    if (this.status !== ClipSourceStatus.CONNECTED) {
      return
    }
    try {
      await this.chat.disconnect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async join(channel: string) {
    try {
      await this.chat.join(channel)
    } catch (e) {
      this.handleError(e)
    }
  }

  public async leave(channel: string) {
    try {
      await this.chat.part(channel)
    } catch (e) {
      this.handleError(e)
    }
  }
}
