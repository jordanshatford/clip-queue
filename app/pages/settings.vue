<template>
  <div class="flex flex-col lg:pt-12">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: '/settings/queue',
  requiresAuth: true,
  icon: 'lucide:settings',
  order: 3,
})
</script>
