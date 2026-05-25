import { Client } from '@tmi.js/chat'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

import type { IntegrationSource, IntegrationSourceEvents } from '../../core'

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
const reason = ref<string | undefined>(undefined)

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource
  extends EventEmitter<IntegrationSourceEvents>
  implements IntegrationSource
{
  public readonly id: IntegrationID = IntegrationID.TWITCH_CHAT
  public readonly name: string = 'Twitch Chat'

  public readonly features: IntegrationSourceFeature[] = [
    IntegrationSourceFeature.AUTOMOD,
    IntegrationSourceFeature.COMMANDS,
    IntegrationSourceFeature.LINK_DETECTION,
  ]

  public readonly isExperimental: boolean = false

  public get isLoading(): boolean {
    return isLoading.value
  }

  public get isEnabled(): boolean {
    return isEnabled.value
  }

  public set isEnabled(value: boolean) {
    // Ensure we update the state of the chat connection based on the change.
    // Specifically update the isEnabled value based on if we are connecting
    // or disconnecting in a different order to ensure connecting and disconnecting
    // works as intended.
    isLoading.value = true
    if (value && this.channel) {
      isEnabled.value = value
      this.connect(this.channel)
    } else {
      this.disconnect()
      isEnabled.value = value
    }
  }

  public get status(): IntegrationStatus {
    if (!this.isEnabled) {
      return IntegrationStatus.DISABLED
    }
    return status.value
  }

  public get reason(): string | undefined {
    return reason.value
  }

  private channel?: string
  private chat = new Client({ token: undefined, channels: [] })

  private timestamp(): string {
    return new Date().toISOString()
  }

  private handleStatusUpdate(s: IntegrationStatus, r?: string): void {
    status.value = s
    reason.value = r
  }

  private handleError(error: unknown): void {
    const reason = error as string
    isLoading.value = false
    this.emit('error', {
      timestamp: this.timestamp(),
      source: this.id,
      data: reason,
    })
    this.handleStatusUpdate(IntegrationStatus.ERROR, reason)
  }

  public constructor() {
    super()

    // Hook into chat events from tmi.js/chat that we require for our application.
    // Each event gets used and re-routed into the structure our sources use.
    this.chat.on('connect', async () => {
      // Whenever we connect to the source, automatically connect to the channel we want.
      // Until then assume connection is not fully completed.
      if (this.channel) {
        try {
          await this.chat.join(this.channel)
        } catch (e) {
          this.handleError(e)
        }
      }
    })
    this.chat.on('join', (event) => {
      // Joined the correct channel for this integration. At this point we are
      // fully connected to the source, so emit a connected event with details
      // about the channel we connected to.
      isLoading.value = false
      this.emit('connected', {
        timestamp: this.timestamp(),
        source: this.id,
        data: event.channel.login,
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })
    this.chat.on('message', (event) => {
      // Ignore any bot messages, we only care about real user messages.
      if (event.user.isBot) {
        return
      }
      // Emit the message in a unified format that we use for out sources.
      // This includes all details that are required for the application to
      // handle commands, URLs, etc.
      this.emit('message', {
        timestamp: this.timestamp(),
        source: this.id,
        data: {
          channel: event.channel.login,
          username: event.user.login,
          text: event.message.text,
          isAllowedCommands: event.user.isMod || event.user.isBroadcaster,
          urls: getAllURLsFromText(event.message.text),
        },
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })
    this.chat.on('moderation', (event) => {
      switch (event.type) {
        // If a message is deleted we want to provide that message incase
        // we should clean the queue of any items that were in that message.
        case 'deleteMessage': {
          this.emit('message-deleted', {
            timestamp: this.timestamp(),
            source: this.id,
            data: {
              channel: event.channel.login,
              username: event.user.login,
              text: event.message.text,
              urls: getAllURLsFromText(event.message.text),
            },
          })
          this.handleStatusUpdate(IntegrationStatus.HEALTHY)
          break
        }
        // If a user is banned or timed out we also want those details, so
        // we can remove all items that have been submitted by them.
        case 'ban':
        case 'timeout': {
          this.emit('moderation', {
            timestamp: this.timestamp(),
            source: this.id,
            data: {
              channel: event.channel.login,
              username: event.user.login,
            },
          })
          this.handleStatusUpdate(IntegrationStatus.HEALTHY)
          break
        }
        default: {
          break
        }
      }
    })
    this.chat.on('part', async (event) => {
      // This source relys on being connected to the channel. If we are disconnected, we
      // treat that as an error, and should provide those details to the user.
      await this.disconnect()
      this.handleStatusUpdate(IntegrationStatus.ERROR, `Left channel ${event.channel.login}.`)
    })
    this.chat.on('close', (event) => {
      // When the source is fully disconnected, we also want to display this to the
      // user and allow them to re-enable the source, or toggle it, to attempt to get
      // the connection working again.
      isLoading.value = false
      this.emit('disconnected', {
        timestamp: this.timestamp(),
        source: this.id,
        data: event.reason,
      })
      this.handleStatusUpdate(IntegrationStatus.ERROR, event.reason)
    })
  }

  public async connect(channel: string): Promise<void> {
    // When connecting always set the channel to ensure that the class has the value
    // configured by the user. If the source is disabled, do not actually connect it.
    this.channel = channel
    if (!this.isEnabled) {
      return
    }
    isLoading.value = true
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN, `Connecting to ${this.name}.`)
    try {
      this.chat.connect()
    } catch (e) {
      this.handleError(e)
    }
  }

  public async disconnect(): Promise<void> {
    // When the source is disabled, do nothing. We cannot disconnect it as it will have
    // never been properly connected.
    if (!this.isEnabled) {
      return
    }
    isLoading.value = true
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN, `Disconnected from ${this.name}.`)
    try {
      this.chat.close()
    } catch (e) {
      this.handleError(e)
    }
  }
}
