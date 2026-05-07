import { Client } from '@tmi.js/chat'
import { useStorage } from '@vueuse/core'
import { ref, watch } from 'vue'

import type { IntegrationSource, ClipSourceEventsMap } from '../../core'

import {
  IntegrationSourceFeature,
  getAllURLsFromText,
  EventEmitter,
  IntegrationStatus,
  toStorageKey,
} from '../../core'
import { IntegrationID } from '../../indentify'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.TWITCH_CHAT, 'enabled'), true)
const isLoading = ref<boolean>(false)
const status = ref<IntegrationStatus>(IntegrationStatus.DISABLED)

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource
  extends EventEmitter<ClipSourceEventsMap>
  implements IntegrationSource
{
  public readonly id: IntegrationID = IntegrationID.TWITCH_CHAT
  public readonly name: string = 'Twitch Chat'
  public readonly isExperimental: boolean = false

  public get isLoading(): boolean {
    return isLoading.value
  }

  public get url(): string {
    return `twitch.tv/${this.channel}/chat`
  }

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    isEnabled.value = value
  }

  public readonly features: IntegrationSourceFeature[] = [
    IntegrationSourceFeature.AUTOMOD,
    IntegrationSourceFeature.COMMANDS,
    IntegrationSourceFeature.LINK_DETECTION,
  ]

  public get status(): IntegrationStatus {
    if (!isEnabled.value) {
      return IntegrationStatus.DISABLED
    }
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
    // Watch for changes to the enabled status.
    watch(isEnabled, async (enabled) => {
      isLoading.value = true
      if (enabled && this.channel) {
        await this.connect(this.channel)
      } else {
        await this.disconnect()
      }
    })

    this.chat.on('connect', async () => {
      isLoading.value = false
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
      isLoading.value = false
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
    this.channel = channel
    if (!isEnabled.value) {
      return
    }
    try {
      this.chat.connect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async disconnect(): Promise<void> {
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
      if (!isEnabled.value) {
        return
      }
      await this.chat.reconnect()
    } catch (e) {
      this.handleError(e)
    }
  }
}
