<template>
  <div v-for="(integration, index) of integrations" :key="integration.id" class="mb-2">
    <IntegrationCard v-model="integrations[index]!" />
  </div>
</template>

<script setup lang="ts">
import IntegrationCard from '@/components/integrations/IntegrationCard.vue'
import { integrations } from '@/integrations'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:share-2',
  order: 2,
})
</script>
