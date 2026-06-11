import { KickAPI } from '#shared/kick'
import { EventEmitter } from '#shared/utils'

import { sleep } from './utils'

/**
 * Kick chat badge details.
 */
export type KickChatBadge = {
  /**
   * The type of badge.
   */
  type: 'broadcaster' | 'moderator' | 'bot' | (string & {})
  /**
   * The text for the badge.
   */
  text: string
  /**
   * Count related to the badge. Relevant for things like subscriber badges.
   */
  count?: number
}

/**
 * Kick chat user.
 */
export interface KickChatUser {
  /**
   * ID of the user.
   */
  id: number
  /**
   * Username of the user.
   */
  username: string
  /**
   * Slug of the user.
   */
  slug: string
}

/**
 * Kick chat message sender.
 */
export interface KickChatSender extends KickChatUser {
  /**
   * Identity of the Kick chat sender.
   */
  identity: {
    /**
     * Chat color the sender is using.
     */
    color: string
    /**
     * Kick chat badges the sender has.
     */
    badges: KickChatBadge[]
  }
}

/**
 * Kick chat message.
 */
export type KickChatMessage = {
  /**
   * ID of the message.
   */
  id: string
  /**
   * Chatroom ID of the message.
   */
  chatroom_id: number
  /**
   * Content of the message.
   */
  content: string
  /**
   * Type of the message.
   */
  type: string
  /**
   * Timestamp when the message was created at.
   */
  created_at: string
  /**
   * Sender of the message.
   */
  sender: KickChatSender
  /**
   * Metadata for the message.
   */
  metadata: {
    /**
     * Message reference.
     */
    message_ref: number
  }
}

/**
 * Kick chat message deleted.
 */
export type KickChatMessageDeleted = {
  /**
   * ID for the delete message.
   */
  id: string
  /**
   * Message details for the deleted message.
   */
  message: {
    /**
     * ID of the message that was deleted.
     */
    id: string
  }
  /**
   * If the event was AI moderated.
   */
  aiModerated: boolean
  /**
   * Rules violated to cause the deletion.
   */
  violatedRules: unknown[]
}

/**
 * Base moderation details for Kick ban and timeout.
 */
type KickChatModerationBase = {
  /**
   * The ID of the moderation.
   */
  id: string
  /**
   * The user being moderated.
   */
  user: KickChatUser
  /**
   * The user who actioned the moderation.
   */
  banned_by: KickChatUser
}

/**
 * Kick ban.
 */
export type KickChatBan = KickChatModerationBase & {
  /**
   * The fact that the moderation is permanent.
   */
  permanent: true
}

/**
 * Kick timeout.
 */
export type KickChatTimeout = KickChatModerationBase & {
  /**
   * The fact that the moderation is NOT permanent.
   */
  permanent: false
  /**
   * The duration of the timeout.
   */
  duration: number
  /**
   * Timestamp for when the timeout expires.
   */
  expires_at: string
}

/**
 * Generic pusher event.
 */
type PusherEvent<TEvent extends string, TData> = {
  /**
   * The name of the event.
   */
  event: TEvent
  /**
   * The channel the event was on.
   */
  channel: string
  /**
   * The data in the event.
   */
  data: TData
}

/**
 * Enum representing the Pusher events we are expection and want to handle.
 */
export enum KickPusherEventType {
  ERROR = 'pusher:error',
  CONNECTED = 'pusher:connection_established',
  SUBSCRIBED = 'pusher_internal:subscription_succeeded',
  MESSAGE = 'App\\Events\\ChatMessageEvent',
  MESSAGE_DELETED = 'App\\Events\\MessageDeletedEvent',
  USER_BANNED = 'App\\Events\\UserBannedEvent',
}

/**
 * Type representing events that Kick pusher uses and are relevant to our application.
 * This is not a full list as certain events we do not care about for our use case.
 */
export type KickPusherEvent =
  | {
      event: KickPusherEventType.ERROR
      message: string
      code?: number
    }
  | Omit<
      PusherEvent<
        KickPusherEventType.CONNECTED,
        {
          socket_id: string
          activity_timeout: number
        }
      >,
      'channel'
    >
  | PusherEvent<KickPusherEventType.SUBSCRIBED, object>
  | PusherEvent<KickPusherEventType.MESSAGE, KickChatMessage>
  | PusherEvent<KickPusherEventType.MESSAGE_DELETED, KickChatMessageDeleted>
  | PusherEvent<KickPusherEventType.USER_BANNED, KickChatBan | KickChatTimeout>

/**
 * WebSocket secure URL for Kick pusher.
 */
export const WSS_URL =
  'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false'

/**
 * Helper to extract type based on event type.
 */
type ExtractEvent<TEvent extends string> = Extract<KickPusherEvent, { event: TEvent }>

/**
 * Event map of events that the Kick chat client can emit.
 */
export type ClientEvents = {
  open: [event: Event]
  error: [reason: string | ExtractEvent<KickPusherEventType.ERROR>]
  connected: [event: ExtractEvent<KickPusherEventType.CONNECTED>]
  subscribe: [event: ExtractEvent<KickPusherEventType.SUBSCRIBED>]
  close: [event: CloseEvent]
  message: [event: ExtractEvent<KickPusherEventType.MESSAGE>]
  'message-deleted': [event: ExtractEvent<KickPusherEventType.MESSAGE_DELETED>]
  'user-banned': [event: ExtractEvent<KickPusherEventType.USER_BANNED>]
  log: [message: string]
}
/**
 * Options used to configure the client.
 */
export interface ClientOptions {
  /**
   * Authentication to use when subscribing to a channel.
   */
  authentication?: string
  /**
   * Emit debug details from the client.
   */
  debug?: boolean
  /**
   * Delay when attempting to reconnect the client.
   */
  reconnectDelay?: number
}

/**
 * Kick chat client using internal pusher API.
 */
export class Client extends EventEmitter<ClientEvents> {
  private readonly api: KickAPI = new KickAPI()
  /**
   * WebSocket used to interact with the Pusher endpoint.
   */
  private socket?: WebSocket
  /**
   * Boolean representing if close was requested. Otherwise we try
   * to reconnect on failure or closure.
   */
  private closed: boolean = false
  /**
   * Set of chatroom IDs we are connected to.
   */
  private readonly channels: Set<number> = new Set()

  private readonly authentication: string
  private readonly debug: boolean
  private readonly reconnectDelay: number

  public constructor({
    authentication = '',
    debug = false,
    reconnectDelay = 1_000,
  }: ClientOptions = {}) {
    super()
    this.authentication = authentication
    this.debug = debug
    this.reconnectDelay = reconnectDelay
  }

  /**
   * Connect to Kick chat.
   */
  public async connect(): Promise<void> {
    this.closed = false
    await this.open()
    for (const id of this.channels) {
      this.subscribe(id)
    }
  }

  /**
   * Join a Kick chat channel.
   * @param channel - The name of the Kick channel.
   */
  public async join(channel: string): Promise<void> {
    const chnl = await this.api.getChannel(channel)
    const id = chnl.chatroom.id

    // Prevent duplicate joining of chatrooms.
    if (this.channels.has(id)) {
      return
    }

    this.subscribe(id)
    this.channels.add(id)
    this.log(`Joined channel ${channel}`)
  }

  public close(): void {
    this.closed = true
    this.socket?.close()
  }

  private async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(WSS_URL)
      // Websocket has opened successfully, emit to parent and resolve the open promise.
      socket.onopen = (event: Event): void => {
        this.socket = socket
        this.log('WebSocket opened.')
        this.emit('open', event)
        resolve()
      }
      // Websocket error occured, emit to parent and reject the open promise.
      socket.onerror = (event: Event): void => {
        this.log(`Error ${event.type}.`)
        this.emit('error', `WebSocket error ${event.type}.`)
        reject()
      }
      // Handle messages coming from the websocket.
      socket.onmessage = (event: MessageEvent<unknown>): void => {
        this.log(`Message event: ${event.data}`)
        // Parse the event into what Kick provides to us.
        const parsed = this.parseMessage(event.data)
        this.log(`Message parsed: ${JSON.stringify(parsed, null, 2)}`)
        if (!parsed) {
          return
        }
        // Handle each event we care about respectively.
        switch (parsed.event) {
          case 'App\\Events\\ChatMessageEvent': {
            this.emit('message', parsed)
            break
          }
          case 'App\\Events\\MessageDeletedEvent': {
            this.emit('message-deleted', parsed)
            break
          }
          case 'App\\Events\\UserBannedEvent': {
            this.emit('user-banned', parsed)
            break
          }
          case 'pusher:connection_established': {
            this.emit('connected', parsed)
            break
          }
          case 'pusher_internal:subscription_succeeded': {
            this.emit('subscribe', parsed)
            break
          }
          case 'pusher:error': {
            this.emit('error', parsed)
            break
          }
          default: {
            return
          }
        }
      }
      // Socket has closed, attempt to reconnect it unless we purposely have closed it.
      socket.onclose = (event: CloseEvent): void => {
        this.log('Socket closed.')
        this.emit('close', event)
        if (!this.closed) {
          this.reconnect()
        }
      }
    })
  }

  /**
   * Attempt to reconnect to Kick pusher endpoint and channels.
   */
  private async reconnect(): Promise<void> {
    this.log('Reconnecting...')
    await sleep(this.reconnectDelay)
    try {
      await this.open()
      for (const id of this.channels) {
        this.subscribe(id)
      }
      this.log('Reconnected.')
    } catch {
      await this.reconnect()
    }
  }

  /**
   * Send request to subscribe to a channels chatroom.
   * @param id - The ID of the channels chatroom.
   */
  private subscribe(id: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected')
    }
    const data = {
      event: 'pusher:subscribe',
      data: {
        channel: `chatrooms.${id}.v2`,
        auth: this.authentication,
      },
    }
    this.socket.send(JSON.stringify(data))
  }

  /**
   * Parse websocket message into a Kick pusher event.
   * @param data - The unknown message data from the websocket.
   * @returns A KickPusherEvent if parsing is successful, null otherwise.
   */
  private parseMessage(data: unknown): KickPusherEvent | null {
    try {
      if (typeof data !== 'string') {
        return null
      }

      const event = JSON.parse(data) as KickPusherEvent
      // Parse double-encoded data in the event if required.
      if ('data' in event && typeof event.data === 'string') {
        try {
          event.data = JSON.parse(event.data)
        } catch {
          // Ignore issues parsing the nested JSON.
        }
      }
      return event
    } catch {
      return null
    }
  }

  /**
   * Emit debug logs when debugging is enabled.
   * @param message - The message to log.
   */
  private log(message: string): void {
    if (this.debug) {
      this.emit('log', message)
    }
  }
}
