<template>
  <UBadge size="sm" :icon="toIcon(status)" :color="toColor(status)" variant="subtle">
    {{ statusTranslations[status]() }}
  </UBadge>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'
import { IntegrationStatus, toColor, toIcon } from '~/integrations/core'

export interface Props {
  status: IntegrationStatus
}

defineProps<Props>()

const statusTranslations: Record<IntegrationStatus, () => string> = {
  [IntegrationStatus.HEALTHY]: m.healthy,
  [IntegrationStatus.UNKNOWN]: m.unknown,
  [IntegrationStatus.MISCONFIGURED]: m.misconfigured,
  [IntegrationStatus.ERROR]: m.error,
  [IntegrationStatus.DISABLED]: m.disabled,
}
</script>
