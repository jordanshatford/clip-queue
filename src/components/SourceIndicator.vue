<template>
  <i v-tooltip="statusTranslations[status]()" :class="`pi pi-circle-fill ${color}`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { m } from '@/paraglide/messages'
import { ClipSourceStatus } from '@/sources'

export interface Props {
  status: ClipSourceStatus
}

const { status } = defineProps<Props>()

const statusTranslations: Record<ClipSourceStatus, () => string> = {
  [ClipSourceStatus.ERROR]: m.error,
  [ClipSourceStatus.CONNECTED]: m.connected,
  [ClipSourceStatus.DISCONNECTED]: m.disconnected,
  [ClipSourceStatus.UNKNOWN]: m.unknown,
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
