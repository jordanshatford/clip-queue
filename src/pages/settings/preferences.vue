<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-2 text-left">
      <UFormField :label="m.language()" :help="m.language_description()">
        <USelect v-model="preferences.locale" :items="[...locales]" class="w-full">
          <template #default="{ modelValue }: { modelValue: Locale }">
            {{ localeLabels[modelValue] }}
          </template>
          <template #item-label="{ item }: { item: Locale }">
            {{ localeLabels[item] }}
          </template>
        </USelect>
      </UFormField>
      <UFormField :label="m.theme()" :help="m.theme_description()">
        <USelect v-model="preferences.store" :items="[...availableThemes]" class="w-full">
          <template #default="{ modelValue }: { modelValue: BasicColorSchema }">
            {{ themeTranslations[modelValue]() }}
          </template>
          <template #item-label="{ item }: { item: BasicColorSchema }">
            {{ themeTranslations[item]() }}
          </template>
        </USelect>
      </UFormField>
      <label for="primaryColor">{{ m.primary_color() }}</label>
      <Select
        v-model="preferences.primary"
        :options="colors"
        data-key="name"
        label-id="primaryColor"
        size="small"
        aria-describedby="primaryColor-help"
      >
        <template #value="{ value }: { value: ColorOption }">
          <ColorName :name="value.name" :color="value.palette[500]" />
        </template>
        <template #option="{ option }: { option: ColorOption }">
          <ColorName :name="option.name" :color="option.palette[500]" />
        </template>
      </Select>
      <Message id="primaryColor-help" size="small" severity="secondary" variant="simple">{{
        m.primary_color_description()
      }}</Message>
      <label for="surfaceColor">{{ m.surface_color() }}</label>
      <Select
        v-model="preferences.surface"
        data-key="name"
        :options="surfaces"
        label-id="surfaceColor"
        size="small"
        aria-describedby="surfaceColor-help"
      >
        <template #value="{ value }: { value: ColorOption }">
          <ColorName :name="value.name" :color="value.palette[500]" />
        </template>
        <template #option="{ option }: { option: ColorOption }">
          <ColorName :name="option.name" :color="option.palette[500]" />
        </template>
      </Select>
      <Message id="surfaceColor-help" size="small" severity="secondary" variant="simple">{{
        m.surface_color_description()
      }}</Message>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { BasicColorSchema } from '@vueuse/core'

import Message from 'primevue/message'
import Select from 'primevue/select'

import type { ColorOption } from '@/assets/palettes'
import type { Locale } from '@/paraglide/runtime'

import { colors, surfaces } from '@/assets/palettes'
import ColorName from '@/components/ColorName.vue'
import { m } from '@/paraglide/messages'
import { locales } from '@/paraglide/runtime'
import { availableThemes, usePreferences } from '@/stores/preferences'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'lucide:swatch-book',
    title: m.settings_preferences,
    order: 3,
  },
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
