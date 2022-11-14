export const env = {
  CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_TWITCH_REDIRECT_URI as string,
}

export const config = {
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
      "Add blocked channels to prevent thier clips from being added to the queue.",
      "Allow channel moderators to modify the blocked channels via chat commands.",
      "Get clips from subreddit posts automatically",
      "Customize settings as you wish",
      "Dark and light UI themes",
    ],
    historyPageSize: 10,
  },
  github: "https://github.com/jordanshatford/clip-queue",
  copyright: {
    owner: "Jordan Shatford",
    year: 2022,
  },
}

export default config
