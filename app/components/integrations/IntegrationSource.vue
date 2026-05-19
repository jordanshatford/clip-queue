<template>
  <UFormField :label="m.source_for_integration()">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <div class="flex items-center gap-2">
          <label :for="source.id">{{ source.name }}</label>
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
        <USwitch :id="source.id" v-model="source.isEnabled" :loading="source.isLoading" />
      </div>
      <UFieldGroup>
        <UInput
          id="username"
          variant="outline"
          readonly
          :value="source.url"
          size="lg"
          class="w-full"
        />
        <IntegrationStatusTag :status="source.status" class="px-2" />
      </UFieldGroup>
      <div class="flex gap-2">
        <UBadge
          v-for="feature of source.features"
          :key="feature"
          color="neutral"
          variant="soft"
          class="font-mono"
        >
          {{ featureTranslations[feature]() }}
        </UBadge>
      </div>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

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
