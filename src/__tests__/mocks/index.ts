import type { Clip } from '@/integrations'

import { IntegrationID } from '@/integrations'

export * from './kick'
export * from './twitch'

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
