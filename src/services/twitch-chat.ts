import { Client, Userstate } from "tmi.js";
import config from "@/config";

const { options, connection } = config.Twitch.Chat;

let client: Client;

export default class TwitchChat {
  public static connect(username: string, accessToken: string): void {
    client = new Client({
      options,
      connection,
      identity: {
        username,
        password: `oauth:${accessToken}`,
      },
      channels: [username],
    });

    console.debug(`Connecting to twitch chat for channel ${username}.`);
    client
      .connect()
      .then(() => {
        console.debug("Connected.");
      })
      .catch((e) => {
        console.error("Failed to connect to twitch chat.", e);
      });

    client.on("disconnected", () => {
      console.debug("Disconnected from twitch chat.");
    });
    client.on("message", this.onMessage);
    client.on("messagedeleted", this.onMessageDeleted);
    client.on("timeout", this.onTimeout);
    client.on("ban", this.onBan);
  }

  public static async disconnect(): Promise<void> {
    await client?.disconnect();
  }

  private static onMessage(channel: string, userstate: Userstate, message: string, self: boolean) {
    console.debug("Message recieved: ", { channel, userstate, message, self });
  }

  private static onMessageDeleted(channel: string, username: string, deletedMessage: string) {
    console.debug("Message deleted: ", { channel, username, deletedMessage });
  }

  private static onTimeout(channel: string, username: string) {
    console.debug("Timeout: ", { channel, username });
  }

  private static onBan(channel: string, username: string) {
    console.debug("Ban: ", { channel, username });
  }
}
