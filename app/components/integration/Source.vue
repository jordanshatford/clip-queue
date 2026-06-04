<template>
  <UFormField>
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <div class="flex items-center gap-2">
          <label :for="source.id">{{ source.name }}</label>
          <UBadge size="sm" color="neutral" variant="soft" class="font-mono">
            {{ source.id }}
          </UBadge>
        </div>
        <div class="flex gap-2">
          <IntegrationStatusBadge :status="source.status" />
          <USwitch
            :id="source.id"
            v-model="source.isEnabled"
            :disabled="source.status === IntegrationStatus.MISCONFIGURED"
            :loading="source.isLoading"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="feature of source.features.sort()"
          :key="feature"
          icon="lucide:check"
          color="neutral"
          variant="subtle"
        >
          {{ featureTranslations[feature]() }}
        </UBadge>
      </div>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import type { IntegrationSource } from '~/integrations/core'

import { m } from '#paraglide/messages'
import { IntegrationSourceFeature, IntegrationStatus } from '~/integrations/core'

const source = defineModel<Reactive<IntegrationSource>>({ required: true })

const featureTranslations: Record<IntegrationSourceFeature, () => string> = {
  [IntegrationSourceFeature.AUTO_CONNECT]: m.auto_connect,
  [IntegrationSourceFeature.AUTO_MODERATION]: m.auto_mod,
  [IntegrationSourceFeature.COMMANDS]: m.commands,
  [IntegrationSourceFeature.LINK_DETECTION]: m.link_detection,
}
</script>
