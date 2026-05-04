import type { Clip } from '@/integrations'
import type { KickCategory, KickChannel, KickClip, KickVideo } from '@/integrations/kick'
import type { TwitchClip, TwitchGame, TwitchUser, TwitchVideo } from '@/integrations/twitch'
import type { OEmbedResponse } from '@/integrations/youtube'

import { IntegrationID } from '@/integrations'

export const mockKickCategory: KickCategory = {
  id: 123,
  name: 'testcategory',
  slug: 'testcategory',
  responsive: 'https://files.kick.com/images/subcategories/15/banner/testcategory',
  banner: 'https://files.kick.com/images/subcategories/15/banner/testcategory',
  parent_category: 'testparentcategory',
}

export const mockKickChannel: KickChannel = {
  id: 456,
  username: 'testchannel',
  slug: 'testchannel',
  profile_picture: null,
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
  channel: mockKickChannel,
}

export const mockKickVod: KickVideo = {
  id: 987654,
  live_stream_id: 123456,
  slug: null,
  thumb: null,
  s3: null,
  trading_platform_id: null,
  created_at: '2026-05-03T18:25:43Z',
  updated_at: '2026-05-03T20:10:12Z',
  uuid: 'testkickvod',
  views: 48291,
  deleted_at: null,
  source: 'livestream',
  livestream: {
    id: 123456,
    slug: 'testvodslug',
    channel_id: 777,
    created_at: '2026-05-03T17:55:00Z',
    session_title: 'testvodtitle',
    is_live: false,
    risk_level_id: null,
    start_time: '2026-05-03T18:00:00Z',
    source: null,
    twitch_channel: null,
    duration: 14400, // 4 hours in seconds
    language: 'en',
    is_mature: false,
    viewer_count: 0,
    thumbnail: 'https://kick.com/test.jpg',
    channel: {
      id: 777,
      user_id: 999,
      slug: 'pro_gamer123',
      is_banned: false,
      playback_url: 'https://stream.kick.com/ivs/test.m3u8',
      name_updated_at: null,
      vod_enabled: true,
      subscription_enabled: true,
      followersCount: 125430,
      user: {
        profilepic: 'https://kick.com/test.jpg',
        bio: 'testvodbio',
        twitter: '',
        facebook: '',
        instagram: '',
        youtube: '',
        discord: '',
        tiktok: '',
        username: 'testkickvoduser',
      },
      can_host: true,
      verified: {
        id: 1,
        channel_id: 777,
        created_at: '2025-01-10T12:00:00Z',
        updated_at: '2025-01-10T12:00:00Z',
      },
    },
    categories: [
      {
        id: 1,
        category_id: 10,
        name: 'testkickvodcategory',
        slug: 'testkickvodcategory',
        tags: [],
        description: null,
        deleted_at: null,
        viewers: 52340,
        category: {
          id: 10,
          name: 'Games',
          slug: 'games',
          icon: 'https://kick.com/icons/games.png',
        },
      },
    ],
  },
}

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

export const mockYouTubeOEmbed: OEmbedResponse = {
  title: 'testyoutube',
  author_name: 'testyoutubeauthor',
  author_url: 'https://youtube.com/author/test',
  type: 'video',
  height: '',
  width: '',
  version: '',
  provider_name: 'YouTube',
  provider_url: 'https://youtube.com',
  thumbnail_height: '',
  thumbnail_width: '',
  thumbnail_url: 'https://youtube.com/test/thumbnail',
  html: '',
}

export const clipFromKick: Clip = {
  provider: IntegrationID.KICK_CLIPS,
  submitters: ['testsubmitterkick'],
  id: 'testclipkick',
  title: 'testclipkick',
  channel: 'testchannelkick',
  category: 'testcategorykick',
  createdAt: '2024-02-22T08:47:27.000Z',
  url: 'https://kick.com/channel?clip=testclip',
  embedUrl: 'https://kick.com/channel?clip=testclip',
  thumbnailUrl: 'https://kick.com/thumbnail',
}

export const clipFromTwitch: Clip = {
  provider: IntegrationID.TWITCH_CLIPS,
  submitters: ['testsubmittertwitch'],
  id: 'testcliptwitch',
  title: 'testcliptwitch',
  channel: 'testchanneltwitch',
  category: 'testcategorytwitch',
  createdAt: '2024-02-22T08:47:27.000Z',
  url: 'https://clips.twitch.tv/testclip',
  embedUrl: 'https://clips.twitch.tv/testclip',
  thumbnailUrl: 'https://twitch.tv/thumbnail',
}
