<template>
  <div>
    <twitch-clip-player
      v-if="clipQueue.state.currentClip?.id"
      :clip="clipQueue.state.currentClip"
      :previous-disabled="clipQueue.state.previousClip?.id === undefined"
      :next-disabled="clipQueue.state.queue.length === 0"
      @previous="clipQueue.previous()"
      @next="clipQueue.next()"
    />
    <div v-else class="text-center text-gray-700 dark:text-gray-300">
      <p class="text-5xl font-extrabold text-purple-500 p-5">Queue open!</p>
      <p class="dark:text-gray-300">Start sending clips now for them to be added to the queue!</p>
      <v-button variant="brand" v-if="clipQueue.state.queue.length > 0" @click="clipQueue.next()" class="my-5"
        >Start Viewing!
      </v-button>
    </div>
    <clip-queue
      v-if="clipQueue.state.queue.length > 0"
      title="Queued Clips"
      :queue="clipQueue.state.queue"
      :is-open="clipQueue.settings.acceptingClips"
      :percent-complete="queueProgress"
      @open="clipQueue.settings.acceptingClips = true"
      @close="clipQueue.settings.acceptingClips = false"
      @remove="clipQueue.removeClip"
      @play="clipQueue.playNow"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwitchClipPlayer from "@/components/TwichClipPlayer.vue";
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
      return 100 - Math.round((clipsLeft / allClips) * 100);
    },
  },
  setup() {
    return {
      clipQueue,
    };
  },
});
</script>
