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
    expect(clipQueue.state.acceptingClips).toEqual(true);
    expect(clipQueue.state.previousClips.isEmpty()).toEqual(true);
    expect(clipQueue.state.currentClip).toEqual({});
    expect(clipQueue.state.queue.length).toEqual(0);
    expect(clipQueue.state.queue).toEqual([]);
    expect(clipQueue.state.allClips.length).toEqual(0);
    expect(clipQueue.state.allClips).toEqual([]);
  });

  it("adds a clip to the queue", () => {
    const queueLength = clipQueue.state.queue.length;
    clipQueue.addClip(clip);
    expect(clipQueue.state.queue.length).toEqual(queueLength + 1);
    expect(clipQueue.state.queue).toContainEqual(clip);
  });

  it("skips duplicate clips when adding to the queue", () => {
    const queueLength = clipQueue.state.queue.length;
    clipQueue.addClip(clip);
    expect(clipQueue.state.queue.length).toEqual(queueLength + 1);
    expect(clipQueue.state.queue).toContainEqual(clip);
    clipQueue.addClip(clip);
    expect(clipQueue.state.queue.length).toEqual(queueLength + 1);
  });

  it("can start to play a specific clip at any time", () => {
    const queueLength = clipQueue.state.queue.length;
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    expect(clipQueue.state.queue.length).toEqual(queueLength + 2);
    clipQueue.playNow(clip);
    expect(clipQueue.state.queue.length).toEqual(queueLength + 1);
    expect(clipQueue.state.currentClip).toEqual(clip);
    expect(clipQueue.state.queue).toContainEqual(clip2);
    expect(clipQueue.state.queue).not.toContainEqual(clip);
    clipQueue.playNow(clip2);
    expect(clipQueue.state.queue.length).toEqual(queueLength + 1);
    expect(clipQueue.state.currentClip).toEqual(clip2);
    expect(clipQueue.state.queue).toContainEqual(clip);
    expect(clipQueue.state.queue).not.toContainEqual(clip2);
  });

  it("will do nothing if it trys to play a current clip that doesnt exist", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.playNow({ id: "not-valid" });
    expect(clipQueue.state.queue).toContainEqual(clip);
    expect(clipQueue.state.queue).toContainEqual(clip2);
    expect(clipQueue.state.currentClip).toEqual({});
  });

  it("can remove clips when they are in the queue", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    const queueLength = clipQueue.state.queue.length;
    expect(queueLength).toEqual(2);
    clipQueue.removeClip(clip);
    expect(clipQueue.state.queue).not.toContainEqual(clip);
    expect(clipQueue.state.queue.length).toEqual(queueLength - 1);
    clipQueue.removeClip({ id: "not-valid" });
    expect(clipQueue.state.queue.length).toEqual(queueLength - 1);
    // clip with different submitter and same id
    clipQueue.removeClip({ id: "test2", submitter: "testusername" });
    expect(clipQueue.state.queue).toContainEqual(clip2);
    expect(clipQueue.state.queue.length).toEqual(queueLength - 1);
  });

  it("removes the current clip if it matches the clip to remove", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.playNow(clip2);
    clipQueue.removeClip(clip2);
    expect(clipQueue.state.queue).not.toContainEqual(clip2);
    expect(clipQueue.state.queue.length).toEqual(1);
    expect(clipQueue.state.currentClip).toEqual({});
  });

  it("removes previous clips if it matches the clip to remove", () => {
    clipQueue.addClip(clip2);
    clipQueue.addClip(clip);
    clipQueue.next();
    clipQueue.next();
    clipQueue.removeClip(clip2);
    expect(clipQueue.state.previousClips.toArray()).not.toContainEqual(clip2);
  });

  it("removes user clips from the queue", () => {
    clipQueue.addClip(clip2);
    clipQueue.addClip({ ...clip2, id: "other" });
    clipQueue.addClip({ ...clip2, id: "other2" });
    clipQueue.removeUserClips("jordan2");
    expect(clipQueue.state.queue.length).toEqual(0);
  });

  it("removes the current clip if it matches the users to remove", () => {
    clipQueue.addClip(clip);
    clipQueue.playNow(clip);
    clipQueue.removeUserClips("jordan");
    expect(clipQueue.state.currentClip).toEqual({});
  });

  it("removes previous clips if it matches the user to remove", () => {
    clipQueue.addClip(clip2);
    clipQueue.addClip({ ...clip2, id: "other" });
    clipQueue.addClip({ ...clip2, id: "other2" });
    clipQueue.next();
    clipQueue.next();
    clipQueue.next();
    clipQueue.next();
    clipQueue.removeUserClips("jordan2");
    expect(clipQueue.state.previousClips.toArray()).not.toContainEqual(clip2);
  });

  it("opens and closes the queue properly", () => {
    clipQueue.open();
    expect(clipQueue.state.acceptingClips).toEqual(true);
    clipQueue.close();
    expect(clipQueue.state.acceptingClips).toEqual(false);
  });

  it("can go back to playing the previous clip", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.next();
    expect(clipQueue.state.currentClip).toEqual(clip);
    clipQueue.next();
    expect(clipQueue.state.currentClip).toEqual(clip2);
    clipQueue.previous();
    expect(clipQueue.state.currentClip).toEqual(clip);
    clipQueue.previous();
    expect(clipQueue.state.currentClip).toEqual({});
  });

  it("can start playing the next clip", () => {
    clipQueue.addClip(clip);
    clipQueue.addClip(clip2);
    clipQueue.next();
    expect(clipQueue.state.currentClip).toEqual(clip);
    clipQueue.next();
    expect(clipQueue.state.currentClip).toEqual(clip2);
    expect(clipQueue.state.previousClips.size()).toEqual(1);
  });

  it("does not add the current clip to previous when it is not defined", () => {
    clipQueue.addClip(clip);
    clipQueue.next();
    expect(clipQueue.state.previousClips.size()).toEqual(0);
  });
});
