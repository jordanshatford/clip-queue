import { Client } from '#shared/twitch'

import { getAllURLsFromText, IntegrationStatus, AbstractIntegrationSource } from '../core'
import { IntegrationID } from '../indentify'

/**
 * Twitch Chat Source.
 */
export class TwitchChatSource extends AbstractIntegrationSource {
  private channel: () => string
  private chat = new Client({ token: undefined, channels: [] })

  public constructor(channel: () => string) {
    super(IntegrationID.TWITCH_CHAT, 'Twitch Chat', true)
    this.channel = channel

    // Hook into chat events from tmi.js/chat that we require for our application.
    // Each event gets used and re-routed into the structure our sources use.
    this.chat.on('connect', async () => {
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
    this.chat.on('join', (event) => {
      // Joined the correct channel for this integration. At this point we are
      // fully connected to the source, so emit a connected event with details
      // about the channel we connected to.
      this.state.isLoading = false
      this.emit('connected', {
        timestamp: this.timestamp(),
        source: this.id,
        data: event.channel.login,
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })
    this.chat.on('message', (event) => {
      // Ignore any bot messages, we only care about real user messages.
      if (event.user.isBot) {
        return
      }
      // Emit the message in a unified format that we use for out sources.
      // This includes all details that are required for the application to
      // handle commands, URLs, etc.
      this.emit('message', {
        timestamp: this.timestamp(),
        source: this.id,
        data: {
          channel: event.channel.login,
          username: event.user.login,
          text: event.message.text,
          isAllowedCommands: event.user.isMod || event.user.isBroadcaster,
          urls: getAllURLsFromText(event.message.text),
        },
      })
      this.handleStatusUpdate(IntegrationStatus.HEALTHY)
    })
    this.chat.on('moderation', (event) => {
      switch (event.type) {
        // If a message is deleted we want to provide that message incase
        // we should clean the queue of any items that were in that message.
        case 'deleteMessage': {
          this.emit('message-deleted', {
            timestamp: this.timestamp(),
            source: this.id,
            data: {
              channel: event.channel.login,
              username: event.user.login,
              text: event.message.text,
              urls: getAllURLsFromText(event.message.text),
            },
          })
          this.handleStatusUpdate(IntegrationStatus.HEALTHY)
          break
        }
        // If a user is banned or timed out we also want those details, so
        // we can remove all items that have been submitted by them.
        case 'ban':
        case 'timeout': {
          this.emit('moderation', {
            timestamp: this.timestamp(),
            source: this.id,
            data: {
              channel: event.channel.login,
              username: event.user.login,
            },
          })
          this.handleStatusUpdate(IntegrationStatus.HEALTHY)
          break
        }
        default: {
          break
        }
      }
    })
    this.chat.on('part', async (_) => {
      // This source relys on being connected to the channel. If we are disconnected, we
      // treat that as an error, and should provide those details to the user.
      await this.disconnect()
      this.handleStatusUpdate(IntegrationStatus.ERROR)
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
