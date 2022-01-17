export interface Clip {
  id?: string;
  title?: string;
  channel?: string;
  game?: string;
  timestamp?: string;
  submitter?: string;
  url?: string;
  thumbnailUrl?: string;
}

export interface ClipQueue {
  previousClip: Clip;
  currentClip: Clip;
  queue: Clip[];
  allClips: Clip[];
}

export interface ClipQueueSettings {
  acceptingClips: boolean;
  limitedQueue: boolean;
  queueClipLimit: number;
}
