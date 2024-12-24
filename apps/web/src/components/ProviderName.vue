<template>
  <div class="flex items-center gap-2">
    <div class="h-5">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <svg v-if="svg" class="h-5 w-5" v-html="svg"></svg>
    </div>
    <div>{{ provider }}</div>
    <i
      v-if="providers.isExperimental(provider)"
      v-tooltip="m.experimental()"
      class="pi pi-exclamation-triangle text-yellow-600 dark:text-yellow-500"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ClipProvider } from '@cq/providers'

import * as m from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'

export interface Props {
  provider: ClipProvider
}

const { provider } = defineProps<Props>()

const providers = useProviders()

const svg = computed(() => providers.svg(provider))
</script>
