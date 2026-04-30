<template>
  <Card class="mx-auto max-w-2xl">
    <template #title>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <svg v-if="integration.icon" class="size-5" v-html="integration.icon"></svg>
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
    <template #content>
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
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'

import type { Integration } from '@/integrations'

import { m } from '@/paraglide/messages'

import IntegrationAuthentication from './IntegrationAuthentication.vue'
import IntegrationProviders from './IntegrationProviders.vue'
import IntegrationSource from './IntegrationSource.vue'

interface Props {
  integration: Integration
}

const { integration } = defineProps<Props>()
</script>
