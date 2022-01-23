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
  acceptingClips: boolean;
  previousClip: Clip;
  currentClip: Clip;
  queue: Clip[];
  allClips: Clip[];
}
