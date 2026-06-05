import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { clipFromKick, clipFromTwitch } from '~~/test/mocks'

import { IntegrationID } from '~/integrations'

describe('upcoming.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useUpcoming().reset()
  })

  it('initializes with the expected values', () => {
    const upcoming = useUpcoming()
    expect(upcoming.items).toEqual([])
    expect(upcoming.length).toEqual(0)
  })

  it('adds a clip to its list', () => {
    const upcoming = useUpcoming()
    const initialLength = upcoming.length
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength + 1)
    expect(upcoming.includes(clipFromTwitch)).toEqual(true)
    upcoming.reset()
    expect(upcoming.length).toEqual(0)
  })

  it('skips duplicate clips when adding to its list', () => {
    const upcoming = useUpcoming()
    const initialLength = upcoming.length
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength + 1)
    expect(upcoming.items).toContainEqual(clipFromTwitch)
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength + 1)
  })

  it('can remove clips that are in its list', () => {
    const upcoming = useUpcoming()
    upcoming.add(clipFromTwitch)
    upcoming.add(clipFromKick)
    const initialLength = upcoming.length
    expect(initialLength).toEqual(2)
    upcoming.remove(clipFromTwitch)
    expect(upcoming.items).not.toContainEqual(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength - 1)
    upcoming.remove({
      ...clipFromTwitch,
      id: 'not-valid',
      provider: IntegrationID.TWITCH_CLIPS,
      submitters: [],
    })
    expect(upcoming.length).toEqual(initialLength - 1)
  })

  it('removes user clips from its list based on submitter name', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromKick, submitters: ['jordan'] })
    upcoming.add({ ...clipFromKick, id: 'other', submitters: ['jordan2'] })
    upcoming.add({ ...clipFromKick, id: 'other2', submitters: ['jordan'] })
    expect(upcoming.length).toEqual(3)
    upcoming.removeBySubmitter('jordan')
    expect(upcoming.length).toEqual(1)
  })

  it('only removes the one submitter from a clip with many', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromKick, submitters: ['jordan'] })
    upcoming.add({ ...clipFromKick, submitters: ['jordan2'] })
    expect(upcoming.length).toEqual(1)
    upcoming.removeBySubmitter('jordan2')
    expect(upcoming.length).toEqual(1)
  })

  it('removes provider clips from the list based on provider ID', () => {
    const upcoming = useUpcoming()
    upcoming.add(clipFromKick)
    upcoming.add({ ...clipFromKick, id: 'other' })
    upcoming.add({ ...clipFromKick, id: 'other2' })
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(4)
    upcoming.removeByIntegration(IntegrationID.KICK_CLIPS)
    expect(upcoming.length).toEqual(1)
  })

  it('adds multiple clips with the same id if they are from different providers', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    upcoming.add({ ...clipFromKick, id: 'test', submitters: ['S'] })
    expect(upcoming.length).toEqual(2)
    expect(upcoming.items[0]?.id).toEqual(upcoming.items[1]?.id)
    expect(upcoming.items[0]?.provider).toEqual(IntegrationID.TWITCH_CLIPS)
    expect(upcoming.items[1]?.provider).toEqual(IntegrationID.KICK_CLIPS)
  })

  it('does not add the same submitter to a clip twice', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    upcoming.add({ ...clipFromTwitch, id: 'test', submitters: ['S'] })
    upcoming.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    expect(upcoming.length).toEqual(1)
    expect(upcoming.items[0]?.submitters?.length).toEqual(1)
  })

  it('does not care about case of submitter when removing clip', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    expect(upcoming.length).toEqual(1)
    upcoming.remove({ ...clipFromTwitch, id: 'test', submitters: ['S'] })
    expect(upcoming.length).toEqual(0)
  })

  it('does not care about case of the submitter when removing based on a submitter', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    expect(upcoming.length).toEqual(1)
    upcoming.removeBySubmitter('S')
    expect(upcoming.length).toEqual(0)
  })

  it('can remove multiple clips when removing based on submitter', () => {
    const upcoming = useUpcoming()
    for (let i = 1; i <= 10; i++) {
      upcoming.add({ ...clipFromTwitch, id: `test${i}`, submitters: ['s'] })
    }
    expect(upcoming.length).toEqual(10)
    upcoming.removeBySubmitter('s')
    expect(upcoming.length).toEqual(0)
  })

  it('sorts the list of clips based on number of submitters then the time submitted', () => {
    const upcoming = useUpcoming()
    for (let i = 1; i <= 10; i++) {
      upcoming.add({
        ...clipFromTwitch,
        id: 'test',
        submitters: [`submitter${i}`],
      })
    }
    for (let i = 1; i <= 10; i++) {
      upcoming.add({
        ...clipFromTwitch,
        id: 'test2',
        submitters: [`submitter${i}`],
      })
    }
    for (let i = 1; i <= 10; i++) {
      upcoming.add({
        ...clipFromTwitch,
        id: 'test3',
        submitters: [`submitter${i}`],
      })
    }
    expect(upcoming.items[0]?.id).toEqual('test')
    expect(upcoming.items[1]?.id).toEqual('test2')
    expect(upcoming.items[2]?.id).toEqual('test3')
  })

  it('can remove the first submitter from a clip which has multiple submitters', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromTwitch, submitters: ['testsubmitter'] })
    upcoming.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(upcoming.length).toEqual(1)
    upcoming.remove({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(upcoming.length).toEqual(1)
    const queuedClip = upcoming.items[0]
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain('testsubmitter2')
    expect(queuedClip?.submitters).toContain('testsubmitter')
  })

  it('can remove the second submitter from a clip which has multiple submitters', () => {
    const upcoming = useUpcoming()
    upcoming.add(clipFromTwitch)
    upcoming.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(upcoming.length).toEqual(1)
    upcoming.remove({
      ...clipFromTwitch,
      submitters: ['testsubmittertwitch'],
    })
    expect(upcoming.length).toEqual(1)
    const queuedClip = upcoming.items[0]
    expect(queuedClip?.submitters[0]).toEqual('testsubmitter2')
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain('testsubmittertwitch')
    expect(queuedClip?.submitters).toContain('testsubmitter2')
  })

  it('registers commands for interacting with the upcoming items', () => {
    const commands = useCommands()
    useUpcoming()
    const cmd = commands.commands['clearupcoming']
    expect(cmd).toBeDefined()
    expect(cmd?.id).toEqual('clearupcoming')
    const cmd2 = commands.commands['removebysubmitter']
    expect(cmd2).toBeDefined()
    expect(cmd2?.id).toEqual('removebysubmitter')
    const cmd3 = commands.commands['removebyintegration']
    expect(cmd3).toBeDefined()
    expect(cmd3?.id).toEqual('removebyintegration')
  })
})
