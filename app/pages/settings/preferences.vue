<template>
  <UCard class="mx-auto w-full max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-2 text-left">
      <UFormField :label="m.language()" :help="m.language_description()">
        <USelect id="locale" v-model="preferences.locale" :items="[...locales]" class="w-full">
          <template #default="{ modelValue }: { modelValue: Locale }">
            {{ localeLabels[modelValue] }}
          </template>
          <template #item-label="{ item }: { item: Locale }">
            {{ localeLabels[item] }}
          </template>
        </USelect>
      </UFormField>
      <UFormField :label="m.theme()" :help="m.theme_description()">
        <USelect
          id="theme"
          v-model="preferences.store"
          :items="[...availableThemes]"
          class="w-full"
        >
          <template #default="{ modelValue }: { modelValue: BasicColorSchema }">
            {{ themeTranslations[modelValue]?.() }}
          </template>
          <template #item-label="{ item }: { item: BasicColorSchema }">
            {{ themeTranslations[item]?.() }}
          </template>
        </USelect>
      </UFormField>
      <UFormField :label="m.primary_color()" :help="m.primary_color_description()">
        <USelect id="primary-color" v-model="preferences.primary" :items="colors" class="w-full">
          <template #default="{ modelValue }: { modelValue: string }">
            <ColorName :name="modelValue" />
          </template>
          <template #item-label="{ item }: { item: string }">
            <ColorName :name="item" />
          </template>
        </USelect>
      </UFormField>
      <UFormField :label="m.surface_color()" :help="m.surface_color_description()">
        <USelect id="surface-color" v-model="preferences.surface" :items="surfaces" class="w-full">
          <template #default="{ modelValue }: { modelValue: string }">
            <ColorName :name="modelValue" />
          </template>
          <template #item-label="{ item }: { item: string }">
            <ColorName :name="item" />
          </template>
        </USelect>
      </UFormField>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { BasicColorSchema } from '@vueuse/core'

import type { Locale } from '#paraglide/runtime'

import { m } from '#paraglide/messages'
import { locales } from '#paraglide/runtime'
import { colors, surfaces } from '@/assets/palettes'
import ColorName from '@/components/ColorName.vue'
import { availableThemes, usePreferences } from '@/stores/preferences'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:swatch-book',
  order: 3,
})

const preferences = usePreferences()

const themeTranslations: Record<BasicColorSchema, () => string> = {
  dark: m.theme_dark,
  light: m.theme_light,
  auto: m.theme_auto,
}

const localeLabels: Record<Locale, string> = {
  ar: 'عربي (Arabic)',
  de: 'Deutsch (German)',
  en: 'English',
  es: 'Español (Spanish)',
  fr: 'Français (French)',
  hi: 'हिंदी (Hindi)',
  it: 'Italiano (Italian)',
  ja: '日本語 (Japanese)',
  ko: '한국인 (Korean)',
  pt: 'Português (Portuguese)',
  ru: 'русский (Russian)',
  tr: 'Türkçe (Turkish)',
  zh: '中文 (Chinese)',
}
</script>
