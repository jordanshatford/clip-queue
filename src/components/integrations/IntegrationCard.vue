<template>
  <UICard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex w-full items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <IntegrationIcon class="size-5" :id="integration.id" />
        <span class="font-medium">
          {{ integration.name }}
        </span>
        <UIBadge size="sm" color="neutral" variant="soft" class="font-mono">
          {{ integration.id }}
        </UIBadge>
      </div>
      <div class="flex items-center gap-1">
        <UIBadge
          v-if="integration.isExperimental"
          icon="lucide:triangle-alert"
          color="warning"
          size="sm"
          variant="soft"
        >
          {{ m.experimental() }}
        </UIBadge>
      </div>
      <!-- TODO(jordan): currently you cannot disable twitch -->
      <UISwitch
        v-if="integration.id !== IntegrationID.TWITCH"
        v-model="integration.isEnabled"
        class="ml-auto"
      />
    </div>
    <UICollapsible :open="integration.isEnabled">
      <template #content>
        <div class="mt-4 flex flex-col gap-2 text-left">
          <IntegrationAuthentication
            v-if="integration.authentication"
            v-model="integration.authentication"
          />
          <UISeparator v-if="integration.authentication" />
          <IntegrationSource v-if="integration.source" v-model="integration.source" />
          <UISeparator v-if="integration.source" />
          <IntegrationProviders
            v-if="integration.providers?.length"
            v-model="integration.providers"
          />
        </div>
      </template>
    </UICollapsible>
  </UICard>
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
