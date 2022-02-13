<template>
  <div class="min-h-screen h-full dark:bg-zinc-900">
    <div class="h-full">
      <Nav />
      <main class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5 text-center">
        <router-view />
      </main>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Nav from "@/components/nav/Nav.vue"
import Footer from "./components/Footer.vue"
import { useTheme } from "@/stores/theme"
import { useSettings } from "./stores/settings"
import { cache } from "@/utils/cache"
import { useClips, LOCAL_STORAGE_KEY } from "@/stores/clips"

const clips = useClips()
clips.init()
clips.$subscribe(
  (m, state) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  },
  { detached: true }
)
useTheme().getDefault()
useSettings().init()
cache.init()
</script>
