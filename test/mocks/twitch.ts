import type { TwitchClip, TwitchGame, TwitchUser, TwitchVideo } from '@/integrations/twitch'

export const mockTwitchGame: TwitchGame = {
  id: 'testgame',
  name: 'testgame',
  box_art_url: 'https://twitch.tv/testgame/boxart',
}

export const mockTwitchClip: TwitchClip = {
  id: 'testclip',
  url: 'https://clips.twitch.tv/testclip',
  embed_url: 'https://clips.twitch.tv/testclip',
  broadcaster_id: '123',
  broadcaster_name: 'testbroadcaster',
  creator_id: '456',
  creator_name: 'testcreator',
  video_id: '789',
  game_id: 'testgame',
  language: 'english',
  title: 'testtitle',
  view_count: 777,
  created_at: '2024-02-22T08:47:27.000Z',
  thumbnail_url: 'https://twitch.tv/testclip/thumbnail',
  duration: 50,
}

export const mockTwitchVod: TwitchVideo = {
  id: 'testvod',
  user_id: 'testuser',
  user_login: 'testuser',
  user_name: 'testuser',
  title: 'testvod',
  description: 'testvoddescription',
  created_at: '2024-02-22T08:47:27.000Z',
  published_at: '2024-02-22T08:47:27.000Z',
  url: 'https://twitch.tv/videos/testvod',
  thumbnail_url: 'https://twitch.tv/testvod/thumbnail',
  viewable: 'public',
  view_count: 100,
  language: 'english',
  type: 'archive',
  duration: '1h20m',
}

export const mockTwitchUser: TwitchUser = {
  id: 'testuser',
  login: 'testuser',
  display_name: 'Test User',
  type: 'user',
  broadcaster_type: 'affiliate',
  description: 'This is a test user',
  profile_image_url: 'https://twitch.tv/testuser/profile_image',
  offline_image_url: 'https://twitch.tv/testuser/offline_image',
  created_at: '2024-02-22T08:47:27.000Z',
}
