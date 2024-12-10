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
  data: T
}

export interface ClipSourceMessage {
  username: string
  text: string
  urls: string[]
  isAllowedCommands?: boolean
}

export interface ClipSourceCtx {
  id: string
  token?: string
  username?: string
}

export type ClipSourceCtxCallback = () => ClipSourceCtx | Promise<ClipSourceCtx>

export abstract class BaseClipSource extends EventEmitter<{
  connected: (timestamp: ClipSourceEvent) => Promise<void> | void
  disconnected: (reason?: ClipSourceEvent<string>) => Promise<void> | void
  message: (message: ClipSourceEvent<ClipSourceMessage>) => Promise<void> | void
  'message-deleted': (message: ClipSourceEvent<ClipSourceMessage>) => Promise<void> | void
  'user-timeout': (username: ClipSourceEvent<string>) => Promise<void> | void
  error: (error: ClipSourceEvent<unknown>) => Promise<void> | void
}> {
  public abstract name: ClipSource
  public abstract svg: string

  public isExperimental = false

  public lastStatusTimestamp: string | undefined = undefined
  public status = ClipSourceStatus.UNKNOWN
  public statusMessage: string | undefined = undefined

  public abstract connect(): Promise<void>
  public abstract disconnect(): Promise<void>

  private timestamp() {
    return new Date().toISOString()
  }

  private updateStatus(status: ClipSourceStatus, message?: string, timestamp?: string) {
    this.lastStatusTimestamp = timestamp ?? this.timestamp()
    this.status = status
    this.statusMessage = message
  }

  protected ctx: ClipSourceCtxCallback = () => ({ id: '' })

  protected handleError(error: unknown) {
    const timestamp = this.timestamp()
    this.updateStatus(ClipSourceStatus.ERROR, String(error), timestamp)
    this.emit('error', {
      timestamp,
      data: error
    })
  }

  protected handleConnected() {
    const timestamp = this.timestamp()
    this.updateStatus(ClipSourceStatus.CONNECTED, 'Connected', timestamp)
    this.emit('connected', { timestamp, data: undefined })
  }

  protected handleDisconnected(reason: string) {
    const timestamp = this.timestamp()
    this.updateStatus(ClipSourceStatus.DISCONNECTED, 'Disconnected', timestamp)
    this.emit('disconnected', {
      timestamp,
      data: reason
    })
  }

  protected handleMessage(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.updateStatus(ClipSourceStatus.CONNECTED, 'Message', timestamp)
    this.emit('message', {
      timestamp,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text)
      }
    })
  }

  protected handleMessageDeleted(message: Omit<ClipSourceMessage, 'urls'>) {
    const timestamp = this.timestamp()
    this.updateStatus(ClipSourceStatus.CONNECTED, 'Message Deleted', timestamp)
    this.emit('message-deleted', {
      timestamp,
      data: {
        ...message,
        urls: getAllURLsFromText(message.text)
      }
    })
  }

  protected handleTimeout(username: string) {
    const timestamp = this.timestamp()
    this.updateStatus(ClipSourceStatus.CONNECTED, 'Timeout', timestamp)
    this.emit('user-timeout', {
      timestamp,
      data: username
    })
  }
}
