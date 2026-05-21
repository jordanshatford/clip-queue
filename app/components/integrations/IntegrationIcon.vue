<template>
  <UIcon :name="icon" />
</template>

<script setup lang="ts">
import type { IntegrationID } from '~/integrations'

export interface Props {
  id: IntegrationID
}

const { id } = defineProps<Props>()

const integrations = useIntegrations()

const icon = computed<string | undefined>(() => integrations.integration(id)?.icon)
</script>
