<template>
  <UApp :key="preferences.locale" :locale="preferences.uilocale" :toaster="app.toaster">
    <NuxtLoadingIndicator color="var(--ui-primary)" error-color="var(--ui-error)" />
    <AppHeader />
    <UMain>
      <UContainer class="py-4">
        <slot />
      </UContainer>
    </UMain>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
const app = useAppConfig()
const preferences = usePreferences()
</script>
