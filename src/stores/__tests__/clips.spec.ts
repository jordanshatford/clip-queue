import { setActivePinia, createPinia } from "pinia"
import type { Clip } from "@/interfaces/clips"
import { useClips } from "@/stores/clips"
import { ClipList } from "@/utils/clip-list"

describe("clips.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const clip = {
    id: "test",
    submitter: "jordan",
    title: "Test title",
    channel: "testchannel",
    game: "testgame",
    timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
    url: "https://www.twitch.tv/test",
    embedUrl: "https://www.twitch.tv/test",
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
    embedUrl: "https://www.twitch.tv/test2",
    thumbnailUrl: "test2",
  } as Clip

  beforeEach(() => {
    const clips = useClips()
    clips.$reset()
    expect(clips.isOpen).toEqual(true)
    expect(clips.current).toEqual(undefined)
    expect(clips.upcoming.size()).toEqual(0)
    expect(clips.upcoming.toArray()).toEqual([])
    expect(clips.history.size()).toEqual(0)
    expect(clips.history.toArray()).toEqual([])
  })

  it("adds a clip to the queue", () => {
    const clips = useClips()
    const queueLength = clips.upcoming.size()
    clips.add(clip)
    expect(clips.upcoming.size()).toEqual(queueLength + 1)
    expect(clips.upcoming.includes(clip)).toEqual(true)
  })

  it("skips duplicate clips when adding to the queue", () => {
    const clips = useClips()
    const queueLength = clips.upcoming.size()
    clips.add(clip)
    expect(clips.upcoming.size()).toEqual(queueLength + 1)
    expect(clips.upcoming.toArray()).toContainEqual(clip)
    clips.add(clip)
    expect(clips.upcoming.size()).toEqual(queueLength + 1)
  })

  it("can start to play a specific clip at any time", () => {
    const clips = useClips()
    const queueLength = clips.upcoming.size()
    clips.add(clip)
    clips.add(clip2)
    expect(clips.upcoming.size()).toEqual(queueLength + 2)
    clips.play(clip)
    expect(clips.upcoming.size()).toEqual(queueLength + 1)
    expect(clips.current).toEqual(clip)
    expect(clips.upcoming.toArray()).toContainEqual(clip2)
    expect(clips.upcoming.toArray()).not.toContainEqual(clip)
    clips.play(clip2)
    expect(clips.upcoming.size()).toEqual(queueLength)
    expect(clips.current).toEqual(clip2)
    expect(clips.upcoming.toArray()).not.toContainEqual(clip2)
  })

  it("will do nothing if it trys to play a current clip that doesnt exist", () => {
    const clips = useClips()
    clips.add(clip)
    clips.add(clip2)
    clips.play({ id: "not-valid" })
    expect(clips.upcoming.toArray()).toContainEqual(clip)
    expect(clips.upcoming.toArray()).toContainEqual(clip2)
    expect(clips.current).toEqual(undefined)
  })

  it("can remove clips when they are in the queue", () => {
    const clips = useClips()
    clips.add(clip)
    clips.add(clip2)
    const queueLength = clips.upcoming.size()
    expect(queueLength).toEqual(2)
    clips.remove(clip)
    expect(clips.upcoming.toArray()).not.toContainEqual(clip)
    expect(clips.upcoming.size()).toEqual(queueLength - 1)
    clips.remove({ id: "not-valid" })
    expect(clips.upcoming.size()).toEqual(queueLength - 1)
  })

  it("removes user clips from the queue", () => {
    const clips = useClips()
    clips.add(clip2)
    clips.add({ ...clip2, id: "other" })
    clips.add({ ...clip2, id: "other2" })
    clips.removeSubmitterClips("jordan2")
    expect(clips.upcoming.size()).toEqual(0)
  })

  it("opens and closes the queue properly", () => {
    const clips = useClips()
    clips.open()
    expect(clips.isOpen).toEqual(true)
    clips.close()
    expect(clips.isOpen).toEqual(false)
  })

  it("can go back to playing the previous clip", () => {
    const clips = useClips()
    clips.add(clip)
    clips.add(clip2)
    clips.next()
    expect(clips.current).toEqual(clip)
    clips.next()
    expect(clips.current).toEqual(clip2)
    clips.previous()
    expect(clips.current).toEqual(clip)
    clips.previous()
    expect(clips.current).toEqual(undefined)
  })

  it("can start playing the next clip", () => {
    const clips = useClips()
    clips.add(clip)
    clips.add(clip2)
    clips.next()
    expect(clips.current).toEqual(clip)
    clips.next()
    expect(clips.current).toEqual(clip2)
    expect(clips.history.size()).toEqual(1)
  })

  it("does not add the current clip to previous when it is not defined", () => {
    const clips = useClips()
    clips.add(clip)
    clips.next()
    expect(clips.history.size()).toEqual(0)
  })

  it("returns the current progress of the queue", () => {
    const clips = useClips()
    expect(clips.queueProgress).toEqual(0)
    clips.$reset()
    clips.current = {} as Clip
    clips.history = new ClipList({} as Clip)
    clips.upcoming = new ClipList({} as Clip)
    expect(clips.history.size()).toEqual(1)
    expect(clips.upcoming.size()).toEqual(1)
    expect(clips.queueProgress).toEqual(50)
    clips.$reset()
    clips.current = {} as Clip
    clips.history = new ClipList({} as Clip)
    clips.upcoming = new ClipList({} as Clip, { id: "2" } as Clip)
    expect(clips.history.size()).toEqual(1)
    expect(clips.upcoming.size()).toEqual(2)
    expect(clips.queueProgress).toEqual(33)
    clips.$reset()
    clips.current = { id: "test" } as Clip
    clips.history = new ClipList({} as Clip)
    clips.upcoming = new ClipList({} as Clip, { id: "2" } as Clip)
    expect(clips.queueProgress).toEqual(50)
  })
})
