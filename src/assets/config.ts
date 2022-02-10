export const env = {
  clientId: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  redirectUri: import.meta.env.VITE_TWITCH_REDIRECT_URI as string,
  sentryDSN: import.meta.env.VITE_SENTRY_DSN as string,
  mode: import.meta.env.MODE,
}

const config = {
  App: {
    title: "Clip Queue",
    description:
      "Allow chatters in your Twitch stream to submit unique clips (via links) in your chat for simple viewing.",
    features: [
      "Easily connect your chat with Twitch login",
      "Clip duplication prevention",
      "Clip removal when user is timed-out, banned, or has message deleted",
      "Allows channel moderators to open/close the queue and move to the next/previous clip",
      "Queue progress indicator",
      "Get clips from subreddit posts automatically",
      "Customize settings as you wish",
      "Dark and light UI themes",
    ],
    creator: "Jordan Shatford",
    github: "https://github.com/jordanshatford/clip-queue",
    year: new Date().getFullYear(),
    Cache: {
      gamesKey: "cached-games",
      clipsKey: "cached-clips",
    },
    Theme: {
      localStorageKey: "theme",
      defaultValue: "dark",
    },
    Settings: {
      localStorageKey: "settings",
      defaultValue: {
        commandPrefix: "!",
        sendMsgsInChat: false,
        sendQueueOpenMsg: false,
        queueOpenMsg: "The queue is open, send twitch clip links in chat to have them added to the queue.",
        sendQueueCloseMsg: false,
        queueCloseMsg: "The queue is closed, twitch clip links in chat will be ignored.",
        sendCurrentClipMsg: false,
        currentClipMsg: "The current clip is: {url}",
      },
    },
  },
  Twitch: {
    Auth: {
      clientId: env.clientId,
      redirectUri: env.redirectUri,
      scopes: ["openid", "chat:read", "chat:edit"],
    },
    Chat: {
      options: {
        skipMembership: true,
        skipUpdatingEmotesets: true,
      },
      connection: {
        reconnect: true,
        secure: true,
      },
    },
    Clips: {
      hostnames: ["clips.twitch.tv"],
    },
  },
  Reddit: {
    maxPostsToCheck: 50,
    availableSubreddits: ["LivestreamFail", "TwitchClips", "RPClipsGTA", "NoPixel"],
  },
}

export default config
