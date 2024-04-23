import { beforeEach, describe, expect, it } from 'vitest'

import { ClipProvider } from '@cq/providers'

import { ClipList } from '../clip-list'
import { clipFromKick, clipFromTwitch } from './mocks'

describe('clip-list.ts', () => {
  let clipList: ClipList
  let randomNumber: number
  const startNumber = 1

  beforeEach(() => {
    clipList = new ClipList()
    randomNumber = Math.floor(Math.random() * 25) + 5
    for (let i = startNumber; i <= randomNumber; i++) {
      clipList.add({ ...clipFromTwitch, id: `test-id-${i}` })
    }
  })

  it('can be constructed with clips', () => {
    const clipList2 = new ClipList(clipFromTwitch, clipFromKick)
    expect(clipList2.size()).toEqual(2)
    expect(clipList2.shift()?.id).toEqual('testcliptwitch')
    expect(clipList2.shift()?.id).toEqual('testclipkick')
  })

  it('can have clips added to it', () => {
    expect(clipList.size()).toEqual(randomNumber)
    clipList.add({ ...clipFromTwitch, id: 'test-id-push' })
    expect(clipList.size()).toEqual(randomNumber + 1)
    expect(clipList.pop()?.id).toEqual('test-id-push')
  })

  it('can have clips unshifted to it', () => {
    expect(clipList.size()).toEqual(randomNumber)
    clipList.unshift({ ...clipFromTwitch, id: 'test-id-push' })
    expect(clipList.size()).toEqual(randomNumber + 1)
    expect(clipList.shift()?.id).toEqual('test-id-push')
  })

  it('can have clips popped from it', () => {
    expect(clipList.pop()?.id).toEqual(`test-id-${randomNumber}`)
    expect(clipList.size()).toEqual(randomNumber - 1)
  })

  it('can have clips shifted from it', () => {
    expect(clipList.shift()?.id).toEqual(`test-id-${startNumber}`)
    expect(clipList.size()).toEqual(randomNumber - 1)
  })

  it('can have clips removed from it', () => {
    expect(
      clipList.includes({
        ...clipFromTwitch,
        id: `test-id-${startNumber}`
      })
    ).toEqual(true)
    clipList.remove({
      ...clipFromTwitch,
      id: `test-id-${startNumber}`
    })
    expect(
      clipList.includes({
        ...clipFromTwitch,
        id: `test-id-${startNumber}`
      })
    ).toEqual(false)
  })

  it('can return if it has a clip', () => {
    expect(
      clipList.includes({
        ...clipFromTwitch,
        id: `test-id-${startNumber}`
      })
    ).toEqual(true)
  })

  it('return undefined when no value can be popped from it', () => {
    const clipList2 = new ClipList()
    expect(clipList2.empty()).toBeTruthy()
    expect(clipList2.pop()).toEqual(undefined)
  })

  it('return undefined when no value can be shifted from it', () => {
    const clipList2 = new ClipList()
    expect(clipList2.empty()).toBeTruthy()
    expect(clipList2.shift()).toEqual(undefined)
  })

  it('can check the size of the clip list', () => {
    expect(clipList.size()).toEqual(randomNumber)
    const testClipList = new ClipList()
    expect(testClipList.size()).toEqual(0)
    const randomNumber2 = Math.floor(Math.random() * 25) + 5
    for (let i = 1; i <= randomNumber2; i++) {
      testClipList.add({ ...clipFromTwitch, id: `${i}` })
      expect(testClipList.size()).toEqual(i)
    }
    expect(testClipList.size()).toEqual(randomNumber2)
  })

  it('can clear the clip list', () => {
    expect(clipList.empty()).toBeFalsy()
    clipList.clear()
    expect(clipList.empty()).toBeTruthy()
  })

  it('can check if the clip list is empty', () => {
    expect(clipList.empty()).toBeFalsy()
    const testClipList = new ClipList()
    expect(testClipList.empty()).toBeTruthy()
  })

  it('can convert the clip list to an array', () => {
    const clipListArray = clipList.toArray()
    expect(clipListArray.length).toEqual(clipList.size())
    clipListArray.every((clip) => expect(typeof clip).toEqual('object'))
  })

  it('can have clips removed from it based on submitter when the clip has one submitter', () => {
    const clipWithSubmitter = {
      ...clipFromTwitch,
      submitters: ['jordan']
    }
    expect(clipList.includes(clipWithSubmitter)).toEqual(false)
    clipList.add(clipWithSubmitter)
    expect(clipList.includes(clipWithSubmitter)).toEqual(true)
    clipList.removeBySubmitter('jordan')
    expect(clipList.includes(clipWithSubmitter)).toEqual(false)
  })

  it('can add multiple submitters for the same clip', () => {
    const clipList2 = new ClipList()
    clipList2.add(clipFromTwitch)
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitters[0]).toEqual('testsubmittertwitch')
    expect(queuedClip?.submitters?.length).toEqual(2)
    expect(queuedClip?.submitters).toContain('testsubmittertwitch')
    expect(queuedClip?.submitters).toContain('testsubmitter2')
  })

  it('can remove by submitter the first submitter from a clip which has multiple submitters', () => {
    const clipList2 = new ClipList()
    clipList2.add(clipFromTwitch)
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(clipList2.size()).toEqual(1)
    clipList2.removeBySubmitter('testsubmittertwitch')
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitters[0]).toEqual('testsubmitter2')
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain('testsubmittertwitch')
    expect(queuedClip?.submitters).toContain('testsubmitter2')
  })

  it('can remove by submitter the second submitter from a clip which has multiple submitters', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter'] })
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(clipList2.size()).toEqual(1)
    expect(clipList2.toArray()[0]?.submitters.length).toEqual(2)
    clipList2.removeBySubmitter('testsubmitter2')
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitters[0]).toEqual('testsubmitter')
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain('testsubmitter2')
    expect(queuedClip?.submitters).toContain('testsubmitter')
  })

  it('can remove the first submitter from a clip which has multiple submitters', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter'] })
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(clipList2.size()).toEqual(1)
    clipList2.remove({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    // expect(queuedClip?.submitter).toEqual('testsubmitter')
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain('testsubmitter2')
    expect(queuedClip?.submitters).toContain('testsubmitter')
  })

  it('can remove the second submitter from a clip which has multiple submitters', () => {
    const clipList2 = new ClipList()
    clipList2.add(clipFromTwitch)
    clipList2.add({ ...clipFromTwitch, submitters: ['testsubmitter2'] })
    expect(clipList2.size()).toEqual(1)
    clipList2.remove({ ...clipFromTwitch, submitters: ['testsubmittertwitch'] })
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitters[0]).toEqual('testsubmitter2')
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain('testsubmittertwitch')
    expect(queuedClip?.submitters).toContain('testsubmitter2')
  })

  it('sorts the list of clips based on number of submitters', () => {
    const clipList2 = new ClipList()
    for (let i = 1; i <= 8; i++) {
      clipList2.add({ ...clipFromTwitch, id: 'test', submitters: [`submitter${i}`] })
    }
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ ...clipFromTwitch, id: 'test2', submitters: [`submitter${i}`] })
    }
    for (let i = 1; i <= 3; i++) {
      clipList2.add({ ...clipFromTwitch, id: 'test3', submitters: [`submitter${i}`] })
    }
    const clipListArray2 = clipList2.toArray()
    expect(clipListArray2[0]?.id).toEqual('test2')
    expect(clipListArray2[1]?.id).toEqual('test')
    expect(clipListArray2[2]?.id).toEqual('test3')
  })

  it('sorts the list of clips based on number of submitters then the time submitted', () => {
    const clipList2 = new ClipList()
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ ...clipFromTwitch, id: 'test', submitters: [`submitter${i}`] })
    }
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ ...clipFromTwitch, id: 'test2', submitters: [`submitter${i}`] })
    }
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ ...clipFromTwitch, id: 'test3', submitters: [`submitter${i}`] })
    }
    const clipListArray2 = clipList2.toArray()
    expect(clipListArray2[0]?.id).toEqual('test')
    expect(clipListArray2[1]?.id).toEqual('test2')
    expect(clipListArray2[2]?.id).toEqual('test3')
  })

  it('can remove multiple clips when removing based on submitter', () => {
    const clipList2 = new ClipList()
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ ...clipFromTwitch, id: `test${i}`, submitters: ['s'] })
    }
    expect(clipList2.size()).toEqual(10)
    clipList2.removeBySubmitter('s')
    expect(clipList2.size()).toEqual(0)
  })

  it('does not care about case of the submitter when removing based on a submitter', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    expect(clipList2.size()).toEqual(1)
    clipList2.removeBySubmitter('S')
    expect(clipList2.size()).toEqual(0)
  })

  it('does not care about case of submitter when removing clip', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    expect(clipList2.size()).toEqual(1)
    clipList2.remove({ ...clipFromTwitch, id: 'test', submitters: ['S'] })
    expect(clipList2.size()).toEqual(0)
  })

  it('does not add the same submitter to a clip twice', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    clipList2.add({ ...clipFromTwitch, id: 'test', submitters: ['S'] })
    clipList2.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    expect(clipList2.size()).toEqual(1)
    expect(clipList2.toArray()[0]?.submitters?.length).toEqual(1)
  })

  it('adds multiple clips with the same id if they are from different providers', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, id: 'test', submitters: ['s'] })
    clipList2.add({ ...clipFromKick, id: 'test', submitters: ['S'] })
    expect(clipList2.size()).toEqual(2)
    expect(clipList2.toArray()[0]?.id).toEqual(clipList2.toArray()[1]?.id)
    expect(clipList2.toArray()[0]?.provider).toEqual(ClipProvider.TWITCH)
    expect(clipList2.toArray()[1]?.provider).toEqual(ClipProvider.KICK)
  })

  it('can remove clips based on the provider of the clip', () => {
    const clipList2 = new ClipList()
    clipList2.add({ ...clipFromTwitch, id: 'test' })
    clipList2.add({ ...clipFromTwitch, id: 'test2' })
    clipList2.add({ ...clipFromTwitch, id: 'test3' })
    expect(clipList2.size()).toEqual(3)
    clipList2.add({ ...clipFromKick, id: 'test4' })
    clipList2.add({ ...clipFromKick, id: 'test5' })
    expect(clipList2.size()).toEqual(5)
    clipList2.removeByProvider(ClipProvider.KICK)
    expect(clipList2.size()).toEqual(3)
    expect(clipList2.toArray().some((c) => c.provider === ClipProvider.KICK)).toEqual(false)
  })
})
