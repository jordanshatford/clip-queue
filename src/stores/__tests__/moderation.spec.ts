import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { clipFromTwitch } from '@/__tests__/mocks'
import { useModeration } from '../moderation'

describe('moderation.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('blocks clips from unwanted channels', () => {
    const moderation = useModeration()
    moderation.addBlockedChannel('testChannel')
    expect(moderation.isAllowed({ ...clipFromTwitch, channel: 'testChannel' })).toEqual(false)
  })

  it('does not care about case when checking if the channel is blocked', () => {
    const moderation = useModeration()
    moderation.addBlockedChannel('testChannel')
    expect(moderation.isAllowed({ ...clipFromTwitch, channel: 'TeStChAnnel' })).toEqual(false)
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

  it('can block a submitter from submitting clips', () => {
    const moderation = useModeration()
    moderation.addBlockedSubmitter('test')
    moderation.addBlockedSubmitter('test2')
    expect(moderation.blockedSubmitters.length).toEqual(2)
    moderation.addBlockedSubmitter('test2')
    expect(moderation.blockedSubmitters.length).toEqual(2)
  })

  it('can unblock a submitter from submitting clips', () => {
    const moderation = useModeration()
    moderation.addBlockedSubmitter('test')
    moderation.addBlockedSubmitter('test2')
    expect(moderation.blockedSubmitters.length).toEqual(2)
    moderation.removeBlockedSubmitter('Test2')
    expect(moderation.blockedSubmitters.length).toEqual(1)
    expect(moderation.blockedSubmitters).not.toContain('test2')
  })
})
