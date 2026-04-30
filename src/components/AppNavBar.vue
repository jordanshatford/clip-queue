<template>
  <Menubar :model="items" class="mx-auto px-2 sm:px-16 md:px-20 lg:px-32">
    <template #start>
      <RouterLink :to="{ name: RouteNameConstants.HOME }" class="mr-2 flex shrink-0 items-center">
        <img class="aspect-square w-10" src="@/assets/icon.png" />
      </RouterLink>
    </template>
    <template #item="{ item, props }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <AppThemeToggle :is-dark-mode="preferences.isDark" @toggle="preferences.toggleTheme()" />
        <Button
          icon="pi pi-twitch"
          :label="user.isLoggedIn ? m.logout() : m.login()"
          size="small"
          @click="() => handleAuthButtonClick()"
        >
        </Button>
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import AppThemeToggle from '@/components/AppThemeToggle.vue'
import { m } from '@/paraglide/messages'
import { allowedRoutes, RouteNameConstants, routeTranslations } from '@/router'
import { usePreferences } from '@/stores/preferences'
import { useUser } from '@/stores/user'

const preferences = usePreferences()
const user = useUser()
const router = useRouter()

const items = computed((): MenuItem[] => {
  return allowedRoutes.value.map((v) => ({
    label: routeTranslations[v.name as RouteNameConstants](),
    icon: v.meta?.icon,
    route: { name: v.name },
  }))
})

async function handleAuthButtonClick() {
  if (user.isLoggedIn) {
    await user.logout()
    await router.push({ name: RouteNameConstants.HOME })
  } else {
    user.redirect()
  }
}
</script>
