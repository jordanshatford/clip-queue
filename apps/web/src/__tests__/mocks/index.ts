import type { Clip } from '@cq/providers'
import { ClipProvider } from '@cq/providers'

export * from './kick'
export * from './twitch'

export const clipFromKick: Clip = {
  provider: ClipProvider.KICK,
  submitters: ['testsubmitterkick'],
  id: 'testclipkick',
  title: 'testclipkick',
  channel: 'testchannelkick',
  creator: 'testcreatorkick',
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
  creator: 'testcreatortwitch',
  category: 'testcategorytwitch',
  createdAt: '2024-02-22T08:47:27.000Z',
  url: 'https://clips.twitch.tv/testclip',
  embedUrl: 'https://clips.twitch.tv/testclip',
  thumbnailUrl: 'https://twitch.tv/thumbnail'
}
