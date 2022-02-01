import { Client, Userstate } from "tmi.js";
import config from "@/assets/config";
import ClipFinder from "@/services/clip-finder";
import { getUrlFromMessage } from "@/utils/url";
import { clips } from "@/stores/clips";
import { userStore } from "@/stores/user";
import { commands } from "@/utils/commands";

const { options, connection } = config.Twitch.Chat;
const { commandPrefix, openMessage, closeMessage } = config.App.Queue;

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
        this.sendMessage(openMessage);
      })
      .catch((e) => {
        console.error("Failed to connect to twitch chat.", e);
      });

    client.on("disconnected", () => {
      console.debug("Disconnected from twitch chat.");
      this.sendMessage(closeMessage);
    });
    client.on("message", this.onMessage);
    client.on("messagedeleted", this.onMessageDeleted);
    client.on("timeout", this.onTimeout);
    client.on("ban", this.onTimeout);
  }

  public static async disconnect(): Promise<void> {
    await client?.disconnect();
  }

  public static async sendMessage(message: string): Promise<void> {
    if (userStore?.user?.username) {
      await client?.say(userStore.user.username, message);
    }
  }

  private static onMessage(channel: string, userstate: Userstate, message: string, self: boolean) {
    if (self) {
      return;
    }

    // Check if message is a command and perform command if proper permission to do so
    if (message.startsWith(commandPrefix)) {
      const isMod = userstate.mod;
      const isBroadcaster = userstate.badges?.["broadcaster"] === "1";
      if (!isMod && !isBroadcaster) {
        return;
      }
      const commandName = message.substring(1).split(" ")[0];
      const command = commands[commandName];
      if (!command) {
        return;
      }
      command();
    }

    const url = getUrlFromMessage(message);
    if (url) {
      ClipFinder.getTwitchClip(url).then((clip) => {
        if (clip) {
          console.debug("Adding clip to queue: ", clip);
          const submitter = userstate.username;
          clips.addClip({
            ...clip,
            submitter,
          });
        }
      });
    }
  }

  private static onMessageDeleted(channel: string, username: string, deletedMessage: string) {
    const url = getUrlFromMessage(deletedMessage);
    if (url) {
      ClipFinder.getTwitchClip(url).then((clip) => {
        if (clip) {
          console.debug("Removing clip from queue: ", clip);
          const submitter = username;
          clips.removeClip({
            ...clip,
            submitter,
          });
        }
      });
    }
  }

  private static onTimeout(channel: string, username: string) {
    console.debug("Removing all clips submitter by: ", username);
    clips.removeUserClips(username);
  }
}
