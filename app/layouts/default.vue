<template>
  <UApp :key="preferences.locale" :locale="preferences.uilocale">
    <AppHeader />
    <UMain>
      <main class="mx-auto h-full max-w-7xl px-4 py-4 text-center sm:px-6 lg:px-8">
        <slot />
      </main>
    </UMain>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
const preferences = usePreferences()
</script>
