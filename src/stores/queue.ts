import { Clip, ClipQueue } from "@/interfaces/clips";
import { reactive } from "vue";

const state = reactive<ClipQueue>({
  currentClip: undefined,
  queue: [],
  allClips: [],
  acceptingClips: false,
  queueClipLimit: -1,
});

function addClip(clip: Clip): void {
  const duplicateClip = state.allClips.some((c) => c.id === clip.id);
  const queueFull = state.queue.length === state.queueClipLimit;
  if (duplicateClip || queueFull) {
    return;
  }
  state.allClips = [...state.allClips, clip];
  state.queue = [...state.queue, clip];
}

function removeClip(clip: Clip): void {
  const clipExists = state.allClips.some((c) => c.id === clip.id);
  if (!clipExists) {
    return;
  }
  state.allClips = state.allClips.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter));
  state.queue = state.queue.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter));
  if (state.currentClip?.id === clip.id && state.currentClip?.submitter === clip.submitter) {
    state.currentClip = undefined;
  }
}

function removeUserClips(submitter: string): void {
  state.allClips = state.allClips.filter((c) => c.submitter !== submitter);
  state.queue = state.allClips.filter((c) => c.submitter !== submitter);
  if (state.currentClip?.submitter === submitter) {
    state.currentClip = undefined;
  }
}

function next(): void {
  state.currentClip = state.queue[0];
  state.queue = state.queue.filter((c) => c.id !== state.queue[0].id);
}

function reset(): void {
  state.currentClip = undefined;
  state.queue = [];
  state.allClips = [];
  state.acceptingClips = false;
  state.queueClipLimit = 0;
}

function clear(): void {
  state.queue = [];
  state.allClips = [];
}

function setQueueLimit(limit: number): void {
  state.queueClipLimit = limit;
}

export const clipQueue = {
  state,
  addClip,
  removeClip,
  removeUserClips,
  setQueueLimit,
  next,
  reset,
  clear,
};
