<template>
  <UTooltip :text="config.label()">
    <UBadge
      class="text-xs"
      size="lg"
      :icon="config.icon"
      :color="config.color"
      variant="subtle"
    ></UBadge>
  </UTooltip>
</template>

<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'

import { computed } from 'vue'

import { m } from '#paraglide/messages'
import { IntegrationStatus } from '@/integrations/core'

export interface Props {
  status: IntegrationStatus
}

const { status } = defineProps<Props>()

type BadgeConfig = {
  label: () => string
  color: BadgeProps['color']
  icon: BadgeProps['icon']
}

const STATUS_CONFIG: Record<IntegrationStatus, BadgeConfig> = {
  [IntegrationStatus.ERROR]: {
    label: m.error,
    color: 'error',
    icon: 'lucide:circle-alert',
  },
  [IntegrationStatus.HEALTHY]: {
    label: m.healthy,
    color: 'success',
    icon: 'lucide:circle-check',
  },
  [IntegrationStatus.DISABLED]: {
    label: m.disabled,
    color: 'neutral',
    icon: 'lucide:circle-stop',
  },
  [IntegrationStatus.MISCONFIGURED]: {
    label: m.misconfigured,
    color: 'error',
    icon: 'lucide:circle-alert',
  },
  [IntegrationStatus.UNKNOWN]: {
    label: m.unknown,
    color: 'warning',
    icon: 'lucide:triangle-alert',
  },
}

const config = computed(() => STATUS_CONFIG[status])
</script>
