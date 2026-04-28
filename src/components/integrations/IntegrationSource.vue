<template>
  <Message size="small" severity="secondary" variant="simple">
    Sources available for this integration. When connected, URL's detected in the source will be
    submitted.
  </Message>
  <InputGroup>
    <InputText id="username" :value="source.name" readonly fluid size="small" />
    <InputGroupAddon>
      <IntegrationSourceStatus :status="source.status" />
    </InputGroupAddon>
    <InputGroupAddon>
      <i
        v-tooltip="m.reconnect()"
        class="pi pi-refresh hover:cursor-pointer"
        @click="source.reconnect()"
      ></i>
    </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

import type { IntegrationSource } from '@/integrations/common/source'

import { m } from '@/paraglide/messages'

import IntegrationSourceStatus from './IntegrationSourceStatus.vue'

interface Props {
  source: IntegrationSource
}

const { source } = defineProps<Props>()
</script>
