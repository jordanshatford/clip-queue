import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

import type { IntegrationSource, IntegrationSourceEvents } from '../core'

import {
  IntegrationSourceFeature,
  getAllURLsFromText,
  EventEmitter,
  IntegrationStatus,
  toStorageKey,
} from '../core'
import { IntegrationID } from '../indentify'
import { Client } from './core/pusher'
import { isSenderBot, isSenderModerator } from './core/utils'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.KICK_CHAT, 'enabled'), false)
const isLoading = ref<boolean>(false)
const status = ref<IntegrationStatus>(IntegrationStatus.DISABLED)

/**
 * Kick Chat Source.
 */
export class KickChatSource
  extends EventEmitter<IntegrationSourceEvents>
  implements IntegrationSource
{
  public readonly id: IntegrationID = IntegrationID.KICK_CHAT
  public readonly name: string = 'Kick Chat'

  public readonly features: IntegrationSourceFeature[] = [
    IntegrationSourceFeature.AUTO_CONNECT,
    IntegrationSourceFeature.AUTO_MODERATION,
    IntegrationSourceFeature.COMMANDS,
    IntegrationSourceFeature.LINK_DETECTION,
  ]

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
    if (value) {
      isEnabled.value = value
      this.connect()
    } else {
      this.disconnect()
      isEnabled.value = value
    }
  }

  public get status(): IntegrationStatus {
    if (!this.isEnabled) {
      return IntegrationStatus.DISABLED
    }
    if (!this.channel()) {
      return IntegrationStatus.MISCONFIGURED
    }
    return status.value
  }

  private channel: () => string
  private chat = new Client()

  private timestamp(): string {
    return new Date().toISOString()
  }

  private handleStatusUpdate(s: IntegrationStatus, _?: string): void {
    status.value = s
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

  public constructor(channel: () => string) {
    super()
    this.channel = channel

    // Hook into chat events from our Kick chat pusher implementation.
    // Each event gets used and re-routed into the structure our sources use.
    this.chat.on('connected', async () => {
      // Whenever we connect to the source, automatically connect to the channel we want.
      // Until then assume connection is not fully completed.
      const channel = this.channel()
      if (channel) {
        try {
          await this.chat.join(channel)
        } catch (e) {
          this.handleError(e)
        }
      }
    })
    this.chat.on('subscribe', () => {
      // Joined the correct channel for this integration. At this point we are
      // fully connected to the source, so emit a connected event with details
      // about the channel we connected to.
      isLoading.value = false
      this.emit('connected', {
        timestamp: this.timestamp(),
        source: this.id,
        data: this.channel(),
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })
    this.chat.on('message', (event) => {
      // Ignore any bot messages, we only care about real user messages.
      if (isSenderBot(event.data.sender)) {
        return
      }
      // Emit the message in a unified format that we use for out sources.
      // This includes all details that are required for the application to
      // handle commands, URLs, etc.
      this.emit('message', {
        timestamp: this.timestamp(),
        source: this.id,
        data: {
          channel: this.channel(),
          username: event.data.sender.username,
          text: event.data.content,
          isAllowedCommands: isSenderModerator(event.data.sender),
          urls: getAllURLsFromText(event.data.content),
        },
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })

    this.chat.on('message-deleted', (_event) => {
      // TODO(jordan): kick does not provide the original message. We may need to fetch it.
      //.              or cache it during runtime.
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })
    this.chat.on('user-banned', (event) => {
      // If a user is banned or timed out we also want those details, so
      // we can remove all items that have been submitted by them.
      this.emit('moderation', {
        timestamp: this.timestamp(),
        source: this.id,
        data: {
          channel: this.channel(),
          username: event.data.user.username,
        },
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
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
    this.chat.on('error', (event) => {
      // Error coming from underlying pusher or websocket.
      const error = typeof event === 'string' ? event : event.message
      this.emit('error', {
        timestamp: this.timestamp(),
        source: this.id,
        data: error,
      })
      this.handleError(error)
    })
  }

  public async connect(): Promise<void> {
    // If the source is disabled, do not actually connect it.
    if (!this.isEnabled || this.status === IntegrationStatus.MISCONFIGURED) {
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
