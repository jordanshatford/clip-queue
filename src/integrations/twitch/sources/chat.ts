import { Client } from '@tmi.js/chat'
import { ref } from 'vue'

import type { IntegrationSource, ClipSourceEventsMap } from '../../core'

import { ClipSourceFeature, getAllURLsFromText, EventEmitter, IntegrationStatus } from '../../core'
import { IntegrationID } from '../../indentify'

const status = ref<IntegrationStatus>(IntegrationStatus.DISABLED)

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource
  extends EventEmitter<ClipSourceEventsMap>
  implements IntegrationSource
{
  public readonly id: IntegrationID = IntegrationID.TWITCH_CHAT

  public get name(): string {
    return `twitch.tv/${this.channel}/chat`
  }

  public get url(): string {
    return `https://www.twitch.tv/${this.channel}/chat`
  }

  public readonly features: ClipSourceFeature[] = [
    ClipSourceFeature.AUTOMOD,
    ClipSourceFeature.COMMANDS,
    ClipSourceFeature.LINK_DETECTION,
  ]

  public readonly isExperimental: boolean = false

  public get status(): IntegrationStatus {
    return status.value
  }

  private channel?: string
  private chat = new Client({ token: undefined, channels: [] })

  private timestamp(): string {
    return new Date().toISOString()
  }

  protected handleStatusUpdate(s: IntegrationStatus, timestamp?: string): void {
    status.value = s
    this.emit('status', {
      timestamp: timestamp ?? this.timestamp(),
      source: this.id,
      data: s,
    })
  }

  protected handleError(error: unknown): void {
    const timestamp = this.timestamp()
    this.emit('error', {
      timestamp,
      source: this.id,
      data: error,
    })
    this.handleStatusUpdate(IntegrationStatus.ERROR, timestamp)
  }

  public constructor() {
    super()
    this.chat.on('connect', async () => {
      const timestamp = this.timestamp()
      this.emit('connected', { timestamp, source: this.id, data: undefined })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY, timestamp)
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
      this.handleStatusUpdate(IntegrationStatus.HEALTHY, timestamp)
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
      this.handleStatusUpdate(IntegrationStatus.HEALTHY, timestamp)
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
          this.handleStatusUpdate(IntegrationStatus.HEALTHY, timestamp)
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
          this.handleStatusUpdate(IntegrationStatus.HEALTHY, timestamp)
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
      this.handleStatusUpdate(IntegrationStatus.HEALTHY, timestamp)
    })
    this.chat.on('close', (event) => {
      const timestamp = this.timestamp()
      this.emit('disconnected', {
        timestamp,
        source: this.id,
        data: event.reason,
      })
      this.handleStatusUpdate(IntegrationStatus.ERROR, timestamp)
    })
  }

  public async connect(channel: string): Promise<void> {
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      this.channel = channel
      this.chat.connect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async disconnect(): Promise<void> {
    if (this.status !== IntegrationStatus.HEALTHY) {
      return
    }
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      if (this.channel) {
        await this.chat.part(this.channel)
      }
      this.chat.close()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async reconnect(): Promise<void> {
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      await this.chat.reconnect()
    } catch (e) {
      this.handleError(e)
    }
  }
}
