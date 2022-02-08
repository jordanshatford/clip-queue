<template>
  <div class="min-h-screen h-full dark:bg-zinc-900">
    <div class="h-full">
      <Nav />
      <main class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5">
        <router-view />
      </main>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Nav from "@/layout/Nav.vue"
import Footer from "./layout/Footer.vue"
import { theme } from "@/stores/theme"
import { cache } from "@/utils/cache"
import { settings } from "@/stores/settings"

theme.getDefault()
cache.init()
settings.init()
</script>
