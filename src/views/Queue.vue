<template>
  <div>
    <twitch-clip-player
      v-if="clipQueue.state.currentClip && clipQueue.state.currentClip.id"
      :clip="clipQueue.state.currentClip"
      :previous-disabled="clipQueue.state.previousClips.isEmpty()"
      :next-disabled="clipQueue.state.queue.length === 0"
      @previous="clipQueue.previous()"
      @next="clipQueue.next()"
    />
    <div v-else class="text-center text-gray-700 dark:text-gray-300">
      <p class="text-5xl font-extrabold text-purple-500 p-5">Queue open!</p>
      <p class="dark:text-gray-300">Start sending clips now for them to be added to the queue!</p>
      <v-button v-if="clipQueue.state.queue.length > 0" variant="brand" @click="clipQueue.next()" class="my-5">
        Start Viewing!
      </v-button>
    </div>
    <clip-queue
      title="Queued Clips"
      :queue="clipQueue.state.queue"
      :is-open="clipQueue.state.acceptingClips"
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
import ClipQueue from "@/components/ClipQueue.vue";

export default defineComponent({
  components: {
    TwitchClipPlayer,
    ClipQueue,
  },
  computed: {
    queueProgress() {
      const allClips = clipQueue.state.allClips.length;
      const clipsLeft = clipQueue.state.queue.length;
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
