<template>
  <div class="player player-container">
    <div class="w-full h-auto bg-black player player-container">
      <iframe
        v-if="clip.id"
        :src="`${clip.embedUrl}&autoplay=${autoplay}&parent=${hostname}`"
        :title="clip.title"
        class="w-full h-auto bg-black player"
        allowfullscreen
      ></iframe>
    </div>
    <div class="text-left">
      <h2 class="cq-text font-bold text-2xl mt-2 mb-1">
        {{ clip.title }}
        <span v-if="clip.url">
          <a
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            className="cq-text-subtle text-lg no-underline hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <ArrowTopRightOnSquareIcon class="w-6 inline-block mb-3" />
          </a>
        </span>
        <div class="text-base float-right">
          <BaseButton :disabled="previousDisabled" class="mr-2" @click="emit('previous')">
            <BackwardIcon class="w-8" />
          </BaseButton>
          <BaseButton :disabled="nextDisabled" @click="emit('next')">
            <ForwardIcon class="w-8" />
          </BaseButton>
        </div>
      </h2>
      <div class="cq-text-subtle">
        <span v-if="clip.channel && clip.game">
          <span className="cq-text-subtle-semibold">{{ clip.channel }}</span>
          playing
          <span className="cq-text-subtle-semibold">{{ clip.game }}</span>
        </span>
        <span v-if="timeAgo">
          - clipped
          <span className="cq-text-subtle-semibold">{{ timeAgo }}</span>
          ago
        </span>
        <span v-if="clip.submitter">
          - Submitted by
          <span className="cq-text-subtle-semibold">{{ clip.submitter }}</span>
          <span v-if="clip.source && clip.source !== ClipSource.Unknown">
            from
            <span className="cq-text-subtle-semibold">{{ clip.source }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ArrowTopRightOnSquareIcon, BackwardIcon, ForwardIcon } from "@heroicons/vue/24/outline"
import { formatDistanceToNow, parseISO } from "date-fns"
import { ClipSource, type Clip } from "@/interfaces/clips"

export interface Props {
  clip: Clip
  autoplay?: boolean
  previousDisabled?: boolean
  nextDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  previousDisabled: false,
  nextDisabled: false,
})

const emit = defineEmits<{
  (e: "previous"): void
  (e: "next"): void
}>()

const timeAgo = computed<string>(() => {
  if (props.clip?.timestamp) {
    return formatDistanceToNow(parseISO(props.clip.timestamp))
  }
  return ""
})

const hostname = window.location.hostname
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
