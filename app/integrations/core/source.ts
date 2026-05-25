import type { IntegrationID } from '../indentify'
import type { Awaitable, EventEmitter } from './event-emitter'
import type { IntegrationStatus } from './types'

/**
 * Enumeration representing the possible features a integration source can support.
 */
export enum IntegrationSourceFeature {
  /**
   * Has support for detecting moderation at the source and actioning it to the queue.
   */
  AUTOMOD = 'AutoModeration',
  /**
   * Has support for triggering commands.
   */
  COMMANDS = 'Commands',
  /**
   * Has support for detecting links submitted in the source and adding them to the queue.
   */
  LINK_DETECTION = 'LinkDetection',
}

/**
 * Generic event emitted by a source.
 */
export interface IntegrationSourceEvent<T = undefined> {
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
 * Message event emitted by a source.
 */
export type IntegrationSourceMessageEvent = IntegrationSourceEvent<{
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
}>

/**
 * Moderation event emitted by a source.
 */
export type IntegrationSourceModerationEvent = IntegrationSourceEvent<{
  /**
   * The channel of the moderation event.
   */
  channel: string
  /**
   * The username of the the user that was moderated.
   */
  username: string
}>

/**
 * Map of possible events from a source.
 */
export type IntegrationSourceEvents = {
  /**
   * Event emitted when the source is connected.
   * @param event.data - The channel connected to.
   */
  connected: [event: IntegrationSourceEvent<string>]
  /**
   * Event emitted when the source is disconnected.
   * @param event.data - The reason for the disconnection.
   */
  disconnected: [event: IntegrationSourceEvent<string | undefined>]
  /**
   * Event emitted when a message is received.
   * @param event.data - The message that was received.
   */
  message: [event: IntegrationSourceMessageEvent]
  /**
   * Event emitted when a message is deleted.
   * @param event.data - The message that was deleted.
   */
  'message-deleted': [event: IntegrationSourceMessageEvent]
  /**
   * Event emitted when a user is handled via moderation (timeout or ban).
   * @param event.data - The moderation event.
   */
  moderation: [event: IntegrationSourceModerationEvent]
  /**
   * Event emitted when an error occurs.
   * @param event.data - The error that occurred.
   */
  error: [event: IntegrationSourceEvent<string>]
}

/**
 * The interface of an integration that is a source of URLs. These integrations handle
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
   * List of features the source supports.
   */
  readonly features: IntegrationSourceFeature[]
  /**
   * Whether the source is experimental.
   * Experimental sources are sources that are not fully tested and may be unstable.
   */
  readonly isExperimental: boolean
  /**
   * Whether the source is actively busy loading.
   */
  readonly isLoading?: boolean
  /**
   * Whether the source is enabled.
   */
  isEnabled: boolean
  /**
   * The current status of the source.
   */
  readonly status: IntegrationStatus
  /**
   * Optional reason for the current status.
   */
  readonly reason?: string
  /**
   * Connect to the source.
   * @returns A promise that resolves when the source is connected.
   */
  connect: () => Awaitable<void>
  /**
   * Disconnect from the source.
   * @returns A promise that resolves when the source is disconnected.
   */
  disconnect: () => Awaitable<void>
} & Pick<EventEmitter<IntegrationSourceEvents>, 'on'>
