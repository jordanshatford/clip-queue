<template>
  <UHeader :toggle="routes.all.value.length > 0">
    <template #left>
      <NuxtLink to="/" class="flex shrink-0 items-center gap-2">
        <img class="size-9" src="~/assets/images/icon.png" />
        <span class="text-xl font-extrabold tracking-tight"
          >Clip<span class="text-primary">Queue</span></span
        >
      </NuxtLink>
    </template>
    <UNavigationMenu :items="routes.all.value" content-orientation="vertical" />
    <template #right>
      <AppThemePicker />
      <AppAuthentication />
    </template>
    <template #body>
      <UNavigationMenu :items="routes.all.value" orientation="vertical" class="-mx-2.5" />
    </template>
    <template v-if="route.path.startsWith('/settings/')" #bottom>
      <UNavigationMenu
        :items="routes.settings.value"
        variant="pill"
        highlight
        class="hidden justify-around border-y border-default bg-default/75 backdrop-blur lg:flex"
      />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const route = useRoute()
const routes = useVisibleRoutes()
</script>
