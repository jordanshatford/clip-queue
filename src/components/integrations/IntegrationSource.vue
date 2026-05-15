<template>
  <Message size="small" severity="secondary" variant="simple">
    {{ m.source_for_integration() }}
  </Message>
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <label :for="source.id">{{ source.name }}</label>
      <UIBadge size="sm" color="neutral" variant="soft" class="font-mono">
        {{ source.id }}
      </UIBadge>
      <UIBadge
        v-if="source.isExperimental"
        icon="lucide:triangle-alert"
        color="warning"
        size="sm"
        variant="soft"
      >
        {{ m.experimental() }}
      </UIBadge>
    </div>
    <UISwitch :id="source.id" v-model="source.isEnabled" :loading="source.isLoading" />
  </div>
  <InputGroup>
    <InputText id="username" :value="source.url" readonly fluid size="small" />
    <InputGroupAddon>
      <IntegrationStatusTag :status="source.status" />
    </InputGroupAddon>
  </InputGroup>
  <div class="flex gap-2">
    <UIBadge
      v-for="feature of source.features"
      :key="feature"
      color="neutral"
      variant="soft"
      class="font-mono"
    >
      {{ featureTranslations[feature]() }}
    </UIBadge>
  </div>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

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
