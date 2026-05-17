<template>
  <UCard class="mx-auto max-w-2xl" variant="outline">
    <div class="flex w-full items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <IntegrationIcon class="size-5" :id="integration.id" />
        <span class="font-medium">
          {{ integration.name }}
        </span>
        <UBadge size="sm" color="neutral" variant="soft" class="font-mono">
          {{ integration.id }}
        </UBadge>
      </div>
      <div class="flex items-center gap-1">
        <UBadge
          v-if="integration.isExperimental"
          icon="lucide:triangle-alert"
          color="warning"
          size="sm"
          variant="soft"
        >
          {{ m.experimental() }}
        </UBadge>
      </div>
      <!-- TODO(jordan): currently you cannot disable twitch -->
      <USwitch
        v-if="integration.id !== IntegrationID.TWITCH"
        v-model="integration.isEnabled"
        class="ml-auto"
      />
    </div>
    <UCollapsible :open="integration.isEnabled">
      <template #content>
        <div class="mt-4 flex flex-col gap-2 text-left">
          <IntegrationAuthentication
            v-if="integration.authentication"
            v-model="integration.authentication"
          />
          <USeparator v-if="integration.authentication" />
          <IntegrationSource v-if="integration.source" v-model="integration.source" />
          <USeparator v-if="integration.source" />
          <IntegrationProviders
            v-if="integration.providers?.length"
            v-model="integration.providers"
          />
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script setup lang="ts">
import { IntegrationID, type Integration } from '@/integrations'
import { m } from '@/paraglide/messages'

import IntegrationAuthentication from './IntegrationAuthentication.vue'
import IntegrationIcon from './IntegrationIcon.vue'
import IntegrationProviders from './IntegrationProviders.vue'
import IntegrationSource from './IntegrationSource.vue'

const integration = defineModel<Integration>({ required: true })
</script>
