import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

import { Client, isSenderBot, isSenderModerator } from '#shared/kick'
import { EventEmitter } from '#shared/utils'

import type {
  IntegrationSource,
  IntegrationSourceEvents,
  IntegrationSourceMessageEvent,
} from '../core'

import {
  IntegrationSourceFeature,
  getAllURLsFromText,
  IntegrationStatus,
  toStorageKey,
} from '../core'
import { IntegrationID } from '../indentify'

const isEnabled = useStorage<boolean>(toStorageKey(IntegrationID.KICK_CHAT, 'enabled'), false)
const isLoading = ref<boolean>(false)
const status = ref<IntegrationStatus>(IntegrationStatus.DISABLED)

/**
 * A message cache for Kick deleted message handling.
 */
export class MessageCache<T> {
  private values: Map<string, T> = new Map<string, T>()
  private size: number

  public constructor(size: number = 1000) {
    this.size = size
  }

  /**
   * Get item from the cache. This assumes that once you get the value once it will
   * no longer be needed and can be removed completely.
   * @param key - The key in the cache.
   * @returns T if it exists, and removes T from the map.
   */
  public get(key: string): T | undefined {
    const entry = this.values.get(key)
    if (entry) {
      this.values.delete(key)
    }
    return entry
  }

  /**
   * Set a value in the cache. When the cache is full the oldest will be removed.
   * @param key - The key to use in the cache.
   * @param value - The value to set it to.
   */
  public set(key: string, value: T): void {
    if (this.values.size >= this.size) {
      const oldest = this.values.keys().next().value
      if (oldest) {
        this.values.delete(oldest)
      }
    }
    this.values.set(key, value)
  }
}

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

  private messageCache = new MessageCache<IntegrationSourceMessageEvent>()
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
      const message: IntegrationSourceMessageEvent = {
        timestamp: this.timestamp(),
        source: this.id,
        data: {
          channel: this.channel(),
          username: event.data.sender.username,
          text: event.data.content,
          isAllowedCommands: isSenderModerator(event.data.sender),
          urls: getAllURLsFromText(event.data.content),
        },
      }
      this.messageCache.set(event.data.id, message)
      this.emit('message', message)
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })

    this.chat.on('message-deleted', (event) => {
      const message = this.messageCache.get(event.data.message.id)
      if (message) {
        this.emit('message-deleted', message)
      }
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
