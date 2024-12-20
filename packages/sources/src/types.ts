import { EventEmitter } from './emitter'
import { getAllURLsFromText } from './utils'

export enum ClipSource {
  TWITCH_CHAT = 'Twitch Chat'
}

export enum ClipSourceStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
  UNKNOWN = 'Unknown'
}

export interface ClipSourceEvent<T = undefined> {
  timestamp: string
  source: ClipSource
  channel: string
  data: T
}

export interface ClipSourceMessage {
  username: string
  text: string
  urls: string[]
  isAllowedCommands?: boolean
}

type ClipSourceEventsMap = {
  connected: (timestamp: ClipSourceEvent) => Promise<void> | void
  disconnected: (reason: ClipSourceEvent<string | undefined>) => Promise<void> | void
  message: (message: ClipSourceEvent<ClipSourceMessage>) => Promise<void> | void
  'message-deleted': (message: ClipSourceEvent<ClipSourceMessage>) => Promise<void> | void
  'user-timeout': (username: ClipSourceEvent<string>) => Promise<void> | void
  error: (error: ClipSourceEvent<unknown>) => Promise<void> | void
  status: (status: ClipSourceEvent<ClipSourceStatus>) => Promise<void> | void
}

export type IBaseClipSource = {
  name: ClipSource
  svg: string
  isExperimental: boolean
  status: ClipSourceStatus
  connect: (channel: string) => Promise<void>
  disconnect: (channel?: string) => Promise<void>
} & Pick<EventEmitter<ClipSourceEventsMap>, 'on'>

export abstract class BaseClipSource
  extends EventEmitter<ClipSourceEventsMap>
  implements IBaseClipSource
{
  public abstract name: ClipSource
  public abstract svg: string

  public isExperimental = false

  public status = ClipSourceStatus.UNKNOWN

  protected channel = 'unknown'

  public abstract connect(channel: string): Promise<void>
  public abstract disconnect(channel?: string): Promise<void>

  private timestamp() {
    return new Date().toISOString()
  }

  private handleStatusUpdate(status: ClipSourceStatus, timestamp?: string) {
    this.status = status
    this.emit('status', {
      timestamp: timestamp ?? this.timestamp(),
      source: this.name,
      channel: this.channel,
      data: status
    })
  }

  protected handleError(error: unknown) {
    const timestamp = this.timestamp()
    this.emit('error', {
      timestamp,
      source: this.name,
      channel: this.channel,
      data: error
    })
    this.handleStatusUpdate(ClipSourceStatus.ERROR, timestamp)
  }

  protected handleConnected() {
    const timestamp = this.timestamp()
    this.emit('connected', { timestamp, source: this.name, channel: this.channel, data: undefined })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleDisconnected(reason: string) {
    const timestamp = this.timestamp()
    this.emit('disconnected', {
      timestamp,
      source: this.name,
      channel: this.channel,
      data: reason
    })
    this.handleStatusUpdate(ClipSourceStatus.DISCONNECTED, timestamp)
  }

  protected handleMessage(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.emit('message', {
      timestamp,
      source: this.name,
      channel: this.channel,
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
      channel: this.channel,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text)
      }
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }

  protected handleTimeout(username: string) {
    const timestamp = this.timestamp()
    this.emit('user-timeout', {
      timestamp,
      source: this.name,
      channel: this.channel,
      data: username
    })
    this.handleStatusUpdate(ClipSourceStatus.CONNECTED, timestamp)
  }
}
