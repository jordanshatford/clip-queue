import * as m from '@/paraglide/messages'

export const env = {
  CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_TWITCH_REDIRECT_URI as string,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN as string
}

export const config = {
  about: {
    title: m.title(),
    tagline: m.tagline(),
    features: [
      {
        title: m.feature_connect_title(),
        description: m.feature_connect_description(),
        icon: 'pi pi-comments'
      },
      {
        title: m.feature_duplicate_prevent_title(),
        description: m.feature_duplicate_prevent_description(),
        icon: 'pi pi-copy'
      },
      {
        title: m.feature_popularity_title(),
        description: m.feature_popularity_description(),
        icon: 'pi pi-chart-line'
      },
      {
        title: m.feature_commands_title(),
        description: m.feature_commands_description(),
        icon: 'pi pi-bolt'
      },
      {
        title: m.feature_moderation_title(),
        description: m.feature_moderation_description(),
        icon: 'pi pi-flag'
      },
      {
        title: m.feature_settings_title(),
        description: m.feature_settings_description(),
        icon: 'pi pi-cog'
      }
    ]
  },
  github: 'https://github.com/jordanshatford/clip-queue',
  copyright: {
    owner: 'Jordan Shatford',
    year: new Date().getFullYear()
  }
}

export default config
