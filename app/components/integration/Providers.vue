<template>
  <UFormField>
    <div class="flex flex-col gap-2">
      <div v-for="provider of providers" :key="provider.id" class="flex justify-between">
        <div class="flex items-center gap-2">
          <label :for="provider.id" class="text-muted">{{ provider.name }}</label>
          <UBadge size="sm" color="neutral" variant="soft" class="font-mono">
            {{ provider.id }}
          </UBadge>
        </div>
        <div class="flex gap-2">
          <UBadge
            v-if="provider.isMisconfigured"
            size="sm"
            icon="lucide:circle-alert"
            color="error"
            variant="subtle"
          >
            {{ m.misconfigured() }}
          </UBadge>
          <USwitch v-model="provider.isEnabled" :input-id="provider.id" />
        </div>
      </div>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import type { IntegrationProvider } from '~/integrations'

import { m } from '#paraglide/messages'

const providers = defineModel<Reactive<IntegrationProvider>[]>({ required: true })
</script>
