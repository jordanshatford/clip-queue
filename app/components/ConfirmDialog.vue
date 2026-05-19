<template>
  <UModal :title :description :dismissible="false" :ui="{ footer: 'justify-end' }">
    <template #footer>
      <UButton color="neutral" variant="outline" @click="emits('close', false)">{{
        m.cancel()
      }}</UButton>
      <UButton color="error" @click="emits('close', true)">{{ m.confirm() }}</UButton>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { m } from '#paraglide/messages'

export interface ConfirmDialogProps {
  title?: string
  description?: string
}

defineProps<ConfirmDialogProps>()

const emits = defineEmits<{
  close: [value: boolean]
}>()
</script>
