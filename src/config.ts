const env = {
  clientId: process.env.VUE_APP_TWITCH_CLIENT_ID as string,
  redirectUri: process.env.VUE_APP_TWITCH_REDIRECT_URI as string,
};

const config = {
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
