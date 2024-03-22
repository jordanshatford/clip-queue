import type { KickClip, KickCategory, KickChannel } from '@cq/services/kick'

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
