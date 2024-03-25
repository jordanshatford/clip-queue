import { ClipProvider, type Clip } from '@cq/providers'

export * from './kick'
export * from './twitch'
export * from './youtube'

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

export const clipFromYouTube: Clip = {
  provider: ClipProvider.YOUTUBE,
  submitters: ['testsubmitteryoutube'],
  id: 'testclipyoutube',
  title: 'testclipyoutube',
  channel: 'testchannelyoutube',
  category: undefined,
  createdAt: undefined,
  url: 'https://www.youtube.com/clip/testclip',
  embedUrl: 'https://www.youtube.com/embed/testclip?start=0&end=100',
  thumbnailUrl: 'https://www.youtube.com/thumbnail'
}
