import type { TwitchClip, TwitchGame, TwitchVideo, TwitchUser } from '../../../shared/twitch'

export const mockTwitchGame: TwitchGame = {
  id: 'testgame',
  name: 'testgame',
  box_art_url: 'https://twitch.tv/testgame/boxart',
  igdb_id: '',
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
  vod_offset: 0,
  is_featured: false,
}

export const mockTwitchVod: TwitchVideo = {
  id: 'testvod',
  stream_id: null,
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
  display_name: 'testuser',
  type: '',
  broadcaster_type: '',
  description: '',
  profile_image_url: '',
  offline_image_url: '',
  email: '',
  created_at: '2024-02-22T08:47:27.000Z',
}
