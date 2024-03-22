export type { ChatUserstate } from 'tmi.js'

export interface TwitchUserCtx {
  id: string
  token?: string
  username?: string
}

export interface IDToken {
  aud: string
  azp: string
  exp: string
  iat: string
  iss: string
  sub: string
  preferred_username: string
}

export interface TokenInfo {
  client_id: string
  expires_in: number
  login: string
  scopes: string[]
  user_id: string
}

export interface AuthInfo {
  access_token: string
  id_token: string
  token_type: string
  scope: string
  decodedIdToken: IDToken
}

export interface TwitchGame {
  box_art_url: string
  id: string
  name: string
}

export interface TwitchClip {
  id: string
  url: string
  embed_url: string
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  video_id: string
  game_id: string
  language: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
}

// This will be an empty object when no pages are left
export interface TwitchPagination {
  cursor?: string
}

export interface TwitchResponse<T> {
  data: T
}

export interface TwitchPagedResponse<T> extends TwitchResponse<T> {
  pagination: TwitchPagination
}
