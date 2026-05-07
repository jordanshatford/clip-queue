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
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Tag from 'primevue/tag'

import type { IntegrationSource } from '@/integrations/core'

import { ClipSourceFeature } from '@/integrations/core'
import { m } from '@/paraglide/messages'

import IntegrationStatusTag from './IntegrationStatusTag.vue'

interface Props {
  source: IntegrationSource
}

const { source } = defineProps<Props>()

const featureTranslations: Record<ClipSourceFeature, () => string> = {
  [ClipSourceFeature.AUTOMOD]: m.auto_mod,
  [ClipSourceFeature.COMMANDS]: m.commands,
  [ClipSourceFeature.LINK_DETECTION]: m.link_detection,
}
</script>
