<template>
  <div class="flex items-center gap-2">
    <div class="h-5">
      <IntegrationIcon class="size-5" :id="provider" />
    </div>
    <div>{{ p?.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { IntegrationID } from '@/integrations'

import IntegrationIcon from '@/components/integrations/IntegrationIcon.vue'
import { useIntegrations } from '@/stores/integrations'

export interface Props {
  provider: IntegrationID
}

const { provider } = defineProps<Props>()

const integration = useIntegrations()

const p = computed(() => integration.provider(provider))
</script>
