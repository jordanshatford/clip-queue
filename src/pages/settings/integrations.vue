<template>
  <div v-for="integration of integrations" :key="integration.id" class="mb-2">
    <IntegrationCard :integration="integration" v-model:enabled="integration.isEnabled" />
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
