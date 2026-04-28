import { Client } from '@tmi.js/chat'
import { ref } from 'vue'

import type { IntegrationSource, ClipSourceEventsMap } from '../common'

import { getAllURLsFromText } from '../common'
import { ClipSourceStatus, EventEmitter } from '../common/source'
import { IntegrationID } from '../indentify'

const status = ref<ClipSourceStatus>(ClipSourceStatus.UNKNOWN)

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
    return status.value
  }

  public set status(value: ClipSourceStatus) {
    status.value = value
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

  public constructor() {
    super()
    this.chat.on('connect', async () => {
      const timestamp = this.timestamp()
      this.emit('connected', { timestamp, source: this.id, data: undefined })
      this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
      if (this.channel) {
        try {
          await this.chat.join(this.channel)
        } catch (e) {
          this.handleError(e)
        }
      }
    })
    this.chat.on('join', (event) => {
      const timestamp = this.timestamp()
      this.emit('join', {
        timestamp,
        source: this.id,
        data: event.channel.login,
      })
      this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
    })
    this.chat.on('message', (event) => {
      if (event.user.isBot) {
        return
      }
      const timestamp = this.timestamp()
      this.emit('message', {
        timestamp,
        source: this.id,
        data: {
          channel: event.channel.login,
          username: event.user.login,
          text: event.message.text,
          isAllowedCommands: event.user.isMod || event.user.isBroadcaster,
          urls: getAllURLsFromText(event.message.text),
        },
      })
      this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
    })
    this.chat.on('moderation', (event) => {
      switch (event.type) {
        case 'deleteMessage': {
          const timestamp = this.timestamp()
          this.emit('message-deleted', {
            timestamp,
            source: this.id,
            data: {
              channel: event.channel.login,
              username: event.user.login,
              text: event.message.text,
              urls: getAllURLsFromText(event.message.text),
            },
          })
          this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
          break
        }
        case 'ban':
        case 'timeout': {
          const timestamp = this.timestamp()
          this.emit('moderation', {
            timestamp,
            source: this.id,
            data: {
              channel: event.channel.login,
              username: event.user.login,
            },
          })
          this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
          break
        }
        default: {
          break
        }
      }
    })
    this.chat.on('part', (event) => {
      const timestamp = this.timestamp()
      this.emit('leave', {
        timestamp,
        source: this.id,
        data: event.channel.login,
      })
      this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
    })
    this.chat.on('close', (event) => {
      const timestamp = this.timestamp()
      this.emit('disconnected', {
        timestamp,
        source: this.id,
        data: event.reason,
      })
      this.handleStatusUpdate(ClipSourceStatus.DISCONNECTED, timestamp)
    })
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
