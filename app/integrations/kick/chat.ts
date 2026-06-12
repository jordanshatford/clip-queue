import { Client, isSenderBot, isSenderModerator } from '#shared/kick'

import type { IntegrationSourceMessageEvent } from '../core'

import { getAllURLsFromText, IntegrationStatus, AbstractIntegrationSource } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Message cache for tracking 1000 Kick messages for when a delete event is triggered.
 * This is due to Kick API only providing the message ID of the deleted message rather
 * than the content.
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
export class KickChatSource extends AbstractIntegrationSource {
  private messageCache = new MessageCache<IntegrationSourceMessageEvent>()
  private channel: () => string
  private chat = new Client()

  public constructor(channel: () => string) {
    super(IntegrationID.KICK_CHAT, 'Kick Chat', false)
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
        } catch (error) {
          this.handleError(error)
        }
      }
    })
    this.chat.on('subscribe', () => {
      // Joined the correct channel for this integration. At this point we are
      // fully connected to the source, so emit a connected event with details
      // about the channel we connected to.
      this.state.isLoading = false
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
      this.state.isLoading = false
      this.emit('disconnected', {
        timestamp: this.timestamp(),
        source: this.id,
        data: event.reason,
      })
      this.handleStatusUpdate(IntegrationStatus.ERROR)
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

  protected override get isMisconfigured(): boolean {
    return !this.channel()
  }

  public async connect(): Promise<void> {
    // If the source is disabled, do not actually connect it.
    if (!this.isEnabled || this.status === IntegrationStatus.MISCONFIGURED) {
      return
    }
    this.state.isLoading = true
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      this.chat.connect()
    } catch (error) {
      this.handleError(error)
    }
  }

  public async disconnect(): Promise<void> {
    // When the source is disabled, do nothing. We cannot disconnect it as it will have
    // never been properly connected.
    if (!this.isEnabled) {
      return
    }
    this.state.isLoading = true
    this.handleStatusUpdate(IntegrationStatus.UNKNOWN)
    try {
      this.chat.close()
    } catch (error) {
      this.handleError(error)
    }
  }
}
