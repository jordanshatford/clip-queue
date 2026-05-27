<template>
  <UApp :key="preferences.locale" :locale="preferences.uilocale">
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
const preferences = usePreferences()
</script>
