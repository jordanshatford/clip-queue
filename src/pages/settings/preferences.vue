<template>
  <UCard class="mx-auto max-w-2xl" variant="outline">
    <div class="flex flex-col gap-2 text-left">
      <label for="language">{{ m.language() }}</label>
      <Select
        v-model="preferences.locale"
        :options="[...locales]"
        label-id="language"
        size="small"
        :option-label="(value: Locale) => localeLabels[value]"
        aria-describedby="language-help"
      >
      </Select>
      <Message id="language-help" size="small" severity="secondary" variant="simple">{{
        m.language_description()
      }}</Message>
      <label for="theme">{{ m.theme() }}</label>
      <Select
        v-model="preferences.mode"
        :options="[...availableThemes]"
        label-id="theme"
        size="small"
        :option-label="(value: BasicColorMode) => themeTranslations[value]()"
        aria-describedby="theme-help"
      >
      </Select>
      <Message id="theme-help" size="small" severity="secondary" variant="simple">{{
        m.theme_description()
      }}</Message>
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
import type { BasicColorMode } from '@vueuse/core'

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

const themeTranslations: Record<BasicColorMode, () => string> = {
  dark: m.theme_dark,
  light: m.theme_light,
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
