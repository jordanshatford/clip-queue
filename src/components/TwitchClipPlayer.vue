<template>
  <div class="player player-container">
    <div class="w-full h-auto bg-black player player-container">
      <iframe
        v-if="clip.id"
        :src="`${baseURL}?clip=${clip.id}&${paramsString}`"
        :title="clip.title"
        class="w-full h-auto bg-black player"
        allowfullscreen
      ></iframe>
    </div>
    <div>
      <h2 class="font-bold text-2xl mt-2 mb-1 text-zinc-700 dark:text-zinc-400">
        {{ clip.title }}
        <span v-if="clip.url">
          <sup>
            <a
              :href="clip.url"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 dark:text-zinc-700 no-underline hover:text-zinc-400 dark:hover:text-zinc-200"
            >
              &#x1F5D7;
            </a>
          </sup>
        </span>
        <div class="text-base float-right">
          <v-button :disabled="previousDisabled" class="mr-2" @click="emit('previous')">
            <v-icon icon="backward" />
          </v-button>
          <v-button :disabled="nextDisabled" @click="emit('next')">
            <v-icon icon="forward" />
          </v-button>
        </div>
      </h2>
      <div class="text-zinc-500 text-sm font-normal">
        <span v-if="clip.channel && clip.game">
          <span className="font-bold">{{ clip.channel }}</span>
          playing
          <span className="font-bold">{{ clip.game }}</span>
        </span>
        <span v-if="timeAgo">
          - clipped
          <span className="font-bold">{{ timeAgo }}</span>
          ago
        </span>
        <span v-if="clip.submitter">
          - Submitted by
          <span className="font-bold">{{ clip.submitter }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps, defineEmits } from "vue"
import { formatDistanceToNow, parseISO } from "date-fns"
import type { Clip } from "@/interfaces/clips"
import config from "@/assets/config"

interface Props {
  clip: Clip
  previousDisabled?: boolean
  nextDisabled?: boolean
}

const { baseURL, paramsString } = config.Twitch.Clips.Embedded

const props = withDefaults(defineProps<Props>(), {
  previousDisabled: false,
  nextDisabled: false,
})

const emit = defineEmits<{
  (e: "previous"): void
  (e: "next"): void
}>()

const timeAgo = computed(() => {
  if (props.clip?.timestamp) {
    return formatDistanceToNow(parseISO(props.clip.timestamp))
  }
  return ""
})
</script>

<style>
.player-container {
  grid-area: player;
}

.player {
  aspect-ratio: 16 / 9;
  max-height: calc(100vh - 11rem);
}
</style>
