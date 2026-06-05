<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-4 text-left">
      <div class="flex items-center gap-2 align-middle">
        <span class="font-medium">{{ title }}</span>
        <UDropdownMenu v-if="actions" :items="actions">
          <UButton icon="lucide:ellipsis-vertical" size="sm" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
      <slot></slot>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

export interface Props {
  title: string
  actions?: DropdownMenuItem[][]
}

defineProps<Props>()
</script>
