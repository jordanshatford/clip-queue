import { Client } from '@tmi.js/chat'
import { ref } from 'vue'

import type { ClipSourceMessage, ClipSourceModeration } from '@/integrations/common/source'

import { getAllURLsFromText } from '../common'
import {
  ClipSourceStatus,
  EventEmitter,
  type IntegrationSource,
  type ClipSourceEventsMap,
} from '../common/source'
import { IntegrationID } from '../indentify'

const _status = ref(ClipSourceStatus.UNKNOWN)

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource
  extends EventEmitter<ClipSourceEventsMap>
  implements IntegrationSource
{
  public id = IntegrationID.TWITCH_CHAT

  private channel?: string
  private chat = new Client({ token: undefined, channels: [] })

  public get name() {
    return `twitch.tv/${this.channel}/chat`
  }

  public get url() {
    return `https://www.twitch.tv/${this.channel}/chat`
  }

  public isExperimental = false
  public get status() {
    return _status.value
  }

  public set status(value: ClipSourceStatus) {
    _status.value = value
  }

  private timestamp() {
    return new Date().toISOString()
  }

  protected handleStatusUpdate(status: ClipSourceStatus, timestamp?: string) {
    this.status = status
    this.emit('status', {
      timestamp: timestamp ?? this.timestamp(),
      source: this.id,
      data: status,
    })
  }

  protected handleError(error: unknown) {
    const timestamp = this.timestamp()
    this.emit('error', {
      timestamp,
      source: this.id,
      data: error,
    })
    this.handleStatusUpdate(ClipSourceStatus.ERROR, timestamp)
  }

  protected handleConnected() {
    const timestamp = this.timestamp()
    this.emit('connected', { timestamp, source: this.id, data: undefined })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleDisconnected(reason: string) {
    const timestamp = this.timestamp()
    this.emit('disconnected', {
      timestamp,
      source: this.id,
      data: reason,
    })
    this.handleStatusUpdate(ClipSourceStatus.DISCONNECTED, timestamp)
  }

  protected handleJoin(channel: string) {
    const timestamp = this.timestamp()
    this.emit('join', {
      timestamp,
      source: this.id,
      data: channel,
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleLeave(channel: string) {
    const timestamp = this.timestamp()
    this.emit('leave', {
      timestamp,
      source: this.id,
      data: channel,
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleMessage(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.emit('message', {
      timestamp,
      source: this.id,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text),
      },
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleMessageDeleted(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.emit('message-deleted', {
      timestamp,
      source: this.id,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text),
      },
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleModeration(moderation: ClipSourceModeration) {
    const timestamp = this.timestamp()
    this.emit('moderation', {
      timestamp,
      source: this.id,
      data: moderation,
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

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
