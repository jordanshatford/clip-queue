<template>
  <div class="mx-auto mt-4 flex flex-col items-center gap-2">
    <IntegrationIcon v-if="integration?.id" class="size-10" :id="integration?.id" />
    <span>{{ integration?.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import type { IntegrationID } from '@/integrations'

import IntegrationIcon from '@/components/integrations/IntegrationIcon.vue'
import { m } from '@/paraglide/messages'
import { useIntegrations } from '@/stores/integrations'

definePage({
  meta: {
    requiresAuth: false,
    icon: '',
    title: m.integrations,
    hidden: true,
  },
})

const route = useRoute('/integrations/[id]')
const integrations = useIntegrations()
const integration = integrations.integration(route.params.id as IntegrationID)
</script>
