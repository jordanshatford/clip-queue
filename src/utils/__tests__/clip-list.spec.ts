import { describe, it, expect, beforeEach } from "vitest"
import type { Clip } from "../../interfaces/clips"
import { ClipList } from "../clip-list"

describe("clip-list.ts", () => {
  let clipList: ClipList
  let randomNumber: number
  const startNumber = 1

  beforeEach(() => {
    clipList = new ClipList()
    randomNumber = Math.floor(Math.random() * 25) + 5
    for (let i = startNumber; i <= randomNumber; i++) {
      clipList.add({ id: `test-id-${i}`, submitter: "test" })
    }
  })

  it("can be constructed with clips", () => {
    const clipList2 = new ClipList({ id: "1" }, { id: "2" })
    expect(clipList2.size()).toEqual(2)
    expect(clipList2.shift()?.id).toEqual("1")
    expect(clipList2.shift()?.id).toEqual("2")
  })

  it("can have clips added to it", () => {
    expect(clipList.size()).toEqual(randomNumber)
    clipList.add({ id: "test-id-push", submitter: "test" })
    expect(clipList.size()).toEqual(randomNumber + 1)
    expect(clipList.pop()?.id).toEqual("test-id-push")
  })

  it("can have clips unshifted to it", () => {
    expect(clipList.size()).toEqual(randomNumber)
    clipList.unshift({ id: "test-id-push" })
    expect(clipList.size()).toEqual(randomNumber + 1)
    expect(clipList.shift()?.id).toEqual("test-id-push")
  })

  it("can have clips popped from it", () => {
    expect(clipList.pop()?.id).toEqual(`test-id-${randomNumber}`)
    expect(clipList.size()).toEqual(randomNumber - 1)
  })

  it("can have clips shifted from it", () => {
    expect(clipList.shift()?.id).toEqual(`test-id-${startNumber}`)
    expect(clipList.size()).toEqual(randomNumber - 1)
  })

  it("can have clips removed from it", () => {
    expect(clipList.includes({ id: `test-id-${startNumber}` })).toEqual(true)
    clipList.remove({ id: `test-id-${startNumber}`, submitter: "test" })
    expect(clipList.includes({ id: `test-id-${startNumber}` })).toEqual(false)
  })

  it("can return if it has a clip", () => {
    expect(clipList.includes({ id: `test-id-${startNumber}` })).toEqual(true)
  })

  it("return undefined when no value can be popped from it", () => {
    const clipList2 = new ClipList()
    expect(clipList2.empty()).toBeTruthy()
    expect(clipList2.pop()).toEqual(undefined)
  })

  it("return undefined when no value can be shifted from it", () => {
    const clipList2 = new ClipList()
    expect(clipList2.empty()).toBeTruthy()
    expect(clipList2.shift()).toEqual(undefined)
  })

  it("can check the size of the clip list", () => {
    expect(clipList.size()).toEqual(randomNumber)
    const testClipList = new ClipList()
    expect(testClipList.size()).toEqual(0)
    const randomNumber2 = Math.floor(Math.random() * 25) + 5
    for (let i = 1; i <= randomNumber2; i++) {
      testClipList.add({ id: `${i}` })
      expect(testClipList.size()).toEqual(i)
    }
    expect(testClipList.size()).toEqual(randomNumber2)
  })

  it("can check if the clip list is empty", () => {
    expect(clipList.empty()).toBeFalsy()
    const testClipList = new ClipList()
    expect(testClipList.empty()).toBeTruthy()
  })

  it("can convert the clip list to an array", () => {
    const clipListArray = clipList.toArray()
    expect(clipListArray.length).toEqual(clipList.size())
    clipListArray.every((clip) => expect(typeof clip).toEqual("object"))
  })

  it("can have clips removed from it based on submitter when the clip has one submitter", () => {
    const clipWithSubmitter = { id: "withuser", submitter: "jordan" }
    expect(clipList.includes(clipWithSubmitter)).toEqual(false)
    clipList.add(clipWithSubmitter)
    expect(clipList.includes(clipWithSubmitter)).toEqual(true)
    clipList.removeBySubmitter("jordan")
    expect(clipList.includes(clipWithSubmitter)).toEqual(false)
  })

  it("can add multiple submitters for the same clip", () => {
    const clip = { id: "test", submitter: "testsubmitter" } as Clip
    const clipList2 = new ClipList()
    clipList2.add(clip)
    clipList2.add({ ...clip, submitter: "testsubmitter2" })
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitter).toEqual("testsubmitter")
    expect(queuedClip?.submitters?.length).toEqual(2)
    expect(queuedClip?.submitters).toContain("testsubmitter")
    expect(queuedClip?.submitters).toContain("testsubmitter2")
  })

  it("can remove by submitter the first submitter from a clip which has multiple submitters", () => {
    const clip = { id: "test", submitter: "testsubmitter" } as Clip
    const clipList2 = new ClipList()
    clipList2.add(clip)
    clipList2.add({ ...clip, submitter: "testsubmitter2" })
    expect(clipList2.size()).toEqual(1)
    clipList2.removeBySubmitter("testsubmitter")
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitter).toEqual("testsubmitter2")
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain("testsubmitter")
    expect(queuedClip?.submitters).toContain("testsubmitter2")
  })

  it("can remove by submitter the second submitter from a clip which has multiple submitters", () => {
    const clip = { id: "test", submitter: "testsubmitter" } as Clip
    const clipList2 = new ClipList()
    clipList2.add(clip)
    clipList2.add({ ...clip, submitter: "testsubmitter2" })
    expect(clipList2.size()).toEqual(1)
    clipList2.removeBySubmitter("testsubmitter2")
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitter).toEqual("testsubmitter")
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain("testsubmitter2")
    expect(queuedClip?.submitters).toContain("testsubmitter")
  })

  it("can remove the first submitter from a clip which has multiple submitters", () => {
    const clip = { id: "test", submitter: "testsubmitter" } as Clip
    const clipList2 = new ClipList()
    clipList2.add(clip)
    clipList2.add({ ...clip, submitter: "testsubmitter2" })
    expect(clipList2.size()).toEqual(1)
    clipList2.remove({ ...clip, submitter: "testsubmitter2" })
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitter).toEqual("testsubmitter")
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain("testsubmitter2")
    expect(queuedClip?.submitters).toContain("testsubmitter")
  })

  it("can remove the second submitter from a clip which has multiple submitters", () => {
    const clip = { id: "test", submitter: "testsubmitter" } as Clip
    const clipList2 = new ClipList()
    clipList2.add(clip)
    clipList2.add({ ...clip, submitter: "testsubmitter2" })
    expect(clipList2.size()).toEqual(1)
    clipList2.remove({ id: "test", submitter: "testsubmitter" })
    expect(clipList2.size()).toEqual(1)
    const queuedClip = clipList2.pop()
    expect(queuedClip?.submitter).toEqual("testsubmitter2")
    expect(queuedClip?.submitters?.length).toEqual(1)
    expect(queuedClip?.submitters).not.toContain("testsubmitter")
    expect(queuedClip?.submitters).toContain("testsubmitter2")
  })

  it("sorts the list of clips based on number of submitters", () => {
    const clipList2 = new ClipList()
    for (let i = 1; i <= 8; i++) {
      clipList2.add({ id: "test", submitter: `submitter${i}` })
    }
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ id: "test2", submitter: `submitter${i}` })
    }
    for (let i = 1; i <= 3; i++) {
      clipList2.add({ id: "test3", submitter: `submitter${i}` })
    }
    const clipListArray2 = clipList2.toArray()
    expect(clipListArray2[0]?.id).toEqual("test2")
    expect(clipListArray2[1]?.id).toEqual("test")
    expect(clipListArray2[2]?.id).toEqual("test3")
  })

  it("sorts the list of clips based on number of submitters then the time submitted", () => {
    const clipList2 = new ClipList()
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ id: "test", submitter: `submitter${i}` })
    }
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ id: "test2", submitter: `submitter${i}` })
    }
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ id: "test3", submitter: `submitter${i}` })
    }
    const clipListArray2 = clipList2.toArray()
    expect(clipListArray2[0]?.id).toEqual("test")
    expect(clipListArray2[1]?.id).toEqual("test2")
    expect(clipListArray2[2]?.id).toEqual("test3")
  })

  it("can remove multiple clips when removing based on submitter", () => {
    const clipList2 = new ClipList()
    for (let i = 1; i <= 10; i++) {
      clipList2.add({ id: `test${i}`, submitter: "s" })
    }
    expect(clipList2.size()).toEqual(10)
    clipList2.removeBySubmitter("s")
    expect(clipList2.size()).toEqual(0)
  })

  it("does not care about case of the submitter when removing based on a submitter", () => {
    const clipList2 = new ClipList()
    clipList2.add({ id: "test", submitter: "s" })
    expect(clipList2.size()).toEqual(1)
    clipList2.removeBySubmitter("S")
    expect(clipList2.size()).toEqual(0)
  })

  it("does not care about case of submitter when removing clip", () => {
    const clipList2 = new ClipList()
    clipList2.add({ id: "test", submitter: "s" })
    expect(clipList2.size()).toEqual(1)
    clipList2.remove({ id: "test", submitter: "S" })
    expect(clipList2.size()).toEqual(0)
  })

  it("does not add the same submitter to a clip twice", () => {
    const clipList2 = new ClipList()
    clipList2.add({ id: "test", submitter: "s" })
    clipList2.add({ id: "test", submitter: "S" })
    clipList2.add({ id: "test", submitter: "s" })
    expect(clipList2.size()).toEqual(1)
    expect(clipList2.toArray()[0].submitters?.length).toEqual(1)
  })
})
