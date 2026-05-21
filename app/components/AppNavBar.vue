<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="mr-2 flex shrink-0 items-center">
        <img class="size-9" src="@/assets/icon.png" />
      </NuxtLink>
    </template>
    <UNavigationMenu :items="routes.all.value" content-orientation="vertical" />
    <template #right>
      <UColorModeButton size="sm" />
      <AppAuthentication />
    </template>
    <template #body>
      <UNavigationMenu :items="routes.all.value" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const routes = useVisibleRoutes()
</script>
