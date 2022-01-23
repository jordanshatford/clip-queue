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
      <p>Queue is open, start submitting clips now and they will be queued!</p>
      <Button variant="brand" v-if="clipQueue.state.queue.length > 0" @click="startViewing" class="my-5"
        >Start Viewing!</Button
      >
    </div>
    <clip-queue
      v-if="clipQueue.state.queue.length > 0"
      title="Queued Clips"
      :queue="clipQueue.state.queue"
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
import Button from "@/components/Button.vue";

export default defineComponent({
  components: {
    TwitchClipPlayer,
    ClipQueue,
    Button,
  },
  setup() {
    function startViewing() {
      clipQueue.settings.acceptingClips = false;
      clipQueue.next();
    }
    return {
      clipQueue,
      startViewing,
    };
  },
});
</script>
