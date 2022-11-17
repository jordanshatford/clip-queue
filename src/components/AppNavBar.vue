<template>
  <nav class="bg-white dark:bg-zinc-800 shadow dark:shadow-dark fixed top-0 z-40 w-full">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <AppHamburger v-model="showMobileMenu" />
          <AppThemeToggle />
        </div>
        <div class="flex-1 flex items-center justify-center sm:justify-start">
          <RouterLink
            exact-active-class=""
            :to="{ name: RouteNameConstants.HOME }"
            class="flex-shrink-0 flex items-center"
            ><img class="w-12 aspect-square rounded-xl" src="/icon.png"
          /></RouterLink>
          <div class="hidden sm:block sm:ml-6">
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
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <AppThemeToggle class="hidden sm:block mr-2" />
          <BaseButton variant="brand" @click="() => handleAuthButtonClick()">
            <span><TwitchLogo class="inline w-5" /></span>
            {{ user.isLoggedIn ? "Logout" : "Login" }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div v-if="showMobileMenu">
      <div class="px-2 pt-2 pb-3 space-y-1">
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
import { ref } from "vue"
import TwitchLogo from "@/components/icons/TwitchLogo.vue"
import { useRouter } from "vue-router"
import AppNavBarItem from "@/components/AppNavBarItem.vue"
import AppThemeToggle from "@/components/AppThemeToggle.vue"
import AppHamburger from "@/components/AppHamburger.vue"
import { routes, RouteNameConstants } from "@/router"
import { useUser } from "@/stores/user"

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
