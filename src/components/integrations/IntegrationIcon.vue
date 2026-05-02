<template>
  <svg v-if="svg" v-html="svg"></svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { integrations, type IntegrationID } from '@/integrations'

export interface Props {
  id: IntegrationID
}

const { id } = defineProps<Props>()

const svg = computed((): string | undefined => {
  for (const integration of integrations) {
    if (
      integration.id === id ||
      integration.authentication?.id === id ||
      integration.source?.id === id
    ) {
      return integration.icon
    }
    for (const provider of integration.providers) {
      if (provider.id === id) {
        return integration.icon
      }
    }
  }
  return undefined
})
</script>
