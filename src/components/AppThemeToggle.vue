<template>
  <Button
    :icon="preferences.isDark ? 'pi pi-sun' : 'pi pi-moon'"
    size="small"
    variant="text"
    aria-label="Theme"
    @click="preferences.toggleDark()"
  ></Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

import { usePreferences } from '@/stores/preferences'

const preferences = usePreferences()
</script>
