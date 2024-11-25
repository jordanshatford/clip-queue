<template>
  <div>
    <Card class="mx-auto max-w-lg">
      <template #content>
        <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="primaryColor">{{ m.primary_color() }}</label>
            <Select
              v-model="formTheme.primary"
              :options="colors"
              data-key="name"
              class="md:w-14rem w-full"
              input-id="primaryColor"
            >
              <template #value="{ value }: { value: ColorOption }">
                <ColorName :name="value.name" :color="value.palette[500]" />
              </template>
              <template #option="{ option }: { option: ColorOption }">
                <ColorName :name="option.name" :color="option.palette[500]" />
              </template>
            </Select>
            <small id="primaryColor-help" class="pb-2 text-sm text-surface-400">{{
              m.primary_color_description()
            }}</small>
            <label for="surfaceColor">{{ m.surface_color() }}</label>
            <Select
              v-model="formTheme.surface"
              data-key="name"
              :options="surfaces"
              class="md:w-14rem w-full"
              input-id="surfaceColor"
            >
              <template #value="{ value }: { value: ColorOption }">
                <ColorName :name="value.name" :color="value.palette[500]" />
              </template>
              <template #option="{ option }: { option: ColorOption }">
                <ColorName :name="option.name" :color="option.palette[500]" />
              </template>
            </Select>
            <small id="surfaceColor-help" class="pb-2 text-sm text-surface-400">{{
              m.surface_color_description()
            }}</small>
          </div>
          <div class="mt-3">
            <Button
              severity="info"
              :label="m.save()"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!theme.isModifiedFrom(formTheme)"
            ></Button>
            <Button
              type="reset"
              severity="danger"
              :label="m.cancel()"
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
import { Button, Card, colors, Select, surfaces, useToast } from '@cq/ui'

import ColorName from '@/components/ColorName.vue'
import * as m from '@/paraglide/messages'
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
    summary: m.success(),
    detail: m.preferences_saved(),
    life: 3000
  })
  onReset()
}
</script>
