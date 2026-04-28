<template>
  <Message size="small" severity="secondary" variant="simple"
    >The following are providers for the integration. If one is enabled, that type of content can
    make it into the queue.</Message
  >
  <div v-for="provider of providers" :key="provider.id">
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <label :for="provider.id">{{ provider.name }}</label>
        <Tag
          v-if="provider.isExperimental"
          icon="pi pi-exclamation-triangle"
          severity="warn"
          value="Experimental"
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

interface Props {
  providers: Reactive<IntegrationProvider>[]
}

const { providers } = defineProps<Props>()
</script>
