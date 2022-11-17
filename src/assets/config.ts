import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  Cog8ToothIcon,
  DocumentDuplicateIcon,
  HandRaisedIcon,
  UserIcon,
} from "@/assets/icons"

export const env = {
  CLIENT_ID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_TWITCH_REDIRECT_URI as string,
}

export const config = {
  about: {
    title: "Twitch Clip Queue",
    tagline: "An enhanced Twitch clip viewing experience",
    description: "Quickly connect to your Twitch chat to queue clips linked in chat",
    features: [
      {
        title: "Connect to Chat",
        description:
          "Log in to automatically connect to your Twitch chat. Clips submitted by users in chat will be queued.",
        icon: UserIcon,
      },
      {
        title: "Duplicate Prevention",
        description:
          "Duplicate clips will not be re-added to the queue. This includes clips watched during previous sessions.",
        icon: DocumentDuplicateIcon,
      },
      {
        title: "Popular Clips Rise Up",
        description:
          "Clips being repeately submitted by many users will rise up in the queue allowing it to be viewed sooner.",
        icon: ArrowTrendingUpIcon,
      },
      {
        title: "Chat Commands",
        description: "Moderators of the channel can use chat commands to interact directly with the queue.",
        icon: ChatBubbleLeftRightIcon,
      },
      {
        title: "Automatic Moderation",
        description:
          "Moderation performed in chat will effect the clips submitted by those users. Custom moderation can be setup in the settings.",
        icon: HandRaisedIcon,
      },
      {
        title: "Settings Customization",
        description: "Personalize your experience through the vast option of customizable settings.",
        icon: Cog8ToothIcon,
      },
    ],
  },
  history: {
    pageSize: 10,
  },
  github: "https://github.com/jordanshatford/twitch-clip-queue",
  copyright: {
    owner: "Jordan Shatford",
    year: 2022,
  },
}

export default config
