<template>
  <div class="cq-text bg-zinc-200 dark:bg-zinc-700 inline-flex items-center text-sm rounded-lg">
    <span class="mx-2 my-1 truncate max-w-xs mx-auto"><slot></slot></span>
    <button
      v-if="dismissable"
      type="button"
      @click="emit('dismiss')"
      class="w-5 h-5 mr-1 inline-block align-middle hover:text-red-500 dark:hover:text-red-500"
    >
      <XMarkIcon class="fill-current" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline"

export interface Props {
  dismissable?: boolean
}

withDefaults(defineProps<Props>(), { dismissable: false })

const emit = defineEmits<{ (e: "dismiss"): void }>()
</script>
