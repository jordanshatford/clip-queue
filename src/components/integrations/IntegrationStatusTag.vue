<template>
  <Tag
    class="text-xs"
    :icon="config.icon"
    :severity="config.severity"
    v-tooltip="config.label()"
  ></Tag>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed } from 'vue'

import { IntegrationStatus } from '@/integrations/core'
import { m } from '@/paraglide/messages'

export interface Props {
  status: IntegrationStatus
}

const { status } = defineProps<Props>()

type TagProps = InstanceType<typeof Tag>['$props']

type TagConfig = {
  label: () => TagProps['value']
  severity: TagProps['severity']
  icon: TagProps['icon']
}

const STATUS_CONFIG: Record<IntegrationStatus, TagConfig> = {
  [IntegrationStatus.ERROR]: {
    label: m.error,
    severity: 'danger',
    icon: 'pi pi-exclamation-circle',
  },
  [IntegrationStatus.HEALTHY]: {
    label: m.healthy,
    severity: 'success',
    icon: 'pi pi-check-circle',
  },
  [IntegrationStatus.DISABLED]: {
    label: m.disabled,
    severity: 'secondary',
    icon: 'pi pi-stop-circle',
  },
  [IntegrationStatus.MISCONFIGURED]: {
    label: m.misconfigured,
    severity: 'danger',
    icon: 'pi pi-exclamation-circle',
  },
  [IntegrationStatus.UNKNOWN]: {
    label: m.unknown,
    severity: 'warn',
    icon: 'pi pi-exclamation-triangle',
  },
}

const config = computed(() => STATUS_CONFIG[status])
</script>
