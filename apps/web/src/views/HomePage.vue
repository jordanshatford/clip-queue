<template>
  <div class="mx-5 py-10">
    <div class="text-left sm:text-center">
      <p
        class="mt-2 text-3xl font-bold tracking-tight text-surface-600 dark:text-surface-400 sm:text-4xl"
      >
        {{ tagline }}
      </p>
    </div>
    <div class="mt-12 text-left">
      <div class="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-12">
        <AppFeature
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
import config from '@/config'
import AppFeature from '@/components/AppFeature.vue'

const { tagline, features } = config.about
</script>
