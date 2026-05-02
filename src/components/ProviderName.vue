<template>
  <div class="flex items-center gap-2">
    <div class="h-5">
      <IntegrationIcon class="size-5" :id="provider" />
    </div>
    <div>{{ name }}</div>
    <i
      v-if="providers.isExperimental(provider)"
      v-tooltip="m.experimental()"
      class="pi pi-exclamation-triangle text-yellow-600 dark:text-yellow-500"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { IntegrationID } from '@/integrations'

import IntegrationIcon from '@/components/integrations/IntegrationIcon.vue'
import { m } from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'

export interface Props {
  provider: IntegrationID
}

const { provider } = defineProps<Props>()

const providers = useProviders()

const name = computed(() => providers.name(provider))
</script>
