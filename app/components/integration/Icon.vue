<template>
  <UIcon :name="icon" :title="integration?.name" />
</template>

<script setup lang="ts">
import type { IntegrationID } from '~/integrations'

export interface Props {
  id: IntegrationID
}

const { id } = defineProps<Props>()

const integration = useIntegrations().integration(id)

const icon = computed<string | undefined>(() => integration?.icon)
</script>
