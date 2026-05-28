<template>
  <div class="flex flex-col">
    <div
      v-for="(integration, index) of integrations.integrations"
      :key="integration.id"
      class="mb-2"
    >
      <IntegrationCard v-model="integrations.integrations[index]!" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  icon: 'lucide:share-2',
  order: 2,
})

const integrations = useIntegrations()
</script>
