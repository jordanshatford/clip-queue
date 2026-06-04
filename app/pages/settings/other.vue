<template>
  <div class="mx-auto flex max-w-2xl min-w-2xl flex-col gap-2">
    <UCard variant="subtle">
      <p class="text-center text-sm">
        {{ m.application_version({ version }) }}
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:settings',
  order: 5,
})

const version = useRuntimeConfig().public.version
</script>
