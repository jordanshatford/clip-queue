import type { KickCategory, KickChannel, KickClip } from '@cq/services/kick'
import type { TwitchClip, TwitchGame } from '@cq/services/twitch'
import type { YouTubeClip } from '@cq/services/youtube'

import type { Clip } from '..'
import { ClipProvider } from '..'

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

export const mockYouTubeClip: YouTubeClip = {
  id: 'testclip',
  url: 'https://www.youtube.com/clip/testclip',
  video_id: 'testvideo',
  video_url: 'https://www.youtube.com/watch?v=testvideo',
  title: 'testtitle',
  author_name: 'testauthor',
  thumbnail_url: 'https://www.youtube.com/thumbnail',
  start: 0,
  end: 100
}

export const clipFromKick: Clip = {
  provider: ClipProvider.KICK,
  submitters: ['testsubmitterkick'],
  id: 'testclipkick',
  title: 'testclipkick',
  channel: 'testchannelkick',
  category: 'testcategorykick',
  createdAt: '2024-02-22T08:47:27.000Z',
  url: 'https://kick.com/channel?clip=testclip',
  embedUrl: 'https://kick.com/channel?clip=testclip',
  thumbnailUrl: 'https://kick.com/thumbnail'
}

export const clipFromTwitch: Clip = {
  provider: ClipProvider.TWITCH,
  submitters: ['testsubmittertwitch'],
  id: 'testcliptwitch',
  title: 'testcliptwitch',
  channel: 'testchanneltwitch',
  category: 'testcategorytwitch',
  createdAt: '2024-02-22T08:47:27.000Z',
  url: 'https://clips.twitch.tv/testclip',
  embedUrl: 'https://clips.twitch.tv/testclip',
  thumbnailUrl: 'https://twitch.tv/thumbnail'
}
