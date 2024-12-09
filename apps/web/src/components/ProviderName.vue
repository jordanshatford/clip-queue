<template>
  <div class="flex items-center gap-1">
    <div class="h-5">
      <svg v-if="svg" class="h-5 w-5" v-html="svg"></svg>
    </div>
    <div>{{ provider }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ClipProvider } from '@cq/providers'

import { useProviders } from '@/stores/providers'

export interface Props {
  provider: ClipProvider
}

const { provider } = defineProps<Props>()

const providers = useProviders()

const svg = computed(() => providers.providers?.[provider]?.svg)
</script>
