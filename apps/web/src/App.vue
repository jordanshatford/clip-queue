<template>
  <Toast position="bottom-center" />
  <ConfirmDialog :draggable="false" />
  <div :key="preferences.preferences.language" class="h-full min-h-screen dark:bg-surface-950">
    <div class="h-full">
      <AppNavBar />
      <main class="mx-auto h-full max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
  <Footer :copyright="config.copyright" :github="config.github" />
</template>

<script setup lang="ts">
import { ConfirmDialog, Footer, Toast } from '@cq/ui'

import AppNavBar from '@/components/AppNavBar.vue'
import { config } from '@/config'
import { usePreferences } from './stores/preferences'

const preferences = usePreferences()
</script>
