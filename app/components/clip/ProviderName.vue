<template>
  <div class="flex items-center gap-2">
    <div class="h-5">
      <IntegrationIcon :id class="size-5" />
    </div>
    <div>{{ provider?.name }}</div>
  </div>
</template>

<script setup lang="ts">
import type { IntegrationID } from '~/integrations'

import IntegrationIcon from '~/components/integrations/IntegrationIcon.vue'

export interface Props {
  id: IntegrationID
}

const { id } = defineProps<Props>()

const integration = useIntegrations()
const provider = computed(() => integration.provider(id))
</script>
