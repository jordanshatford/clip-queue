<template>
  <div class="cq-card max-w-[16rem] flex-shrink-0 overflow-hidden text-left">
    <div
      class="flex h-36 w-full items-end justify-end bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <span v-if="inQueue">
        <BaseButton title="Play now" class="-mb-2 mr-2 pb-2" @click="emit('play')">
          <BarsArrowUpIcon class="w-6" />
        </BaseButton>
        <BaseButton title="Remove" variant="danger" class="-mb-2 mr-2 pb-2" @click="emit('remove')">
          <TrashIcon class="w-6" />
        </BaseButton>
      </span>
      <span v-else>
        <BaseButton title="Add to queue" class="-mb-2 mr-2 pb-2" @click="emit('add')">
          <PlusIcon class="w-6" />
        </BaseButton>
      </span>
    </div>
    <div class="p-3">
      <span class="cq-text mt-2">{{ clip.title }}</span>
      <h3 class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.game }}
      </h3>
      <div class="cq-text-subtle mt-1">
        Submitter: <span class="cq-text-subtle-semibold">{{ clip.submitter }}</span>
      </div>
      <div class="cq-text-subtle mt-1">
        Source: <span class="cq-text-subtle-semibold">{{ clip.source ?? ClipSource.UNKNOWN }}</span>
      </div>
      <div class="cq-text-subtle mt-1">
        Provider:
        <span class="cq-text-subtle-semibold">{{ clip.provider ?? ClipSource.UNKNOWN }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarsArrowUpIcon, TrashIcon, PlusIcon } from '@/assets/icons'
import { ClipSource, type Clip } from '@/interfaces/clips'

export interface Props {
  clip: Clip
  inQueue?: boolean
}

withDefaults(defineProps<Props>(), { inQueue: false })

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
