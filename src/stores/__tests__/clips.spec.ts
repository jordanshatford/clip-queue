import type { Clip } from "@/interfaces/clips"
import { clips } from "@/stores/clips"

describe("clips.ts", () => {
  const clip = {
    id: "test",
    submitter: "jordan",
    title: "Test title",
    channel: "testchannel",
    game: "testgame",
    timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
    url: "https://www.twitch.tv/test",
    thumbnailUrl: "test",
  } as Clip

  const clip2 = {
    id: "test2",
    submitter: "jordan2",
    title: "Test title 2",
    channel: "testchannel2",
    game: "testgame2",
    timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
    url: "https://www.twitch.tv/test2",
    thumbnailUrl: "test2",
  } as Clip

  beforeEach(() => {
    clips.reset()
    expect(clips.queue.open).toEqual(true)
    expect(clips.queue.current).toEqual(undefined)
    expect(clips.queue.upcoming.size()).toEqual(0)
    expect(clips.queue.upcoming.toArray()).toEqual([])
    expect(clips.queue.history.size()).toEqual(0)
    expect(clips.queue.history.toArray()).toEqual([])
  })

  it("adds a clip to the queue", () => {
    const queueLength = clips.queue.upcoming.size()
    clips.addClip(clip)
    expect(clips.queue.upcoming.size()).toEqual(queueLength + 1)
    expect(clips.queue.upcoming.includes(clip)).toEqual(true)
  })

  it("skips duplicate clips when adding to the queue", () => {
    const queueLength = clips.queue.upcoming.size()
    clips.addClip(clip)
    expect(clips.queue.upcoming.size()).toEqual(queueLength + 1)
    expect(clips.queue.upcoming.toArray()).toContainEqual(clip)
    clips.addClip(clip)
    expect(clips.queue.upcoming.size()).toEqual(queueLength + 1)
  })

  it("can start to play a specific clip at any time", () => {
    const queueLength = clips.queue.upcoming.size()
    clips.addClip(clip)
    clips.addClip(clip2)
    expect(clips.queue.upcoming.size()).toEqual(queueLength + 2)
    clips.playNow(clip)
    expect(clips.queue.upcoming.size()).toEqual(queueLength + 1)
    expect(clips.queue.current).toEqual(clip)
    expect(clips.queue.upcoming.toArray()).toContainEqual(clip2)
    expect(clips.queue.upcoming.toArray()).not.toContainEqual(clip)
    clips.playNow(clip2)
    expect(clips.queue.upcoming.size()).toEqual(queueLength)
    expect(clips.queue.current).toEqual(clip2)
    expect(clips.queue.upcoming.toArray()).not.toContainEqual(clip2)
  })

  it("will do nothing if it trys to play a current clip that doesnt exist", () => {
    clips.addClip(clip)
    clips.addClip(clip2)
    clips.playNow({ id: "not-valid" })
    expect(clips.queue.upcoming.toArray()).toContainEqual(clip)
    expect(clips.queue.upcoming.toArray()).toContainEqual(clip2)
    expect(clips.queue.current).toEqual(undefined)
  })

  it("can remove clips when they are in the queue", () => {
    clips.addClip(clip)
    clips.addClip(clip2)
    const queueLength = clips.queue.upcoming.size()
    expect(queueLength).toEqual(2)
    clips.removeClip(clip)
    expect(clips.queue.upcoming.toArray()).not.toContainEqual(clip)
    expect(clips.queue.upcoming.size()).toEqual(queueLength - 1)
    clips.removeClip({ id: "not-valid" })
    expect(clips.queue.upcoming.size()).toEqual(queueLength - 1)
  })

  it("removes user clips from the queue", () => {
    clips.addClip(clip2)
    clips.addClip({ ...clip2, id: "other" })
    clips.addClip({ ...clip2, id: "other2" })
    clips.removeUserClips("jordan2")
    expect(clips.queue.upcoming.size()).toEqual(0)
  })

  it("opens and closes the queue properly", () => {
    clips.open()
    expect(clips.queue.open).toEqual(true)
    clips.close()
    expect(clips.queue.open).toEqual(false)
  })

  it("can go back to playing the previous clip", () => {
    clips.addClip(clip)
    clips.addClip(clip2)
    clips.next()
    expect(clips.queue.current).toEqual(clip)
    clips.next()
    expect(clips.queue.current).toEqual(clip2)
    clips.previous()
    expect(clips.queue.current).toEqual(clip)
    clips.previous()
    expect(clips.queue.current).toEqual(undefined)
  })

  it("can start playing the next clip", () => {
    clips.addClip(clip)
    clips.addClip(clip2)
    clips.next()
    expect(clips.queue.current).toEqual(clip)
    clips.next()
    expect(clips.queue.current).toEqual(clip2)
    expect(clips.queue.history.size()).toEqual(1)
  })

  it("does not add the current clip to previous when it is not defined", () => {
    clips.addClip(clip)
    clips.next()
    expect(clips.queue.history.size()).toEqual(0)
  })
})
