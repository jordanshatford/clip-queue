<template>
  <Message size="small" severity="secondary" variant="simple">
    {{ m.source_for_integration() }}
  </Message>
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <label :for="source.id">{{ source.name }}</label>
      <Tag class="font-mono text-xs" severity="secondary" :value="source.id"></Tag>
      <Tag
        v-if="source.isExperimental"
        icon="pi pi-exclamation-triangle"
        class="text-xs"
        severity="warn"
        :value="m.experimental()"
      ></Tag>
    </div>
  </div>
  <InputGroup>
    <InputText id="username" :value="source.url" readonly fluid size="small" />
    <InputGroupAddon>
      <IntegrationStatusTag :status="source.status" />
    </InputGroupAddon>
    <InputGroupAddon>
      <i
        v-tooltip="m.reconnect()"
        class="pi pi-refresh hover:cursor-pointer"
        @click="source.reconnect()"
      ></i>
    </InputGroupAddon>
  </InputGroup>
  <div class="flex gap-2">
    <Tag
      v-for="f of source.features"
      :key="f"
      class="text-xs"
      severity="secondary"
      :value="featureTranslations[f]()"
    ></Tag>
  </div>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Tag from 'primevue/tag'

import type { IntegrationSource } from '@/integrations/core'

import { IntegrationSourceFeature } from '@/integrations/core'
import { m } from '@/paraglide/messages'

import IntegrationStatusTag from './IntegrationStatusTag.vue'

const source = defineModel<Reactive<IntegrationSource>>({ required: true })

const featureTranslations: Record<IntegrationSourceFeature, () => string> = {
  [IntegrationSourceFeature.AUTOMOD]: m.auto_mod,
  [IntegrationSourceFeature.COMMANDS]: m.commands,
  [IntegrationSourceFeature.LINK_DETECTION]: m.link_detection,
}
</script>
