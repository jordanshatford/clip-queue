import { setActivePinia, createPinia } from "pinia"
import type { Clip } from "@/interfaces/clips"
import { useQueue } from "@/stores/queue"

describe("clips.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const clip = {
    id: "test",
    submitter: "jordan",
    submitters: ["jordan"],
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
    submitters: ["jordan2"],
    title: "Test title 2",
    channel: "testchannel2",
    game: "testgame2",
    timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
    url: "https://www.twitch.tv/test2",
    embedUrl: "https://www.twitch.tv/test2",
    thumbnailUrl: "test2",
  } as Clip

  beforeEach(() => {
    const queue = useQueue()
    queue.$reset()
    expect(queue.isOpen).toEqual(true)
    expect(queue.current).toEqual(undefined)
    expect(queue.upcoming.size()).toEqual(0)
    expect(queue.upcoming.toArray()).toEqual([])
    expect(queue.history.size()).toEqual(0)
    expect(queue.history.toArray()).toEqual([])
  })

  it("adds a clip to the queue", () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.size()
    queue.add(clip)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
    expect(queue.upcoming.includes(clip)).toEqual(true)
  })

  it("skips duplicate clips when adding to the queue", () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.size()
    queue.add(clip)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
    expect(queue.upcoming.toArray()).toContainEqual(clip)
    queue.add(clip)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
  })

  it("can start to play a specific clip at any time", () => {
    const queue = useQueue()
    const queueLength = queue.upcoming.size()
    queue.add(clip)
    queue.add(clip2)
    expect(queue.upcoming.size()).toEqual(queueLength + 2)
    queue.play(clip)
    expect(queue.upcoming.size()).toEqual(queueLength + 1)
    expect(queue.current).toEqual(clip)
    expect(queue.upcoming.toArray()).toContainEqual(clip2)
    expect(queue.upcoming.toArray()).not.toContainEqual(clip)
    queue.play(clip2)
    expect(queue.upcoming.size()).toEqual(queueLength)
    expect(queue.current).toEqual(clip2)
    expect(queue.upcoming.toArray()).not.toContainEqual(clip2)
  })

  it("will do nothing if it trys to play a current clip that doesnt exist", () => {
    const queue = useQueue()
    queue.add(clip)
    queue.add(clip2)
    queue.play({ id: "not-valid" })
    expect(queue.upcoming.toArray()).toContainEqual(clip)
    expect(queue.upcoming.toArray()).toContainEqual(clip2)
    expect(queue.current).toEqual(undefined)
  })

  it("can remove clips when they are in the queue", () => {
    const queue = useQueue()
    queue.add(clip)
    queue.add(clip2)
    const queueLength = queue.upcoming.size()
    expect(queueLength).toEqual(2)
    queue.remove(clip)
    expect(queue.upcoming.toArray()).not.toContainEqual(clip)
    expect(queue.upcoming.size()).toEqual(queueLength - 1)
    queue.remove({ id: "not-valid" })
    expect(queue.upcoming.size()).toEqual(queueLength - 1)
  })

  it("removes user clips from the queue", () => {
    const queue = useQueue()
    queue.add(clip2)
    queue.add({ ...clip2, id: "other" })
    queue.add({ ...clip2, id: "other2" })
    queue.removeSubmitterClips("jordan2")
    expect(queue.upcoming.size()).toEqual(0)
  })

  it("opens and closes the queue properly", () => {
    const queue = useQueue()
    queue.open()
    expect(queue.isOpen).toEqual(true)
    queue.close()
    expect(queue.isOpen).toEqual(false)
  })

  it("can go back to playing the previous clip", () => {
    const queue = useQueue()
    queue.add(clip)
    queue.add(clip2)
    queue.next()
    expect(queue.current).toEqual(clip)
    queue.next()
    expect(queue.current).toEqual(clip2)
    queue.previous()
    expect(queue.current).toEqual(clip)
    queue.previous()
    expect(queue.current).toEqual(undefined)
  })

  it("can start playing the next clip", () => {
    const queue = useQueue()
    queue.add(clip)
    queue.add(clip2)
    queue.next()
    expect(queue.current).toEqual(clip)
    queue.next()
    expect(queue.current).toEqual(clip2)
    expect(queue.history.size()).toEqual(1)
  })

  it("does not add the current clip to previous when it is not defined", () => {
    const queue = useQueue()
    queue.add(clip)
    queue.next()
    expect(queue.history.size()).toEqual(0)
  })
})
