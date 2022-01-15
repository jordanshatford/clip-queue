<template>
  <nav class="bg-white dark:bg-gray-800 shadow dark:shadow-dark fixed top-0 z-40 w-full">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button @click="() => (showMobileMenu = !showMobileMenu)" class="border-none focus:outline-none p-2">
            <x-icon v-if="showMobileMenu" />
            <menu-icon v-else />
          </button>
          <theme-change-button />
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="text-purple-500 font-extrabold text-lg flex-shrink-0 flex items-center">{{ title }}</div>
          <div class="hidden sm:block sm:ml-6">
            <div v-if="userStore.user.isLoggedIn" class="flex space-x-4">
              <nav-item v-for="route in routes" :route="route" :key="route.name" />
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <theme-change-button class="hidden md:block mr-2" />
          <auth-button :isLoggedIn="userStore.user.isLoggedIn" :login="userStore.login" :logout="userStore.logout" />
        </div>
      </div>
    </div>
    <div v-if="showMobileMenu">
      <div v-if="userStore.user.isLoggedIn" class="px-2 pt-2 pb-3 space-y-1">
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

<script lang="ts">
import { defineComponent, ref } from "vue";
import NavItem from "@/layout/NavItem.vue";
import ThemeChangeButton from "@/components/ThemeChangeButton.vue";
import { userStore } from "@/stores/user";
import AuthButton from "@/components/AuthButton.vue";
import { routes } from "@/router";
import config from "@/config";
import XIcon from "@/components/icons/X.vue";
import MenuIcon from "@/components/icons/Menu.vue";

const { title } = config.App;

export default defineComponent({
  components: {
    NavItem,
    ThemeChangeButton,
    AuthButton,
    XIcon,
    MenuIcon,
  },
  setup() {
    let showMobileMenu = ref(false);
    return {
      routes,
      title,
      showMobileMenu,
      userStore,
    };
  },
});
</script>
