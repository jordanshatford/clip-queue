const env = {
  clientId: process.env.VUE_APP_TWITCH_CLIENT_ID as string,
  redirectUri: process.env.VUE_APP_TWITCH_REDIRECT_URI as string,
};

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
    Queue: {
      commandPrefix: "!",
    },
  },
  Twitch: {
    Auth: {
      clientId: env.clientId,
      redirectUri: env.redirectUri,
      baseURL: "https://id.twitch.tv/oauth2",
      scopes: ["openid", "chat:read"],
    },
    API: {
      baseURL: "https://api.twitch.tv/helix",
      headers: {
        "Client-ID": env.clientId,
      },
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
      Embeded: {
        baseURL: "https://clips.twitch.tv/embed",
        paramsString: `autoplay=${true}&parent=${window.location.hostname}`,
      },
    },
  },
  Reddit: {
    baseURL: "https://api.reddit.com",
    maxPostsToCheck: 50,
    availableSubreddits: ["LivestreamFail", "TwitchClips", "RPClipsGTA", "NoPixel"],
  },
};

export default config;
