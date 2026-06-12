import type { RemovableRef } from '@vueuse/core'
import type { Reactive } from 'vue'

import { useStorage } from '@vueuse/core'

import { EventEmitter, type Awaitable } from '#shared/utils'

import type { IntegrationID } from '../indentify'

import { IntegrationStatus } from './types'
import { toStorageKey } from './utils'

/**
 * Enumeration representing the possible features a integration source can support.
 */
export enum IntegrationSourceFeature {
  /**
   * Has support for automatically connecting to the source when authenticated.
   */
  AUTO_CONNECT = 'AutoConnect',
  /**
   * Has support for detecting moderation at the source and actioning it to the queue.
   */
  AUTO_MODERATION = 'AutoModeration',
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
   * Whether the source is enabled.
   */
  isEnabled: boolean
  /**
   * Whether the source is actively busy loading.
   */
  readonly isLoading: boolean
  /**
   * The current status of the source.
   */
  readonly status: IntegrationStatus
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

/**
 * Abstract class for an integration source.
 */
export abstract class AbstractIntegrationSource
  extends EventEmitter<IntegrationSourceEvents>
  implements IntegrationSource
{
  protected constructor(
    /**
     * The ID of the integration provider.
     */
    public readonly id: IntegrationID,
    /**
     * The display name used by the application for the integration provider.
     */
    public readonly name: string,
    /**
     * The default value for if the integration provider isEnabled.
     */
    defaultIsEnabled: boolean,
  ) {
    super()
    this.state = reactive({
      status: IntegrationStatus.UNKNOWN,
      isLoading: false,
      isEnabled: useStorage<boolean>(toStorageKey(id, 'enabled'), defaultIsEnabled),
    })
  }

  protected state: Reactive<{
    status: IntegrationStatus
    isLoading: boolean
    isEnabled: RemovableRef<boolean>
  }>

  public readonly features: IntegrationSourceFeature[] = [
    IntegrationSourceFeature.AUTO_CONNECT,
    IntegrationSourceFeature.AUTO_MODERATION,
    IntegrationSourceFeature.COMMANDS,
    IntegrationSourceFeature.LINK_DETECTION,
  ]

  public get isEnabled(): boolean {
    return this.state.isEnabled
  }

  public set isEnabled(value: boolean) {
    // Ensure we update the state of the chat connection based on the change.
    // Specifically update the isEnabled value based on if we are connecting
    // or disconnecting in a different order to ensure connecting and disconnecting
    // works as intended.
    this.state.isLoading = true
    if (value) {
      this.state.isEnabled = value
      this.connect()
    } else {
      this.disconnect()
      this.state.isEnabled = value
    }
  }

  public get isLoading(): boolean {
    return this.state.isLoading
  }

  protected get isMisconfigured(): boolean {
    return false
  }

  public get status(): IntegrationStatus {
    if (!this.isEnabled) {
      return IntegrationStatus.DISABLED
    }
    if (this.isMisconfigured) {
      return IntegrationStatus.MISCONFIGURED
    }
    return this.state.status
  }

  protected timestamp(): string {
    return new Date().toISOString()
  }

  protected handleStatusUpdate(status: IntegrationStatus): void {
    this.state.status = status
  }

  protected handleError(error: unknown): void {
    const reason = error instanceof Error ? error.message : (error as string)
    this.state.isLoading = false
    this.emit('error', {
      timestamp: this.timestamp(),
      source: this.id,
      data: reason,
    })
    this.handleStatusUpdate(IntegrationStatus.ERROR)
  }

  public abstract connect(): Promise<void>
  public abstract disconnect(): Promise<void>
}
