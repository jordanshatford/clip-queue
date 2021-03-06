import { Client } from "tmi.js"

const OPTIONS = {
  options: {
    skipMembership: true,
    skipUpdatingEmotesets: true,
  },
  connection: {
    reconnect: true,
    secure: true,
  },
}

class TwitchChat extends Client {
  private username: string

  public constructor(username: string, accessToken: string) {
    super({
      ...OPTIONS,
      identity: {
        username: username,
        password: `oauth:${accessToken}`,
      },
      channels: [username],
    })

    this.username = username

    this.connect()
      .then(() => {
        console.debug(`Connected to channel ${username}.`)
      })
      .catch((e) => {
        console.error("Failed to connect to twitch chat.", e)
      })

    this.on("disconnected", () => {
      console.debug("Disconnected from twitch chat.")
    })
  }

  public async sendMessage(message: string) {
    if (this.username) {
      await this.say(this.username, message)
    }
  }
}

export default TwitchChat
