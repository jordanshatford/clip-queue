export enum ClipSource {
  Unknown = 'Unknown',
  TwitchChat = 'Twitch Chat',
  Reddit = 'Reddit',
  HistoryPage = 'History Page'
}

export interface Clip {
  id?: string
  title?: string
  channel?: string
  game?: string
  timestamp?: string
  submitter?: string
  submitters?: string[]
  url?: string
  embedUrl?: string
  thumbnailUrl?: string
  source?: ClipSource
}
