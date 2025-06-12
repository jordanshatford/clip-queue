import type { KickCategory, KickChannel, KickClip } from '../kick'
import type { TwitchClip, TwitchGame, TwitchUser } from '../twitch'

export const mockKickCategory: KickCategory = {
  id: 123,
  name: 'testcategory',
  slug: 'testcategory',
  responsive: 'https://files.kick.com/images/subcategories/15/banner/testcategory',
  banner: 'https://files.kick.com/images/subcategories/15/banner/testcategory',
  parent_category: 'testparentcategory'
}

export const mockKickChannel: KickChannel = {
  id: 456,
  username: 'testchannel',
  slug: 'testchannel',
  profile_picture: null
}

export const mockKickClip: KickClip = {
  id: 'testclip',
  livestream_id: '12',
  category_id: '1',
  channel_id: 123,
  user_id: 456,
  title: 'testtitle',
  clip_url: 'https://kick.com/channel?clip=testclip',
  thumbnail_url: 'https://kick.com/thumbnail',
  privacy: 'CLIP_PRIVACY_PUBLIC',
  likes: 1,
  liked: false,
  views: 123,
  duration: 22,
  started_at: '2024-02-22T08:45:01.000Z',
  created_at: '2024-02-22T08:47:27.000Z',
  is_mature: false,
  video_url: 'https://kick.com/video',
  view_count: 123,
  likes_count: 1,
  is_live: false,
  category: mockKickCategory,
  creator: mockKickChannel,
  channel: mockKickChannel
}

export const mockTwitchGame: TwitchGame = {
  id: 'testgame',
  name: 'testgame',
  box_art_url: 'https://twitch.tv/testgame/boxart'
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
  duration: 50
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
  email: 'testuser@twitch.com',
  created_at: '2024-02-22T08:47:27.000Z',
  view_count: 1000
}
