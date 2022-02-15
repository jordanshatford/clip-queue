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
import { useQueue, LOCAL_STORAGE_KEY as QUEUE_KEY } from "@/stores/queue"
import { useClipFinder, LOCAL_STORAGE_KEY as CLIP_FINDER_KEY } from "@/stores/clip-finder"

useTheme().getDefault()
useSettings().init()
const queue = useQueue()
queue.init()
queue.$subscribe(
  (m, state) => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(state))
  },
  { detached: true }
)
const clipFinder = useClipFinder()
clipFinder.init()
clipFinder.$subscribe(
  (m, state) => {
    localStorage.setItem(CLIP_FINDER_KEY, JSON.stringify(state))
  },
  { detached: true }
)
</script>
