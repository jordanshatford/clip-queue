<template>
  <UIcon :name="icon" :title="integration?.name" :style="{ color }" />
</template>

<script setup lang="ts">
import type { IntegrationID } from '~/integrations'

export interface Props {
  id: IntegrationID
}

const { id } = defineProps<Props>()

const integration = useIntegrations().integration(id)

const icon = computed<string | undefined>(() => integration?.branding.icon)
const color = computed<string | undefined>(() => integration?.branding.primary)
</script>
