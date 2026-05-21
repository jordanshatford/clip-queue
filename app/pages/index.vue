<template>
  <div class="mx-5 py-10">
    <div class="text-left sm:text-center">
      <p class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {{ m.tagline() }}
      </p>
    </div>
    <UPageGrid class="mt-12 text-left">
      <UPageCard
        v-for="(feature, index) in features"
        :key="index"
        :title="feature.title"
        :description="feature.description"
        :icon="feature.icon"
        spotlight
        spotlight-color="primary"
      />
    </UPageGrid>
  </div>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: false,
  hidden: true,
})

const features = computed(() => [
  {
    title: m.feature_connect_title(),
    description: m.feature_connect_description(),
    icon: 'lucide:message-circle',
  },
  {
    title: m.feature_duplicate_prevent_title(),
    description: m.feature_duplicate_prevent_description(),
    icon: 'lucide:copy-x',
  },
  {
    title: m.feature_popularity_title(),
    description: m.feature_popularity_description(),
    icon: 'lucide:chart-line',
  },
  {
    title: m.feature_commands_title(),
    description: m.feature_commands_description(),
    icon: 'lucide:command',
  },
  {
    title: m.feature_moderation_title(),
    description: m.feature_moderation_description(),
    icon: 'lucide:shield-check',
  },
  {
    title: m.feature_settings_title(),
    description: m.feature_settings_description(),
    icon: 'lucide:settings',
  },
])
</script>
