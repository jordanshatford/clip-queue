import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Clip } from '@cq/providers'
import { ClipProvider } from '@cq/providers'

import { clipFromKick, clipFromTwitch } from '@/__tests__/mocks'
import { useQueue } from '../queue'
import { useSettings } from '../settings'

describe('clips.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  beforeEach(() => {
    const queue = useQueue()
    expect(queue.isOpen).toEqual(true)
    expect(queue.current).toEqual(undefined)
    expect(queue.upcoming.size()).toEqual(0)
    expect(queue.upcoming.toArray()).toEqual([])
    expect(queue.history.size()).toEqual(0)
    expect(queue.history.toArray()).toEqual([])
  })

  it('adds a clip to the queue', () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.size()
    queue.add(clipFromTwitch)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
    expect(queue.upcoming.includes(clipFromTwitch)).toEqual(true)
    queue.clear()
    expect(queue.upcoming.size()).toEqual(0)
  })

  it('skips duplicate clips when adding to the queue', () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.size()
    queue.add(clipFromTwitch)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
    expect(queue.upcoming.toArray()).toContainEqual(clipFromTwitch)
    queue.add(clipFromTwitch)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
  })

  it('can start to play a specific clip at any time', () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.size()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    expect(queue.upcoming.size()).toEqual(queueLength + 2)
    queue.play(clipFromTwitch)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
    expect(queue.current).toEqual(clipFromTwitch)
    expect(queue.upcoming.toArray()).toContainEqual(clipFromKick)
    expect(queue.upcoming.toArray()).not.toContainEqual(clipFromTwitch)
    queue.play(clipFromKick)
    expect(queue.upcoming.size()).toEqual(queueLength)
    expect(queue.current).toEqual(clipFromKick)
    expect(queue.upcoming.toArray()).not.toContainEqual(clipFromKick)
  })

  it('will do nothing if it trys to play a current clip that doesnt exist', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.play({
      ...clipFromTwitch,
      id: 'not-valid',
      provider: ClipProvider.TWITCH,
      submitters: []
    })
    expect(queue.upcoming.toArray()).toContainEqual(clipFromTwitch)
    expect(queue.upcoming.toArray()).toContainEqual(clipFromKick)
    expect(queue.current).toEqual(undefined)
  })

  it('can remove clips when they are in the queue', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    const queueLength = queue.upcoming.size()
    expect(queueLength).toEqual(2)
    queue.remove(clipFromTwitch)
    expect(queue.upcoming.toArray()).not.toContainEqual(clipFromTwitch)
    expect(queue.upcoming.size()).toEqual(queueLength - 1)
    queue.remove({
      ...clipFromTwitch,
      id: 'not-valid',
      provider: ClipProvider.TWITCH,
      submitters: []
    })
    expect(queue.upcoming.size()).toEqual(queueLength - 1)
  })

  it('removes user clips from the queue', () => {
    const queue = useQueue()
    queue.add({ ...clipFromKick, submitters: ['jordan'] })
    queue.add({ ...clipFromKick, id: 'other', submitters: ['jordan'] })
    queue.add({ ...clipFromKick, id: 'other2', submitters: ['jordan'] })
    expect(queue.upcoming.size()).toEqual(3)
    queue.removeSubmitterClips('jordan')
    expect(queue.upcoming.size()).toEqual(0)
  })

  it('removes provider clips from the queue', () => {
    const queue = useQueue()
    queue.add(clipFromKick)
    queue.add({ ...clipFromKick, id: 'other' })
    queue.add({ ...clipFromKick, id: 'other2' })
    queue.add(clipFromTwitch)
    expect(queue.upcoming.size()).toEqual(4)
    queue.removeProviderClips(ClipProvider.KICK)
    expect(queue.upcoming.size()).toEqual(1)
  })

  it('opens and closes the queue properly', () => {
    const queue = useQueue()
    queue.open()
    expect(queue.isOpen).toEqual(true)
    queue.close()
    expect(queue.isOpen).toEqual(false)
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
    expect(queue.current).toEqual(undefined)
  })

  it('can start playing the next clip', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.next()
    expect(queue.current).toEqual(clipFromTwitch)
    queue.next()
    expect(queue.current).toEqual(clipFromKick)
    expect(queue.history.size()).toEqual(1)
  })

  it('does not add the current clip to previous when it is not defined', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.next()
    expect(queue.history.size()).toEqual(0)
  })

  it('can purge all clips from the history', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.next()
    queue.next()
    queue.next()
    expect(queue.history.size()).toEqual(2)
    queue.purge()
    expect(queue.history.size()).toEqual(0)
  })

  it('can remove a specific clip from the history', () => {
    const queue = useQueue()
    queue.add(clipFromTwitch)
    queue.add(clipFromKick)
    queue.next()
    queue.next()
    queue.next()
    expect(queue.history.size()).toEqual(2)
    queue.removeFromHistory(clipFromKick)
    expect(queue.history.size()).toEqual(1)
    expect(queue.history.toArray()).not.toContain(clipFromKick)
  })

  it('can have a limit set to prevent additional clips from being added', () => {
    const queue = useQueue()
    const settings = useSettings()
    settings.queue.limit = 2
    queue.add({ ...clipFromTwitch, id: 'test', submitters: ['s'], provider: ClipProvider.TWITCH })
    queue.add({ ...clipFromTwitch, id: 'test2', submitters: ['s'], provider: ClipProvider.TWITCH })
    queue.add({ ...clipFromTwitch, id: 'test3', submitters: ['s'], provider: ClipProvider.TWITCH })
    expect(queue.upcoming.size()).toEqual(2)
  })

  it('adds clips that are already there (even when full) to update submitters', () => {
    const clip: Clip = {
      ...clipFromTwitch,
      id: 'test',
      submitters: ['testsubmitter'],
      provider: ClipProvider.TWITCH
    }
    const queue = useQueue()
    const settings = useSettings()
    settings.queue.limit = 1
    queue.add(clip)
    queue.add({ ...clip, submitters: ['testsubmitter2'] })
    queue.add({ ...clip, id: 'test2' })
    expect(queue.upcoming.size()).toEqual(1)
    const queuedClip = queue.upcoming.pop()
    expect(queuedClip?.submitters[0]).toEqual('testsubmitter')
    expect(queuedClip?.submitters?.length).toEqual(2)
    expect(queuedClip?.submitters).toContain('testsubmitter')
    expect(queuedClip?.submitters).toContain('testsubmitter2')
  })
})
