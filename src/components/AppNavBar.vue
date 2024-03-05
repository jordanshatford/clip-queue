<template>
  <nav class="dark:shadow-dark fixed top-0 z-40 w-full bg-white shadow dark:bg-zinc-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <AppHamburger v-model="showMobileMenu" />
          <AppThemeToggle />
        </div>
        <div class="flex flex-1 items-center justify-center sm:justify-start">
          <RouterLink
            exact-active-class=""
            :to="{ name: RouteNameConstants.HOME }"
            class="flex flex-shrink-0 items-center"
            ><img class="aspect-square w-12" src="/icon.png"
          /></RouterLink>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-3">
              <AppNavBarItem
                v-for="route in routes"
                :route="route"
                :isAuthenticated="user.isLoggedIn"
                :key="route.name"
              />
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <AppThemeToggle class="mr-2 hidden sm:block" />
          <BButton size="small" @click="() => handleAuthButtonClick()">
            <span><TwitchLogo class="mr-2 inline w-5" /></span>
            {{ user.isLoggedIn ? 'Logout' : 'Login' }}
          </BButton>
        </div>
      </div>
    </div>
    <div v-if="showMobileMenu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <AppNavBarItem
          v-for="route in routes"
          @click="() => (showMobileMenu = false)"
          :route="route"
          :isAuthenticated="user.isLoggedIn"
          :key="route.name"
          isMobileMenu
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TwitchLogo from '@/components/icons/TwitchLogo.vue'
import { useRouter } from 'vue-router'
import AppNavBarItem from '@/components/AppNavBarItem.vue'
import AppThemeToggle from '@/components/AppThemeToggle.vue'
import AppHamburger from '@/components/AppHamburger.vue'
import { routes, RouteNameConstants } from '@/router'
import { useUser } from '@/stores/user'

const user = useUser()
const router = useRouter()
const showMobileMenu = ref(false)

async function handleAuthButtonClick() {
  if (user.isLoggedIn) {
    user.logout()
    await router.push({ name: RouteNameConstants.HOME })
  } else {
    user.redirect()
  }
}
</script>
