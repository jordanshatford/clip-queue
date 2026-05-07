<template>
  <Message size="small" severity="secondary" variant="simple">
    {{ m.providers_for_integration() }}
  </Message>
  <div v-for="provider of providers" :key="provider.id">
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <label :for="provider.id">{{ provider.name }}</label>
        <Tag class="font-mono text-xs" severity="secondary" :value="provider.id"></Tag>
        <Tag
          v-if="provider.isExperimental"
          icon="pi pi-exclamation-triangle"
          class="text-xs"
          severity="warn"
          :value="m.experimental()"
        ></Tag>
      </div>
      <ToggleSwitch v-model="provider.isEnabled" :input-id="provider.id" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import Message from 'primevue/message'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'

import type { IntegrationProvider } from '@/integrations'

import { m } from '@/paraglide/messages'

const providers = defineModel<Reactive<IntegrationProvider>[]>({ required: true })
</script>
