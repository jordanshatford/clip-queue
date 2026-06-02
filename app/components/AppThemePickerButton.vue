<template>
  <UButton
    size="sm"
    color="neutral"
    variant="outline"
    :label="color.text()"
    class="rounded-sm text-xs ring-default"
    :class="[selected ? 'bg-elevated' : 'hover:bg-elevated/50']"
  >
    <div class="flex min-w-0 items-center gap-2">
      <span class="size-2 shrink-0 rounded-full" :class="color.class" />
      <div class="truncate">{{ color.text() }}</div>
    </div>
  </UButton>
</template>

<script setup lang="ts">
export interface Props {
  name: PrimaryColorName | NeutralColorName
  selected?: boolean
}

const { name, selected = false } = defineProps<Props>()

const color = computed(() => colorDetails[name])
</script>
