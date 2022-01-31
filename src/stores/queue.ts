import { Clip, ClipQueue } from "@/interfaces/clips";
import { reactive } from "vue";
import { ClipList } from "@/utils/clip-list";

const queue = reactive<ClipQueue>({
  open: true,
  history: new ClipList(),
  current: undefined,
  upcoming: new ClipList(),
});

function reset(): void {
  queue.open = true;
  queue.history = new ClipList();
  queue.current = undefined;
  queue.upcoming = new ClipList();
}

function addClip(clip: Clip, force = false): void {
  const duplicateClip = queue?.current?.id === clip.id || queue.history.has(clip) || queue.upcoming.has(clip);
  if (duplicateClip || (!queue.open && !force)) {
    return;
  }
  queue.upcoming.add(clip);
}

function playNow(clip: Clip): void {
  const clipExists = queue.upcoming.has(clip);
  if (!clipExists) {
    return;
  }
  if (queue?.current?.id) {
    queue.history.add(queue.current);
  }
  queue.upcoming.remove(clip);
  queue.current = clip;
}

function removeClip(clip: Clip): void {
  const clipUpcoming = queue.upcoming.has(clip);
  if (!clipUpcoming) {
    return;
  }
  queue.upcoming.remove(clip);
}

function removeUserClips(submitter: string): void {
  queue.upcoming.removeBySubmitter(submitter);
}

function open(): void {
  queue.open = true;
}

function close(): void {
  queue.open = false;
}

function previous(): void {
  if (queue?.current?.id) {
    queue.upcoming.unshift(queue.current);
  }
  const previousClip = queue.history.pop();
  queue.current = previousClip;
}

function next(): void {
  if (queue?.current?.id) {
    queue.history.add(queue.current);
  }
  const nextClip = queue.upcoming.shift();
  queue.current = nextClip;
}

export const clipQueue = {
  queue,
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
