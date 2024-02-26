<template>
  <div class="cq-text inline-flex items-center rounded-xl bg-zinc-200 text-sm dark:bg-zinc-700">
    <span class="mx-2 mx-auto my-1 max-w-xs truncate px-2"><slot></slot></span>
    <button
      v-if="dismissable"
      type="button"
      @click="emit('dismiss')"
      class="mr-1 inline-block h-5 w-5 align-middle hover:text-red-500 dark:hover:text-red-500"
    >
      <XMarkIcon class="fill-current" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@/assets/icons'

export interface Props {
  dismissable?: boolean
}

withDefaults(defineProps<Props>(), { dismissable: false })

const emit = defineEmits<{ (e: 'dismiss'): void }>()
</script>
