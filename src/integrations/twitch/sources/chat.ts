import { Client } from '@tmi.js/chat'
import { ref } from 'vue'

import { getAllURLsFromText } from '../../common'
import {
  type IntegrationSource,
  type ClipSourceEventsMap,
  ClipSourceFeature,
} from '../../common/source'
import { EventEmitter } from '../../common/source'
import { IntegrationStatus } from '../../common/types'
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

  public get name() {
    return `twitch.tv/${this.channel}/chat`
  }

  public get url() {
    return `https://www.twitch.tv/${this.channel}/chat`
  }

  public readonly features: ClipSourceFeature[] = [
    ClipSourceFeature.AUTOMOD,
    ClipSourceFeature.COMMANDS,
    ClipSourceFeature.CLIP_DETECTION,
  ]

  public readonly isExperimental: boolean = false

  public get status(): IntegrationStatus {
    return status.value
  }

  private channel?: string
  private chat = new Client({ token: undefined, channels: [] })

  private timestamp() {
    return new Date().toISOString()
  }

  protected handleStatusUpdate(s: IntegrationStatus, timestamp?: string) {
    status.value = s
    this.emit('status', {
      timestamp: timestamp ?? this.timestamp(),
      source: this.id,
      data: s,
    })
  }

  protected handleError(error: unknown) {
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

  public async connect(channel: string) {
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      this.channel = channel
      this.chat.connect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async disconnect() {
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

  public async reconnect() {
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      await this.chat.reconnect()
    } catch (e) {
      this.handleError(e)
    }
  }
}
