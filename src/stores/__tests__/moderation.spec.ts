import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Clip } from '../../interfaces/clips'
import { useModeration } from '../moderation'

describe('moderation.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const clip = {
    id: 'test',
    submitter: 'jordan',
    submitters: ['jordan'],
    title: 'Test title',
    channel: 'testchannel',
    game: 'testgame',
    timestamp: new Date('December 17, 1995 03:24:00').toDateString(),
    url: 'https://www.twitch.tv/test',
    embedUrl: 'https://www.twitch.tv/test',
    thumbnailUrl: 'test'
  } as Clip

  it('blocks clips from unwanted channels', () => {
    const moderation = useModeration()
    moderation.addBlockedChannel('testChannel')
    expect(moderation.isAllowed({ ...clip, channel: 'testChannel' })).toEqual(false)
  })

  it('does not care about case when checking if the channel is blocked', () => {
    const moderation = useModeration()
    moderation.addBlockedChannel('testChannel')
    expect(moderation.isAllowed({ ...clip, channel: 'TeStChAnnel' })).toEqual(false)
  })

  it('can block a channel from submitting clips', () => {
    const moderation = useModeration()
    moderation.addBlockedChannel('test')
    moderation.addBlockedChannel('test2')
    expect(moderation.blockedChannels.length).toEqual(2)
    moderation.addBlockedChannel('test2')
    expect(moderation.blockedChannels.length).toEqual(2)
  })

  it('can unblock a channel from submitting clips', () => {
    const moderation = useModeration()
    moderation.addBlockedChannel('test')
    moderation.addBlockedChannel('test2')
    expect(moderation.blockedChannels.length).toEqual(2)
    moderation.removeBlockedChannel('Test2')
    expect(moderation.blockedChannels.length).toEqual(1)
    expect(moderation.blockedChannels).not.toContain('test2')
  })
})
