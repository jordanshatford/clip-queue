<template>
  <Card class="max-w-[16rem] flex-shrink-0 overflow-hidden text-left">
    <template #header>
      <div class="relative">
        <img
          class="aspect-video w-full"
          :alt="clip.title"
          :src="clip.thumbnailUrl"
          @error="emit('remove')"
        />
        <div class="absolute -bottom-6 -right-2 m-2 p-2">
          <div class="flex gap-2">
            <Button
              icon="pi pi-play"
              title="Play now"
              severity="info"
              size="small"
              @click="emit('play')"
            >
            </Button>
            <Button
              icon="pi pi-trash"
              title="Remove"
              severity="danger"
              size="small"
              @click="emit('remove')"
            >
            </Button>
          </div>
        </div>
      </div>
    </template>
    <template #title
      ><span class="font-normal text-surface-600 dark:text-surface-400">{{
        clip.title
      }}</span></template
    >
    <template #subtitle>
      <div
        v-if="clip.category"
        class="text-sm font-semibold text-surface-400 dark:text-surface-600"
      >
        {{ clip.channel
        }}<span class="text-sm font-normal text-surface-400 dark:text-surface-600"> playing </span
        >{{ clip.category }}
      </div>
      <div v-else class="text-sm font-semibold text-surface-400 dark:text-surface-600">
        {{ clip.channel }}
      </div>
    </template>
    <template #content>
      <div class="mb-2 text-sm font-normal text-surface-400 dark:text-surface-600">
        Submitter:
        <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
          clip.submitters[0]
        }}</span>
      </div>
      <ProviderName
        :provider="clip.provider"
        class="font-normal text-surface-600 dark:text-surface-400"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Clip } from '@cq/providers'
import { Button, Card } from '@cq/ui'
import ProviderName from '@/components/ProviderName.vue'

export interface Props {
  clip: Clip
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
