<template>
  <Toast position="bottom-center" />
  <ConfirmDialog :draggable="false" />
  <div class="h-full min-h-screen dark:bg-surface-900">
    <div class="h-full">
      <AppNavBar />
      <main class="mx-auto h-full max-w-7xl px-4 pb-5 pt-20 text-center sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { ConfirmDialog, Toast } from '@cq/ui'
import AppNavBar from '@/components/AppNavBar.vue'
import AppFooter from './components/AppFooter.vue'
</script>
