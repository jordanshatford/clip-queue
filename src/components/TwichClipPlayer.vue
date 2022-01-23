<template>
  <div class="w-full h-auto bg-black player player-container">
    <iframe
      v-if="clip?.id"
      :src="`${baseURL}?clip=${clip?.id}&${paramsString}`"
      :title="clip?.title ?? ''"
      class="w-full h-auto bg-black player"
      allowfullscreen
    ></iframe>
  </div>
  <div>
    <h2 class="font-bold text-2xl mt-2 mb-1 text-gray-700 dark:text-gray-400">
      {{ clip?.title ?? "" }}
      <span v-if="clip?.url">
        <sup>
          <a
            :href="clip?.url"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 dark:text-gray-700 no-underline hover:text-gray-400 dark:hover:text-gray-200"
          >
            &#x1F5D7;
          </a>
        </sup>
      </span>
      <div class="text-base float-right">
        <Button :disabled="previousDisabled" class="mr-2" @click="$emit('previous')">
          <v-icon icon="backward" />
        </Button>
        <Button :disabled="nextDisabled" @click="$emit('next')">
          <v-icon icon="forward" />
        </Button>
      </div>
    </h2>
    <div class="text-gray-500 text-sm font-normal">
      <span v-if="clip?.channel && clip?.game">
        <span className="font-bold">{{ clip?.channel }}</span>
        playing
        <span className="font-bold">{{ clip?.game }}</span>
      </span>
      <span v-if="clip?.timestamp">
        - clipped
        <span className="font-bold">{{ formatDistanceToNow(parseISO(props.clip.timestamp as string)) }}</span>
        ago
      </span>
      <span v-if="clip?.submitter">
        - Submitted by
        <span className="font-bold">{{ clip?.submitter }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Clip } from "@/interfaces/clips";
import config from "@/config";
import Button from "@/components/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  props: {
    clip: {
      type: Object as PropType<Clip>,
      required: true,
    },
    previousDisabled: {
      type: Boolean,
      default: false,
    },
    nextDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["previous", "next"],
  setup(props) {
    const { baseURL, paramsString } = config.Twitch.Clips.Embeded;
    return {
      baseURL,
      paramsString,
      props,
      formatDistanceToNow,
      parseISO,
    };
  },
});
</script>

<style>
.player-container {
  grid-area: player;
}

.player {
  aspect-ratio: 16 / 9;
  max-height: calc(100vh - 8rem);
}
</style>
