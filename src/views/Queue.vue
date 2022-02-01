<template>
  <div>
    <twitch-clip-player
      v-if="clips.queue.current && clips.queue.current.id"
      :clip="clips.queue.current"
      :previous-disabled="clips.queue.history.empty()"
      :next-disabled="clips.queue.upcoming.empty()"
      @previous="clips.previous()"
      @next="clips.next()"
    />
    <div v-else class="text-center text-gray-700 dark:text-gray-300">
      <p class="text-5xl font-extrabold text-purple-500 p-5">Queue open!</p>
      <p class="dark:text-gray-300">Start sending clips now for them to be added to the queue!</p>
      <v-button v-if="!clips.queue.upcoming.empty()" variant="brand" @click="clips.next()" class="my-5">
        Start Viewing!
      </v-button>
    </div>
    <clip-queue
      title="Queued Clips"
      :clips="clips.queue.upcoming.toArray()"
      :is-open="clips.queue.open"
      :percent-complete="queueProgress"
      @open="clips.open()"
      @close="clips.close()"
      @remove="clips.removeClip"
      @play="clips.playNow"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TwitchClipPlayer from "@/components/TwitchClipPlayer.vue";
import { clips } from "@/stores/clips";
import ClipQueue from "@/components/queue/ClipQueue.vue";

const queueProgress = computed(() => {
  const currentClip = clips.queue?.current?.id ? 1 : 0;
  const allClips = clips.queue.history.size() + clips.queue.upcoming.size() + currentClip;
  const clipsLeft = clips.queue.upcoming.size();
  const progress = 100 - Math.round((clipsLeft / allClips) * 100);
  return isNaN(progress) ? 0 : progress;
});
</script>
