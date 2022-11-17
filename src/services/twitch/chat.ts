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
        console.info(`Connected to channel ${username}.`)
      })
      .catch((e) => {
        console.error("Failed to connect to twitch chat.", e)
      })

    this.on("disconnected", () => {
      console.info("Disconnected from twitch chat.")
    })
  }
}

export default TwitchChat
