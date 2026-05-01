import type { IntegrationID } from '../indentify'
import type { IntegrationStatus } from './types'

/**
 * A simple event emitter.
 */
export class EventEmitter<
  Events extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => void | Promise<void>
  },
> {
  private listeners: Partial<Record<keyof Events, Array<Events[keyof Events]>>>

  public constructor() {
    this.listeners = {}
  }

  /**
   * Add a listener for an event.
   * @param event - The event to listen for.
   * @param listener - The listener for the event.
   * @returns This instance.
   */
  public on<E extends keyof Events>(event: E, listener: Events[E]): this {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
    return this
  }

  /**
   * Emit an event.
   * @param event - The event to emit.
   * @param args - The arguments to pass to the listeners.
   * @returns True if the event was emitted.
   */
  public emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean {
    const listeners = this.listeners[event]
    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => listener(...args))
      return true
    }
    return false
  }
}

/**
 * Enumeration representing the possible features a clip source can support.
 */
export enum ClipSourceFeature {
  AUTOMOD = 'AutoModeration',
  COMMANDS = 'Commands',
  CLIP_DETECTION = 'ClipDetection',
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
  source: IntegrationID
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
export type ClipSourceEventsMap = {
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
   * Event emitted when a user is handled via moderation (timeout or ban).
   * @param event.data - The moderation event.
   */
  moderation: (event: ClipSourceEvent<ClipSourceModeration>) => Promise<void> | void
  /**
   * Event emitted when the status of the source changes.
   * @param event.data - The new status of the source.
   */
  status: (event: ClipSourceEvent<IntegrationStatus>) => Promise<void> | void
  /**
   * Event emitted when an error occurs.
   * @param event.data - The error that occurred.
   */
  error: (event: ClipSourceEvent<unknown>) => Promise<void> | void
}

/**
 * The interface of an integration that is a source of clips. These integrations handle
 * connecting to external sources and detecting URLs submitted in them.
 */
export type IntegrationSource = {
  /**
   * Unique integration ID.
   */
  readonly id: IntegrationID
  /**
   * The display name of the source. This is used in the UI to represent the integration.
   */
  readonly name: string
  /**
   * The URL to the source.
   */
  readonly url?: string
  /**
   * List of features the clip source supports.
   */
  readonly features: ClipSourceFeature[]
  /**
   * Whether the source is experimental.
   * Experimental sources are sources that are not fully tested and may be unstable.
   */
  readonly isExperimental: boolean
  /**
   * The current status of the source.
   */
  readonly status: IntegrationStatus
  /**
   * Connect to a source with the provided channel.
   * @param channel - The channel to join.
   * @returns A promise that resolves when the source is connected.
   */
  connect: (channel: string) => Promise<void>
  /**
   * Disconnect from the source.
   * @returns A promise that resolves when the source is disconnected.
   */
  disconnect: () => Promise<void>
  /**
   * Reconnect the source.
   * @returns A promise that resolves when the source is reconnected.
   */
  reconnect: () => Promise<void>
} & Pick<EventEmitter<ClipSourceEventsMap>, 'on'>
