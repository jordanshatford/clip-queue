<template>
  <UCard class="mx-auto w-full max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-4 text-left">
      <UFormField :label="m.locale()">
        <USelect
          id="locale"
          v-model="preferences.locale"
          :items="[...locales]"
          icon="lucide:languages"
          class="w-full"
        >
          <template #default="{ modelValue }: { modelValue: Locale }">
            {{ localeLabels[modelValue] }}
          </template>
          <template #item-label="{ item }: { item: Locale }">
            {{ localeLabels[item] }}
          </template>
        </USelect>
      </UFormField>
      <UFormField :label="m.theme()">
        <UColorModeSelect id="theme" class="w-full" />
      </UFormField>
      <UFormField :label="m.primary_color()">
        <USelect
          id="primary-color"
          v-model="preferences.primary"
          :items="[...primaryColors]"
          class="w-full"
        >
          <template #default="{ modelValue }: { modelValue: PrimaryColorName }">
            <ColorName :name="modelValue" />
          </template>
          <template #item-label="{ item }: { item: PrimaryColorName }">
            <ColorName :name="item" />
          </template>
        </USelect>
      </UFormField>
      <UFormField :label="m.neutral_color()">
        <USelect
          id="neutral-color"
          v-model="preferences.neutral"
          :items="[...neutralColors]"
          class="w-full"
        >
          <template #default="{ modelValue }: { modelValue: NeutralColorName }">
            <ColorName :name="modelValue" />
          </template>
          <template #item-label="{ item }: { item: NeutralColorName }">
            <ColorName :name="item" />
          </template>
        </USelect>
      </UFormField>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Locale } from '#paraglide/runtime'

import { m } from '#paraglide/messages'
import { locales } from '#paraglide/runtime'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:swatch-book',
  order: 3,
})

const preferences = usePreferences()
</script>
