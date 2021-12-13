<template>
  <nav class="bg-white dark:bg-gray-800 shadow dark:shadow-dark fixed top-0 z-40 w-full">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button @click="() => (showMobileMenu = !showMobileMenu)" class="border-none focus:outline-none p-2">
            <svg
              v-if="showMobileMenu"
              class="feather feather-x dark:text-gray-200 hover:text-red-500 dark:hover:text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <svg
              v-else
              class="feather feather-menu dark:text-gray-200 hover:text-purple-500 dark:hover:text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="text-purple-500 font-extrabold text-lg flex-shrink-0 flex items-center">{{ title }}</div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <NavItem v-for="route in routes" :route="route" :key="route.name" />
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <ThemeChangeButton class="mr-2" />
          <AuthButton :isLoggedIn="userStore.user.isLoggedIn" :login="userStore.login" :logout="userStore.logout" />
        </div>
      </div>
    </div>
    <div v-if="showMobileMenu">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NavItem
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
import NavItem from "@/components/NavItem.vue";
import ThemeChangeButton from "@/components/ThemeChangeButton.vue";
import { userStore } from "@/stores/user";
import AuthButton from "@/components/AuthButton.vue";
import { routes } from "@/router";
import config from "@/config";

const title = config.App.title;

export default defineComponent({
  components: {
    NavItem,
    ThemeChangeButton,
    AuthButton,
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
