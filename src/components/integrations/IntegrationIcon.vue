<template>
  <svg v-if="svg" v-html="svg"></svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { IntegrationID } from '@/integrations'

import { useIntegrations } from '@/stores/integrations'

export interface Props {
  id: IntegrationID
}

const { id } = defineProps<Props>()

const integrations = useIntegrations()

const svg = computed<string | undefined>(() => integrations.integration(id)?.icon)
</script>
