<template>
  <div>
    <twitch-clip-player
      v-if="clipQueue.queue.current && clipQueue.queue.current.id"
      :clip="clipQueue.queue.current"
      :previous-disabled="clipQueue.queue.history.empty()"
      :next-disabled="clipQueue.queue.upcoming.empty()"
      @previous="clipQueue.previous()"
      @next="clipQueue.next()"
    />
    <div v-else class="text-center text-gray-700 dark:text-gray-300">
      <p class="text-5xl font-extrabold text-purple-500 p-5">Queue open!</p>
      <p class="dark:text-gray-300">Start sending clips now for them to be added to the queue!</p>
      <v-button v-if="!clipQueue.queue.upcoming.empty()" variant="brand" @click="clipQueue.next()" class="my-5">
        Start Viewing!
      </v-button>
    </div>
    <clip-queue
      title="Queued Clips"
      :clips="clipQueue.queue.upcoming.toArray()"
      :is-open="clipQueue.queue.open"
      :percent-complete="queueProgress"
      @open="clipQueue.open()"
      @close="clipQueue.close()"
      @remove="clipQueue.removeClip"
      @play="clipQueue.playNow"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwitchClipPlayer from "@/components/TwitchClipPlayer.vue";
import { clipQueue } from "@/stores/queue";
import ClipQueue from "@/components/queue/ClipQueue.vue";

export default defineComponent({
  components: {
    TwitchClipPlayer,
    ClipQueue,
  },
  computed: {
    queueProgress() {
      const currentClip = clipQueue?.queue.current?.id ? 1 : 0;
      const allClips = clipQueue.queue.history.size() + clipQueue.queue.upcoming.size() + currentClip;
      const clipsLeft = clipQueue.queue.upcoming.size();
      const progress = 100 - Math.round((clipsLeft / allClips) * 100);
      return isNaN(progress) ? 0 : progress;
    },
  },
  setup() {
    return {
      clipQueue,
    };
  },
});
</script>
