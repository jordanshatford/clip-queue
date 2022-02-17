<template>
  <nav class="bg-white dark:bg-zinc-800 shadow dark:shadow-dark fixed top-0 z-40 w-full">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <hamburger v-if="user.isLoggedIn" v-model="showMobileMenu" />
          <theme-change-button />
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
              <nav-item v-for="route in routes" :route="route" :key="route.name" />
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <theme-change-button class="hidden sm:block mr-2" />
          <auth-button :isLoggedIn="user.isLoggedIn" :login="user.redirect" :logout="user.logout" />
        </div>
      </div>
    </div>
    <div v-if="showMobileMenu">
      <div v-if="user.isLoggedIn" class="px-2 pt-2 pb-3 space-y-1">
        <nav-item
          v-for="route in routes"
          @click="() => (showMobileMenu = false)"
          :route="route"
          :key="route.name"
          isMobileMenu
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue"
import NavItem from "@/components/nav/NavItem.vue"
import ThemeChangeButton from "@/components/ThemeChangeButton.vue"
import { useUser } from "@/stores/user"
import AuthButton from "@/components/AuthButton.vue"
import Hamburger from "@/components/Hamburger.vue"
import { routes } from "@/router"
import config from "@/assets/config"

const { title } = config.App
const user = useUser()
let showMobileMenu = ref(false)
</script>
