export const env = {
  CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_TWITCH_REDIRECT_URI as string,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN as string
}

export const config = {
  title: 'Clip Queue',
  github: 'https://github.com/jordanshatford/clip-queue',
  copyright: {
    owner: 'Jordan Shatford',
    year: new Date().getFullYear()
  }
}

export default config
