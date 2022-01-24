import { Clip, ClipQueue } from "@/interfaces/clips";
import { reactive } from "vue";
import { Stack } from "@/utils/stack";

const state = reactive<ClipQueue>({
  acceptingClips: true,
  previousClips: new Stack<Clip>(),
  currentClip: {} as Clip,
  queue: [],
  allClips: [],
});

function reset(): void {
  state.acceptingClips = true;
  state.previousClips = new Stack<Clip>();
  state.currentClip = {} as Clip;
  state.queue = [];
  state.allClips = [];
}

function addClip(clip: Clip): void {
  const duplicateClip = state.allClips.some((c) => c.id === clip.id);
  if (duplicateClip || !state.acceptingClips) {
    return;
  }
  state.allClips = [...state.allClips, clip];
  state.queue = [...state.queue, clip];
}

function playNow(clip: Clip): void {
  const clipExists = state.allClips.some((c) => c.id === clip.id);
  if (!clipExists) {
    return;
  }

  if (state.currentClip.id) {
    state.queue = [
      state.currentClip,
      ...state.queue.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter)),
    ];
  } else {
    state.queue = [...state.queue.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter))];
  }
  state.currentClip = clip;
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
  const previousClipsFiltered = state.previousClips
    .toArray()
    .filter((c) => !(c.id === clip.id && c.submitter === clip.submitter));
  state.previousClips = new Stack<Clip>(...previousClipsFiltered);
}

function removeUserClips(submitter: string): void {
  state.allClips = state.allClips.filter((c) => c.submitter !== submitter);
  state.queue = state.queue.filter((c) => c.submitter !== submitter);
  if (state.currentClip?.submitter === submitter) {
    state.currentClip = {} as Clip;
  }
  const previousClipsFiltered = state.previousClips.toArray().filter((c) => c.submitter !== submitter);
  state.previousClips = new Stack<Clip>(...previousClipsFiltered);
}

function open(): void {
  state.acceptingClips = true;
}

function close(): void {
  state.acceptingClips = false;
}

function previous(): void {
  state.queue = [state.currentClip, ...state.queue];
  const previousClip = state.previousClips.pop();
  if (previousClip) {
    state.currentClip = previousClip;
  } else {
    state.currentClip = {} as Clip;
  }
}

function next(): void {
  // We dont want to push to previous if this is the first clip ever queued
  if (clipQueue.state.currentClip?.id) {
    state.previousClips.push(state.currentClip);
  }
  state.currentClip = state.queue[0];
  state.queue = state.queue.filter((c) => c.id !== state.queue[0].id);
}

export const clipQueue = {
  state,
  reset,
  addClip,
  playNow,
  removeClip,
  removeUserClips,
  open,
  close,
  previous,
  next,
};
