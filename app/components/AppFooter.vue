<template>
  <USeparator />
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Copyright © {{ app.cq.copyright }}-{{ new Date().getFullYear() }}
      </p>
    </template>
    <template #right>
      <UButton
        icon="simple-icons:github"
        color="neutral"
        variant="ghost"
        :to="app.cq.github"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const app = useAppConfig()
</script>
