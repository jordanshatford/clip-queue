<template>
  <div class="mx-auto mt-4 flex flex-col items-center gap-2">
    <IntegrationIcon v-if="integration?.id" :id="integration?.id" class="size-10" />
    <span>{{ integration?.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import type { IntegrationID } from '@/integrations'

import IntegrationIcon from '@/components/integrations/IntegrationIcon.vue'
import { useIntegrations } from '@/stores/integrations'

definePageMeta({
  meta: {
    requiresAuth: false,
    icon: '',
    hidden: true,
  },
  validate(route) {
    // Validate that the integration has valid authentication, otherwise we should
    // not handle a callback or even show that the integration exists.
    const id = route.params.id as IntegrationID
    const integration = useIntegrations().integration(id)
    return !!integration?.authentication
  },
})

const route = useRoute('/integrations/[id]')
const integrations = useIntegrations()
const integration = integrations.integration(route.params.id as IntegrationID)
</script>
