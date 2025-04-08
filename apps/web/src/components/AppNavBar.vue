<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mx-auto w-full border p-2 sm:px-16 md:px-20 lg:px-32"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RouterLink :to="{ name: RouteNameConstants.HOME }" class="mr-2 flex shrink-0 items-center">
          <img class="aspect-square w-10" src="/icon.png" />
        </RouterLink>
        <div v-for="route in allowedRoutes" :key="route.name">
          <RouterLink
            :to="{ name: route.name }"
            class="bg-surface hover:bg-surface-100 dark:hover:bg-surface-800 dark:active:bg-surface-800 active:bg-surface-100 text-surface-800 dark:text-surface-100 jusitfy-center flex items-center gap-1 rounded-md px-3 py-2 font-medium"
          >
            <span :class="route.meta?.icon"></span>
            <span class="ml-2">{{ routeTranslations[route.name as RouteNameConstants]() }}</span>
          </RouterLink>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggle :is-dark-mode="preferences.isDark" @toggle="preferences.toggleTheme()" />
        <Button
          icon="pi pi-twitch"
          :label="user.isLoggedIn ? m.logout() : m.login()"
          size="small"
          @click="() => handleAuthButtonClick()"
        >
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Button, ThemeToggle } from '@cq/ui'

import * as m from '@/paraglide/messages'
import { allowedRoutes, RouteNameConstants, routeTranslations } from '@/router'
import { usePreferences } from '@/stores/preferences'
import { useUser } from '@/stores/user'

const preferences = usePreferences()
const user = useUser()
const router = useRouter()

async function handleAuthButtonClick() {
  if (user.isLoggedIn) {
    await user.logout()
    await router.push({ name: RouteNameConstants.HOME })
  } else {
    user.redirect()
  }
}
</script>
