<template>
  <NuxtLayout>
    <UError icon="lucide:circle-x" :error="error" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>
