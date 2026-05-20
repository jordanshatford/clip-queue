<template>
  <UApp>
    <AppNavBar />
    <UMain>
      <main class="mx-auto h-full max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8">
        <UError icon="lucide:circle-x" :error="error" />
      </main>
    </UMain>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>
