export const env = {
  CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_TWITCH_REDIRECT_URI as string,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN as string,
  SENTRY_TRACING_ORIGIN: import.meta.env.VITE_SENTRY_TRACING_ORIGIN as string,
  MODE: import.meta.env.MODE,
}

const config = {
  App: {
    title: "Clip Queue",
    description:
      "Allow chatters in your Twitch stream to submit unique clips (via links) in your chat for simple viewing.",
    features: [
      "Easily connect your chat with Twitch login",
      "Clip duplication prevention",
      "Popular clips rise up in the queue",
      "Clip removal when user is timed-out, banned, or has message deleted",
      "Allows channel moderators to open/close the queue and move to the next/previous clip",
      "Get clips from subreddit posts automatically",
      "Customize settings as you wish",
      "Dark and light UI themes",
    ],
    creator: "Jordan Shatford",
    github: "https://github.com/jordanshatford/clip-queue",
    year: new Date().getFullYear(),
  },
}

export default config
