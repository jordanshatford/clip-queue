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
      "Integrates with Twitch chat after simple login.",
      "Prevents duplication by only allowing a clip to be submitted once.",
      "Handles deleted messages, and timed out/banned users by removing clips.",
    ],
    creator: "Jordan Shatford",
    github: "https://github.com/jordanshatford/clip-queue",
    year: new Date().getFullYear(),
    Theme: {
      localStorageKey: "theme",
      defaultValue: "dark",
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
      baseURL: "https://api.twitch.tv/helix/",
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
    },
  },
};

export default config;
