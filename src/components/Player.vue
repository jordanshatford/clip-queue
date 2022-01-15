<template>
  <div>
    <iframe
      :src="`https://clips.twitch.tv/embed?clip=${clip?.id}&autoplay=${autoplay}&parent=${hostname}`"
      :allowFullScreen="allowFullscreen"
      :title="clip?.title ?? ''"
      width="1280"
      height="720"
    ></iframe>
  </div>
  <div>
    <h2 class="font-bold text-2xl mt-2 mb-1">
      {{ clip?.title ?? "" }}
      <span v-if="clip?.url">
        <sup>
          <a
            :href="clip?.url"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 no-underline hover:text-gray-200"
          >
            &#x1F5D7;
          </a>
        </sup>
      </span>
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

export default defineComponent({
  props: {
    clip: {
      type: Object as PropType<Clip>,
      required: true,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    allowFullscreen: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const hostname = window.location.hostname;
    return {
      props,
      hostname,
      formatDistanceToNow,
      parseISO,
    };
  },
});
</script>
