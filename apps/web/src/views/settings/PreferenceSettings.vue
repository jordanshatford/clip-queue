<template>
  <div>
    <Card class="mx-auto max-w-lg">
      <template #content>
        <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="primaryColor">Primary Color:</label>
            <Dropdown
              v-model="formTheme.primary"
              :options="colors"
              data-key="name"
              class="md:w-14rem w-full"
              input-id="primaryColor"
            >
              <template #value="{ value }: { value: ColorOption }">
                <ColorName :name="value.name" :color="value.palette[6]" />
              </template>
              <template #option="{ option }: { option: ColorOption }">
                <ColorName :name="option.name" :color="option.palette[6]" />
              </template>
            </Dropdown>
            <small id="primaryColor-help" class="pb-2 text-sm text-surface-400"
              >Primary color used throughout the UI.</small
            >
            <label for="surfaceColor">Surface Color:</label>
            <Dropdown
              v-model="formTheme.surface"
              data-key="name"
              :options="surfaces"
              class="md:w-14rem w-full"
              input-id="surfaceColor"
            >
              <template #value="{ value }: { value: ColorOption }">
                <ColorName :name="value.name" :color="value.palette[6]" />
              </template>
              <template #option="{ option }: { option: ColorOption }">
                <ColorName :name="option.name" :color="option.palette[6]" />
              </template>
            </Dropdown>
            <small id="surfaceColor-help" class="pb-2 text-sm text-surface-400"
              >Surface color used throughout the UI.</small
            >
          </div>
          <div class="mt-3">
            <Button
              severity="info"
              label="Save"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!theme.isModifiedFrom(formTheme)"
            ></Button>
            <Button
              type="reset"
              severity="danger"
              label="Cancel"
              size="small"
              :disabled="!theme.isModifiedFrom(formTheme)"
            ></Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'

import type { ColorOption } from '@cq/ui'
import { Button, Card, colors, Dropdown, surfaces, useToast } from '@cq/ui'

import ColorName from '@/components/ColorName.vue'
import { useTheme } from '@/stores/theme'

const toast = useToast()
const theme = useTheme()

const formKey = ref(1)
const formTheme = ref(structuredClone(toRaw(theme.preferences)))

function onReset() {
  formTheme.value = structuredClone(toRaw(theme.preferences))
  formKey.value += 1
}

function onSubmit() {
  theme.preferences = formTheme.value
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Preferences saved',
    life: 3000
  })
  onReset()
}
</script>
