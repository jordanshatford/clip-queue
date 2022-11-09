<template>
  <div class="min-h-screen h-full dark:bg-zinc-900">
    <div class="h-full">
      <AppNavBar />
      <main class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5 text-center">
        <RouterView />
      </main>
    </div>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import AppNavBar from "@/components/AppNavBar.vue"
import AppFooter from "./components/AppFooter.vue"
</script>
