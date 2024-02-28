export enum ClipSource {
  UNKNOWN = 'Unknown',
  CHAT = 'Twitch Chat',
  HISTORY = 'History Page'
}

export enum ClipProvider {
  UNKNOWN = 'Unknown',
  KICK = 'Kick',
  TWITCH = 'Twitch'
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
  provider: ClipProvider
}
