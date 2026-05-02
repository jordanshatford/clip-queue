<template>
  <Panel toggleable collapsed class="mx-auto max-w-2xl">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <IntegrationIcon class="size-5" :id="integration.id" />
          {{ integration.name }}
        </div>
        <div class="flex items-center gap-1">
          <Tag
            v-if="integration.isExperimental"
            icon="pi pi-exclamation-triangle"
            class="text-xs"
            severity="warn"
            :value="m.experimental()"
          >
          </Tag>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-2 text-left">
      <IntegrationAuthentication
        v-if="integration.authentication"
        :authentication="integration.authentication"
      />
      <Divider v-if="integration.authentication" />
      <IntegrationSource v-if="integration.source" :source="integration.source" />
      <Divider v-if="integration.source" />
      <IntegrationProviders
        v-if="integration.providers && integration.providers.length > 0"
        :providers="integration.providers"
      />
    </div>
  </Panel>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import Tag from 'primevue/tag'

import type { Integration } from '@/integrations'

import { m } from '@/paraglide/messages'

import IntegrationAuthentication from './IntegrationAuthentication.vue'
import IntegrationIcon from './IntegrationIcon.vue'
import IntegrationProviders from './IntegrationProviders.vue'
import IntegrationSource from './IntegrationSource.vue'

interface Props {
  integration: Integration
}

const { integration } = defineProps<Props>()
</script>
