<template>
  <div v-for="(integration, index) of integrations" :key="integration.id" class="mb-2">
    <IntegrationCard v-model="integrations[index]!" />
  </div>
</template>

<script setup lang="ts">
import IntegrationCard from '@/components/integrations/IntegrationCard.vue'
import { integrations } from '@/integrations'
import { m } from '@/paraglide/messages'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'pi pi-share-alt',
    title: m.integrations,
    order: 2,
  },
})
</script>
