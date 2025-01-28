<template>
  <div class="mx-5 py-10">
    <div class="text-left sm:text-center">
      <p
        class="text-surface-600 dark:text-surface-200 mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        {{ m.tagline() }}
      </p>
    </div>
    <div class="mt-12 text-left">
      <div class="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-6">
        <FeatureCard
          v-for="(feature, index) in features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { FeatureCard } from '@cq/ui'

import * as m from '@/paraglide/messages'

const features = computed(() => [
  {
    title: m.feature_connect_title(),
    description: m.feature_connect_description(),
    icon: 'pi pi-comments'
  },
  {
    title: m.feature_duplicate_prevent_title(),
    description: m.feature_duplicate_prevent_description(),
    icon: 'pi pi-copy'
  },
  {
    title: m.feature_popularity_title(),
    description: m.feature_popularity_description(),
    icon: 'pi pi-chart-line'
  },
  {
    title: m.feature_commands_title(),
    description: m.feature_commands_description(),
    icon: 'pi pi-bolt'
  },
  {
    title: m.feature_moderation_title(),
    description: m.feature_moderation_description(),
    icon: 'pi pi-flag'
  },
  {
    title: m.feature_settings_title(),
    description: m.feature_settings_description(),
    icon: 'pi pi-cog'
  }
])
</script>
