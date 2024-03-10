export const env = {
  CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_TWITCH_REDIRECT_URI as string
}

export const config = {
  about: {
    title: 'Clip Queue',
    tagline: 'An enhanced clip viewing experience',
    features: [
      {
        title: 'Connect to Chat',
        description:
          'Log in to automatically connect to your Twitch chat. Clips submitted by users in chat will be queued.',
        icon: 'pi pi-comments'
      },
      {
        title: 'Duplicate Prevention',
        description:
          'Duplicate clips will not make it into the queue. This includes clips watched during previous sessions.',
        icon: 'pi pi-copy'
      },
      {
        title: 'Popular Clips Rise Up',
        description:
          'Clips being repeately submitted by many users will rise up in the queue allowing it to be viewed sooner.',
        icon: 'pi pi-chart-line'
      },
      {
        title: 'Chat Commands',
        description:
          'Moderators of the channel can use chat commands to interact directly with the queue.',
        icon: 'pi pi-bolt'
      },
      {
        title: 'Automatic Moderation',
        description:
          'Moderation performed in chat will effect the clips submitted by those users.',
        icon: 'pi pi-flag'
      },
      {
        title: 'Settings Customization',
        description:
          'Personalize your experience through the vast choices of customizable settings.',
        icon: 'pi pi-cog'
      }
    ]
  },
  twitch: {
    scopes: ['openid', 'chat:read']
  },
  github: 'https://github.com/jordanshatford/clip-queue',
  copyright: {
    owner: 'Jordan Shatford',
    year: 2022
  }
}

export default config
