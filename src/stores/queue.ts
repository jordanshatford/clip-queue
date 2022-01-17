import { Clip, ClipQueue } from "@/interfaces/clips";
import { reactive } from "vue";

const state = reactive<ClipQueue>({
  previousClip: {} as Clip,
  currentClip: {} as Clip,
  queue: [],
  allClips: [],
  acceptingClips: false,
  limitedQueue: false,
  queueClipLimit: 0,
});

function addClip(clip: Clip): void {
  const duplicateClip = state.allClips.some((c) => c.id === clip.id);
  const queueFull = state.limitedQueue && state.queue.length === state.queueClipLimit;
  if (duplicateClip || queueFull) {
    return;
  }
  state.allClips = [...state.allClips, clip];
  state.queue = [...state.queue, clip];
  if (!state.currentClip) {
    next();
  }
}

function removeClip(clip: Clip): void {
  const clipExists = state.allClips.some((c) => c.id === clip.id);
  if (!clipExists) {
    return;
  }
  state.allClips = state.allClips.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter));
  state.queue = state.queue.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter));
  if (state.currentClip?.id === clip.id && state.currentClip?.submitter === clip.submitter) {
    state.currentClip = {} as Clip;
  }
  if (state.previousClip?.id === clip.id && state.previousClip?.submitter === clip.submitter) {
    state.previousClip = {} as Clip;
  }
}

function removeUserClips(submitter: string): void {
  state.allClips = state.allClips.filter((c) => c.submitter !== submitter);
  state.queue = state.allClips.filter((c) => c.submitter !== submitter);
  if (state.currentClip?.submitter === submitter) {
    state.currentClip = {} as Clip;
  }
  if (state.previousClip?.submitter === submitter) {
    state.previousClip = {} as Clip;
  }
}

function previous(): void {
  state.currentClip = state.previousClip;
  state.previousClip = {} as Clip;
}

function next(): void {
  state.currentClip = state.queue[0];
  state.queue = state.queue.filter((c) => c.id !== state.queue[0].id);
}

function reset(): void {
  state.previousClip = {} as Clip;
  state.currentClip = {} as Clip;
  state.queue = [];
  state.allClips = [];
  state.acceptingClips = false;
  state.limitedQueue = false;
  state.queueClipLimit = 0;
}

function clear(): void {
  state.queue = [];
  state.allClips = [];
}

function setQueueLimit(limit: number): void {
  state.limitedQueue = true;
  state.queueClipLimit = limit;
}

export const clipQueue = {
  state,
  addClip,
  removeClip,
  removeUserClips,
  setQueueLimit,
  previous,
  next,
  reset,
  clear,
};
