import { EventEmitter } from './emitter'
import { getAllURLsFromText } from './utils'

/**
 * Enumeration of clip sources.
 */
export enum ClipSource {
  /**
   * The Clip Queue Web Application itself.
   */
  APPLICATION = 'Clip Queue Application',
  /**
   * The Twitch Chat.
   */
  TWITCH_CHAT = 'Twitch Chat'
}

/**
 * Enumeration of clip source statuses.
 */
export enum ClipSourceStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
  UNKNOWN = 'Unknown'
}

/**
 * Event emitted by a clip source.
 */
export interface ClipSourceEvent<T = undefined> {
  /**
   * The timestamp of the event.
   */
  timestamp: string
  /**
   * The source of the event.
   */
  source: ClipSource
  /**
   * The data of the event.
   */
  data: T
}

/**
 * Message from a clip source.
 */
export interface ClipSourceMessage {
  /**
   * The channel of the message.
   */
  channel: string
  /**
   * The username of the message sender.
   */
  username: string
  /**
   * The text of the message.
   */
  text: string
  /**
   * The URLs in the message.
   */
  urls: string[]
  /**
   * Whether the user is allowed to use commands.
   */
  isAllowedCommands?: boolean
}

/**
 * Moderation event from a clip source.
 */
export interface ClipSourceModeration {
  /**
   * The channel of the moderation event.
   */
  channel: string
  /**
   * The username of the the user that was moderated.
   */
  username: string
}

/**
 * Events emitted by a clip source.
 */
type ClipSourceEventsMap = {
  /**
   * Event emitted when the source is connected.
   * @param event - The event data.
   */
  connected: (event: ClipSourceEvent) => Promise<void> | void
  /**
   * Event emitted when the source is disconnected.
   * @param event.data - The reason for the disconnection.
   */
  disconnected: (event: ClipSourceEvent<string | undefined>) => Promise<void> | void
  /**
   * Event emitted when a channel is joined.
   * @param event.data - The channel that was joined.
   */
  join: (event: ClipSourceEvent<string>) => Promise<void> | void
  /**
   * Event emitted when a channel is left.
   * @param event.data - The channel that was left.
   */
  leave: (event: ClipSourceEvent<string>) => Promise<void> | void
  /**
   * Event emitted when a message is received.
   * @param event.data - The message that was received.
   */
  message: (event: ClipSourceEvent<ClipSourceMessage>) => Promise<void> | void
  /**
   * Event emitted when a message is deleted.
   * @param event.data - The message that was deleted.
   */
  'message-deleted': (event: ClipSourceEvent<ClipSourceMessage>) => Promise<void> | void
  /**
   * Event emitted when a user is timed out or banned.
   * @param event.data - The moderation event.
   */
  'user-timeout': (event: ClipSourceEvent<ClipSourceModeration>) => Promise<void> | void
  /**
   * Event emitted when the status of the source changes.
   * @param event.data - The new status of the source.
   */
  status: (event: ClipSourceEvent<ClipSourceStatus>) => Promise<void> | void
  /**
   * Event emitted when an error occurs.
   * @param event.data - The error that occurred.
   */
  error: (event: ClipSourceEvent<unknown>) => Promise<void> | void
}

/**
 * The base clip source.
 */
export type IBaseClipSource = {
  /**
   * The name of the source.
   */
  name: ClipSource
  /**
   * The SVG of the source.
   */
  svg: string
  /**
   * Whether the source is experimental.
   */
  isExperimental: boolean
  /**
   * The current status of the source.
   */
  status: ClipSourceStatus
  /**
   * Connect to the source.
   * @returns A promise that resolves when the source is connected.
   */
  connect: () => Promise<void>
  /**
   * Disconnect from the source.
   * @returns A promise that resolves when the source is disconnected.
   */
  disconnect: () => Promise<void>
  /**
   * Join a channel on the source.
   * @param channel - The channel to join.
   * @returns A promise that resolves when the channel is joined.
   */
  join: (channel: string) => Promise<void>
  /**
   * Leave a channel on the source.
   * @param channel - The channel to leave.
   * @returns A promise that resolves when the channel is left.
   */
  leave: (channel: string) => Promise<void>
} & Pick<EventEmitter<ClipSourceEventsMap>, 'on'>

export abstract class BaseClipSource
  extends EventEmitter<ClipSourceEventsMap>
  implements IBaseClipSource
{
  public abstract name: ClipSource
  public abstract svg: string

  public isExperimental = false
  public status = ClipSourceStatus.UNKNOWN

  public abstract connect(): Promise<void>
  public abstract disconnect(): Promise<void>
  public abstract join(channel: string): Promise<void>
  public abstract leave(channel: string): Promise<void>

  private timestamp() {
    return new Date().toISOString()
  }

  protected handleStatusUpdate(status: ClipSourceStatus, timestamp?: string) {
    this.status = status
    this.emit('status', {
      timestamp: timestamp ?? this.timestamp(),
      source: this.name,
      data: status
    })
  }

  protected handleError(error: unknown) {
    const timestamp = this.timestamp()
    this.emit('error', {
      timestamp,
      source: this.name,
      data: error
    })
    this.handleStatusUpdate(ClipSourceStatus.ERROR, timestamp)
  }

  protected handleConnected() {
    const timestamp = this.timestamp()
    this.emit('connected', { timestamp, source: this.name, data: undefined })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleDisconnected(reason: string) {
    const timestamp = this.timestamp()
    this.emit('disconnected', {
      timestamp,
      source: this.name,
      data: reason
    })
    this.handleStatusUpdate(ClipSourceStatus.DISCONNECTED, timestamp)
  }

  protected handleJoin(channel: string) {
    const timestamp = this.timestamp()
    this.emit('join', {
      timestamp,
      source: this.name,
      data: channel
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleLeave(channel: string) {
    const timestamp = this.timestamp()
    this.emit('leave', {
      timestamp,
      source: this.name,
      data: channel
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleMessage(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.emit('message', {
      timestamp,
      source: this.name,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text)
      }
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleMessageDeleted(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.emit('message-deleted', {
      timestamp,
      source: this.name,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text)
      }
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleModeration(moderation: ClipSourceModeration) {
    const timestamp = this.timestamp()
    this.emit('user-timeout', {
      timestamp,
      source: this.name,
      data: moderation
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }
}
