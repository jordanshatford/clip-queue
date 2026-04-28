<template>
  <div v-for="integration of integrations" :key="integration.id" class="mb-2">
    <IntegrationCard :integration="integration" />
  </div>
</template>

<script setup lang="ts">
import IntegrationCard from '@/components/integrations/IntegrationCard.vue'
import { integrations } from '@/integrations'
</script>
