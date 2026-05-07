<template>
  <div class="mx-auto mt-4 flex flex-col items-center gap-2">
    <IntegrationIcon v-if="integration?.id" class="size-10" :id="integration?.id" />
    <span>{{ integration?.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import IntegrationIcon from '@/components/integrations/IntegrationIcon.vue'
import { integrations } from '@/integrations'
import { m } from '@/paraglide/messages'

definePage({
  meta: {
    requiresAuth: false,
    icon: 'pi pi-share-alt',
    title: m.integrations,
    hidden: true,
  },
})

const route = useRoute('/integrations/[id]')

const integration = integrations.find((i) => i.id === route.params.id)
</script>
