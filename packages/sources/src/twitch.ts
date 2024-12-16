import type { ChatUserstate } from '@cq/services/twitch'
import twitch, { TwitchChat } from '@cq/services/twitch'

import type { ClipSourceCtxCallback } from './types'
import { BaseClipSource, ClipSource, ClipSourceStatus } from './types'

export class TwitchChatSource extends BaseClipSource {
  public name = ClipSource.TWITCH_CHAT
  public svg = twitch.logo

  private chat?: TwitchChat
  private ctx: ClipSourceCtxCallback = () => ({ id: '' })

  public async connect(callback?: ClipSourceCtxCallback) {
    if (callback) {
      this.ctx = callback
    }
    try {
      this.chat = new TwitchChat(await this.ctx())
    } catch (e) {
      this.handleError(e)
      return
    }

    if (this.chat === undefined) {
      this.handleError('TwitchChat is not defined.')
      return
    }

    this.chat.on('connected', () => this.handleConnected())
    this.chat.on(
      'message',
      (_c: string, userstate: ChatUserstate, message: string, self: boolean) => {
        if (self || !userstate.username) {
          return
        }
        this.handleMessage({
          username: userstate.username,
          text: message,
          isAllowedCommands: twitch.isModerator(userstate)
        })
      }
    )
    this.chat.on('messagedeleted', (_c: string, username: string, message: string) =>
      this.handleMessageDeleted({ username, text: message })
    )
    this.chat.on('timeout', (_c, username) => this.handleTimeout(username))
    this.chat.on('ban', (_c, username) => this.handleTimeout(username))
    this.chat.on('disconnected', (reason) => this.handleDisconnected(reason))

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
      await this.chat?.disconnect()
    } catch (e) {
      this.handleError(e)
    }
  }
}
