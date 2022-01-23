import { Clip, ClipQueue } from "@/interfaces/clips";
import { reactive } from "vue";

const state = reactive<ClipQueue>({
  acceptingClips: true,
  previousClip: {} as Clip,
  currentClip: {} as Clip,
  queue: [],
  allClips: [],
});

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
  state.queue = [
    state.currentClip,
    ...state.queue.filter((c) => !(c.id === clip.id && c.submitter === clip.submitter)),
  ];
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

function open(): void {
  state.acceptingClips = true;
}

function close(): void {
  state.acceptingClips = false;
}

function previous(): void {
  state.queue = [state.currentClip, ...state.queue];
  state.currentClip = state.previousClip;
  state.previousClip = {} as Clip;
}

function next(): void {
  state.previousClip = state.currentClip;
  state.currentClip = state.queue[0];
  state.queue = state.queue.filter((c) => c.id !== state.queue[0].id);
}

function clear(): void {
  state.queue = [];
  state.allClips = [];
}

export const clipQueue = {
  state,
  addClip,
  playNow,
  removeClip,
  removeUserClips,
  open,
  close,
  previous,
  next,
  clear,
};
