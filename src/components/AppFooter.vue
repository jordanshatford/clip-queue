<template>
  <USeparator type="solid" class="h-px" />
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Copyright © {{ copyright.year }}-{{ new Date().getFullYear() }}
      </p>
    </template>
    <template #right>
      <UButton
        icon="simple-icons:github"
        color="neutral"
        variant="ghost"
        :to="github"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
interface Props {
  copyright: {
    owner: string
    year: number
  }
  github: string
}

defineProps<Props>()
</script>
