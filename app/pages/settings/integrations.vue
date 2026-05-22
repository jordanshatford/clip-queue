<template>
  <div class="flex flex-col">
    <div v-for="(integration, index) of integrations" :key="integration.id" class="mb-2">
      <IntegrationCard v-model="integrations[index]!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { integrations } from '~/integrations'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:share-2',
  order: 2,
})
</script>
