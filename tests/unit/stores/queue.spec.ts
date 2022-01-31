import { Clip } from "@/interfaces/clips";
import { clipQueue } from "@/stores/queue";

describe("queue.ts", () => {
  const clip = {
    id: "test",
    submitter: "jordan",
    title: "Test title",
    channel: "testchannel",
    game: "testgame",
    timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
    url: "https://www.twitch.tv/test",
    thumbnailUrl: "test",
  } as Clip;

  const clip2 = {
    id: "test2",
    submitter: "jordan2",
    title: "Test title 2",
    channel: "testchannel2",
    game: "testgame2",
    timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
    url: "https://www.twitch.tv/test2",
    thumbnailUrl: "test2",
  } as Clip;

  beforeEach(() => {
    clipQueue.reset();
    expect(clipQueue.queue.open).toEqual(true);
    expect(clipQueue.queue.current).toEqual(undefined);
    expect(clipQueue.queue.upcoming.size()).toEqual(0);
    expect(clipQueue.queue.upcoming.toArray()).toEqual([]);
    expect(clipQueue.queue.history.size()).toEqual(0);
    expect(clipQueue.queue.history.toArray()).toEqual([]);
  });

  it("adds a clip to the queue", () => {
    const queueLength = clipQueue.queue.upcoming.size();
    clipQueue.addClip(clip);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength + 1);
    expect(clipQueue.queue.upcoming.includes(clip)).toEqual(true);
  });

  it("skips duplicate clips when adding to the queue", () => {
    const queueLength = clipQueue.queue.upcoming.size();
    clipQueue.addClip(clip);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength + 1);
    expect(clipQueue.queue.upcoming.toArray()).toContainEqual(clip);
    clipQueue.addClip(clip);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength + 1);
  });

  it("can start to play a specific clip at any time", () => {
    const queueLength = clipQueue.queue.upcoming.size();
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength + 2);
    clipQueue.playNow(clip);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength + 1);
    expect(clipQueue.queue.current).toEqual(clip);
    expect(clipQueue.queue.upcoming.toArray()).toContainEqual(clip2);
    expect(clipQueue.queue.upcoming.toArray()).not.toContainEqual(clip);
    clipQueue.playNow(clip2);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength);
    expect(clipQueue.queue.current).toEqual(clip2);
    expect(clipQueue.queue.upcoming.toArray()).not.toContainEqual(clip2);
  });

  it("will do nothing if it trys to play a current clip that doesnt exist", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.playNow({ id: "not-valid" });
    expect(clipQueue.queue.upcoming.toArray()).toContainEqual(clip);
    expect(clipQueue.queue.upcoming.toArray()).toContainEqual(clip2);
    expect(clipQueue.queue.current).toEqual(undefined);
  });

  it("can remove clips when they are in the queue", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    const queueLength = clipQueue.queue.upcoming.size();
    expect(queueLength).toEqual(2);
    clipQueue.removeClip(clip);
    expect(clipQueue.queue.upcoming.toArray()).not.toContainEqual(clip);
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength - 1);
    clipQueue.removeClip({ id: "not-valid" });
    expect(clipQueue.queue.upcoming.size()).toEqual(queueLength - 1);
  });

  it("removes user clips from the queue", () => {
    clipQueue.addClip(clip2);
    clipQueue.addClip({ ...clip2, id: "other" });
    clipQueue.addClip({ ...clip2, id: "other2" });
    clipQueue.removeUserClips("jordan2");
    expect(clipQueue.queue.upcoming.size()).toEqual(0);
  });

  it("opens and closes the queue properly", () => {
    clipQueue.open();
    expect(clipQueue.queue.open).toEqual(true);
    clipQueue.close();
    expect(clipQueue.queue.open).toEqual(false);
  });

  it("can go back to playing the previous clip", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.next();
    expect(clipQueue.queue.current).toEqual(clip);
    clipQueue.next();
    expect(clipQueue.queue.current).toEqual(clip2);
    clipQueue.previous();
    expect(clipQueue.queue.current).toEqual(clip);
    clipQueue.previous();
    expect(clipQueue.queue.current).toEqual(undefined);
  });

  it("can start playing the next clip", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.next();
    expect(clipQueue.queue.current).toEqual(clip);
    clipQueue.next();
    expect(clipQueue.queue.current).toEqual(clip2);
    expect(clipQueue.queue.history.size()).toEqual(1);
  });

  it("does not add the current clip to previous when it is not defined", () => {
    clipQueue.addClip(clip);
    clipQueue.next();
    expect(clipQueue.queue.history.size()).toEqual(0);
  });
});
