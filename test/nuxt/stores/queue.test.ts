import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { clipFromKick, clipFromTwitch } from '~~/test/mocks'

import type { Clip } from '~/integrations'

import { IntegrationID } from '~/integrations'

describe('queue.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useHistory().reset()
    useUpcoming().reset()
    const queue = useQueue()
    queue.reset()
    queue.settings.reset()
  })

  it('initializes with the expected values', () => {
    const queue = useQueue()
    expect(queue.settings.state.open).toEqual(true)
    expect(queue.current).toEqual(null)
    expect(queue.upcoming.length).toEqual(0)
    expect(queue.upcoming.items).toEqual([])
  })

  it('adds a clip to the queue', () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.length
    queue.add(clipFromTwitch)
    expect(queue.upcoming.length).toEqual(queueLength + 1)
    expect(queue.upcoming.includes(clipFromTwitch)).toEqual(true)
    queue.clear()
    expect(queue.upcoming.length).toEqual(0)
  })

  it('skips duplicate clips when adding to the queue', () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.length
    queue.add(clipFromTwitch)
    expect(queue.upcoming.length).toEqual(queueLength + 1)
    expect(queue.upcoming.items).toContainEqual(clipFromTwitch)
    queue.add(clipFromTwitch)
    expect(queue.upcoming.length).toEqual(queueLength + 1)
  })

  it('can start to play a specific clip at any time', () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.length
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    expect(queue.upcoming.length).toEqual(queueLength + 2)
    queue.play(clipFromTwitch)
    expect(queue.upcoming.length).toEqual(queueLength + 1)
    expect(queue.current).toEqual(clipFromTwitch)
    expect(queue.upcoming.items).toContainEqual(clipFromKick)
    expect(queue.upcoming.items).not.toContainEqual(clipFromTwitch)
    queue.play(clipFromKick)
    expect(queue.upcoming.length).toEqual(queueLength)
    expect(queue.current).toEqual(clipFromKick)
    expect(queue.upcoming.items).not.toContainEqual(clipFromKick)
  })

  it('will do nothing if it trys to play a current clip that doesnt exist', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.play({
      ...clipFromTwitch,
      id: 'not-valid',
      provider: IntegrationID.TWITCH_CLIPS,
      submitters: [],
    })
    expect(queue.upcoming.items).toContainEqual(clipFromTwitch)
    expect(queue.upcoming.items).toContainEqual(clipFromKick)
    expect(queue.current).toEqual(null)
  })

  it('can remove clips when they are in the queue', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    const queueLength = queue.upcoming.length
    expect(queueLength).toEqual(2)
    queue.remove(clipFromTwitch)
    expect(queue.upcoming.items).not.toContainEqual(clipFromTwitch)
    expect(queue.upcoming.length).toEqual(queueLength - 1)
    queue.remove({
      ...clipFromTwitch,
      id: 'not-valid',
      provider: IntegrationID.TWITCH_CLIPS,
      submitters: [],
    })
    expect(queue.upcoming.length).toEqual(queueLength - 1)
  })

  it('removes user clips from the queue', () => {
    const queue = useQueue()
    queue.add({ ...clipFromKick, submitters: ['jordan'] })
    queue.add({ ...clipFromKick, id: 'other', submitters: ['jordan'] })
    queue.add({ ...clipFromKick, id: 'other2', submitters: ['jordan'] })
    expect(queue.upcoming.length).toEqual(3)
    queue.upcoming.removeBySubmitter('jordan')
    expect(queue.upcoming.length).toEqual(0)
  })

  it('removes provider clips from the queue', () => {
    const queue = useQueue()
    queue.add(clipFromKick)
    queue.add({ ...clipFromKick, id: 'other' })
    queue.add({ ...clipFromKick, id: 'other2' })
    queue.add(clipFromTwitch)
    expect(queue.upcoming.length).toEqual(4)
    queue.upcoming.removeByIntegration(IntegrationID.KICK_CLIPS)
    expect(queue.upcoming.length).toEqual(1)
  })

  it('opens and closes the queue properly', () => {
    const queue = useQueue()
    queue.open()
    expect(queue.settings.state.open).toEqual(true)
    queue.close()
    expect(queue.settings.state.open).toEqual(false)
  })

  it('can go back to playing the previous clip', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.next()
    expect(queue.current).toEqual(clipFromTwitch)
    queue.next()
    expect(queue.current).toEqual(clipFromKick)
    queue.previous()
    expect(queue.current).toEqual(clipFromTwitch)
    queue.previous()
    expect(queue.current).toEqual(null)
  })

  it('can start playing the next clip', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.next()
    expect(queue.current).toEqual(clipFromTwitch)
    queue.next()
    expect(queue.current).toEqual(clipFromKick)
    expect(queue.history.length).toEqual(1)
  })

  it('does not add the current clip to previous when it is not defined', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.next()
    expect(queue.history.length).toEqual(0)
  })

  it('can purge all clips from the history', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.next()
    queue.next()
    queue.next()
    expect(queue.history.length).toEqual(2)
    queue.purge()
    expect(queue.history.length).toEqual(0)
  })

  it('can have a limit set to prevent additional clips from being added', () => {
    const queue = useQueue()
    queue.settings.state.limit = 2
    queue.add({
      ...clipFromTwitch,
      id: 'test',
      submitters: ['s'],
      provider: IntegrationID.TWITCH_CLIPS,
    })
    queue.add({
      ...clipFromTwitch,
      id: 'test2',
      submitters: ['s'],
      provider: IntegrationID.TWITCH_CLIPS,
    })
    queue.add({
      ...clipFromTwitch,
      id: 'test3',
      submitters: ['s'],
      provider: IntegrationID.TWITCH_CLIPS,
    })
    expect(queue.upcoming.length).toEqual(2)
  })

  it('adds clips that are already there (even when full) to update submitters', () => {
    const clip: Clip = {
      ...clipFromTwitch,
      id: 'test',
      submitters: ['testsubmitter'],
      provider: IntegrationID.TWITCH_CLIPS,
    }
    const queue = useQueue()
    queue.settings.state.limit = 1
    queue.add(clip)
    queue.add({ ...clip, submitters: ['testsubmitter2'] })
    queue.add({ ...clip, id: 'test2' })
    expect(queue.upcoming.length).toEqual(1)
    const queuedClip = queue.upcoming.items[0]
    expect(queuedClip?.submitters[0]).toEqual('testsubmitter')
    expect(queuedClip?.submitters?.length).toEqual(2)
    expect(queuedClip?.submitters).toContain('testsubmitter')
    expect(queuedClip?.submitters).toContain('testsubmitter2')
  })

  it('can have its settings reset', () => {
    const queue = useQueue()
    queue.settings.reset()
    expect(queue.settings.isModified).toEqual(false)
    queue.settings.state.limit = 100
    expect(queue.settings.isModified).toEqual(true)
    queue.settings.reset()
    expect(queue.settings.isModified).toEqual(false)
    expect(queue.settings.state.limit).toEqual(null)
  })

  it.each([
    ['open', undefined],
    ['close', undefined],
    ['previous', undefined],
    ['next', undefined],
    ['allowduplicates', 1],
    ['sizelimit', 1],
  ])('registers command %s for interacting with the queue', (id: string, args?: number) => {
    const commands = useCommands()
    useQueue()
    const cmd = commands.commands[id]
    expect(cmd).toBeDefined()
    expect(cmd?.id).toEqual(id)
    expect(cmd?.help?.args?.length).toEqual(args)
  })
})
