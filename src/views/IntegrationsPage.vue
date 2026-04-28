<template>
  <div class="mx-auto mt-4 flex flex-col items-center gap-2">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <svg v-if="integration?.icon" class="size-10" v-html="integration.icon"></svg>
    <span>{{ integration?.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import { integrations } from '@/integrations'

const route = useRoute()

const integration = integrations.find((i) => i.id === route.params.id)
</script>
