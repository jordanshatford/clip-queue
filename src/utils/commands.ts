import { clipQueue } from "@/stores/queue";

export const commands: Record<string, () => void> = {
  queueprev: () => clipQueue.previous(),
  queuenext: () => clipQueue.next(),
  queueopen: () => clipQueue.open(),
  queueclose: () => clipQueue.close(),
};
