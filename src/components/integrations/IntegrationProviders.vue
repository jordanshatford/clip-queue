<template>
  <Message size="small" severity="secondary" variant="simple">
    {{ m.providers_for_integration() }}
  </Message>
  <div v-for="provider of providers" :key="provider.id">
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <label :for="provider.id">{{ provider.name }}</label>
        <UIBadge size="sm" color="neutral" variant="soft" class="font-mono">
          {{ provider.id }}
        </UIBadge>
        <UIBadge
          v-if="provider.isExperimental"
          icon="lucide:triangle-alert"
          color="warning"
          size="sm"
          variant="soft"
        >
          {{ m.experimental() }}
        </UIBadge>
      </div>
      <ToggleSwitch v-model="provider.isEnabled" :input-id="provider.id" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import Message from 'primevue/message'
import ToggleSwitch from 'primevue/toggleswitch'

import type { IntegrationProvider } from '@/integrations'

import { m } from '@/paraglide/messages'

const providers = defineModel<Reactive<IntegrationProvider>[]>({ required: true })
</script>
