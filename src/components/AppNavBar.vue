<template>
  <nav class="bg-white dark:bg-zinc-800 shadow dark:shadow-dark fixed top-0 z-40 w-full">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <app-hamburger v-if="user.isLoggedIn" v-model="showMobileMenu"></app-hamburger>
          <app-theme-toggle></app-theme-toggle>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <router-link
            exact-active-class=""
            to="/"
            class="text-violet-500 font-extrabold text-lg flex-shrink-0 flex items-center"
            >{{ title }}</router-link
          >
          <div class="hidden sm:block sm:ml-6">
            <div v-if="user.isLoggedIn" class="flex space-x-4">
              <app-nav-bar-item v-for="route in routes" :route="route" :key="route.name"></app-nav-bar-item>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <app-theme-toggle class="hidden sm:block mr-2"></app-theme-toggle>
          <v-button variant="brand" @click="() => handleAuthButtonClick()">
            <span><twitch-logo class="inline w-5"></twitch-logo></span>
            {{ user.isLoggedIn ? "Logout" : "Login" }}
          </v-button>
        </div>
      </div>
    </div>
    <div v-if="showMobileMenu">
      <div v-if="user.isLoggedIn" class="px-2 pt-2 pb-3 space-y-1">
        <app-nav-bar-item
          v-for="route in routes"
          @click="() => (showMobileMenu = false)"
          :route="route"
          :key="route.name"
          isMobileMenu
        ></app-nav-bar-item>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue"
import TwitchLogo from "@/components/TwitchLogo.vue"
import { useRouter } from "vue-router"
import AppNavBarItem from "@/components/AppNavBarItem.vue"
import AppThemeToggle from "@/components/AppThemeToggle.vue"
import AppHamburger from "@/components/AppHamburger.vue"
import { routes, RouteNameConstants } from "@/router"
import config from "@/assets/config"
import { useUser } from "@/stores/user"

const { title } = config.App
const user = useUser()
const router = useRouter()
let showMobileMenu = ref(false)

async function handleAuthButtonClick() {
  if (user.isLoggedIn) {
    user.logout()
    await router.push({ name: RouteNameConstants.LANDING })
  } else {
    user.redirect()
  }
}
</script>
