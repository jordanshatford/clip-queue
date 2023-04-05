export enum ClipSource {
  UNKNOWN = 'Unknown',
  CHAT = 'Twitch Chat',
  REDDIT = 'Reddit',
  HISTORY = 'History Page'
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
