<template>
  <UFormField :label="m.source_for_integration()">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <div class="flex items-center gap-2">
          <label :for="source.id" class="text-muted">{{ source.name }}</label>
          <UBadge size="sm" color="neutral" variant="soft" class="font-mono">
            {{ source.id }}
          </UBadge>
          <UBadge
            v-if="source.isExperimental"
            icon="lucide:triangle-alert"
            color="warning"
            size="sm"
            variant="soft"
          >
            {{ m.experimental() }}
          </UBadge>
        </div>
        <div class="flex gap-2">
          <UBadge
            size="sm"
            :icon="toIcon(source.status)"
            :color="toColor(source.status)"
            variant="subtle"
          >
            {{ statusTranslations[source.status]() }}
          </UBadge>
          <USwitch :id="source.id" v-model="source.isEnabled" :loading="source.isLoading" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="feature of source.features"
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
import { IntegrationStatus, IntegrationSourceFeature, toColor, toIcon } from '~/integrations/core'

const source = defineModel<Reactive<IntegrationSource>>({ required: true })

const featureTranslations: Record<IntegrationSourceFeature, () => string> = {
  [IntegrationSourceFeature.AUTOMOD]: m.auto_mod,
  [IntegrationSourceFeature.COMMANDS]: m.commands,
  [IntegrationSourceFeature.LINK_DETECTION]: m.link_detection,
}

const statusTranslations: Record<IntegrationStatus, () => string> = {
  [IntegrationStatus.HEALTHY]: m.healthy,
  [IntegrationStatus.UNKNOWN]: m.unknown,
  [IntegrationStatus.MISCONFIGURED]: m.misconfigured,
  [IntegrationStatus.ERROR]: m.error,
  [IntegrationStatus.DISABLED]: m.disabled,
}
</script>
