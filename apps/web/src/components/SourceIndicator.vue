<template>
  <InputIcon v-tooltip="statusTranslations[status]" :class="`pi pi-circle-fill ${color}`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { ClipSourceStatus } from '@cq/sources'
import { InputIcon } from '@cq/ui'

export interface Props {
  status: ClipSourceStatus
}

const { status } = defineProps<Props>()

const statusTranslations: Record<ClipSourceStatus, string> = {
  Error: 'Error',
  Connected: 'Connected',
  Disconnected: 'Disconnected',
  Unknown: 'Unknown'
}

const color = computed(() => {
  switch (status) {
    case ClipSourceStatus.ERROR:
    case ClipSourceStatus.DISCONNECTED:
      return 'text-red-600 dark:text-red-500'
    case ClipSourceStatus.CONNECTED:
      return 'text-green-600 dark:text-green-500'
    case ClipSourceStatus.UNKNOWN:
    default:
      return 'text-yellow-600 dark:text-yellow-500'
  }
})
</script>
