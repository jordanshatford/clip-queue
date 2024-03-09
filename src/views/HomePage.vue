<template>
  <div class="mx-5 py-10">
    <div class="text-left sm:text-center">
      <p class="cq-text mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {{ tagline }}
      </p>
      <p class="cq-text-subtle mx-auto mt-2 text-lg">
        {{ description }}
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
import config from '@/assets/config'
import AppFeature from '@/components/AppFeature.vue'

const { tagline, description, features } = config.about
</script>
