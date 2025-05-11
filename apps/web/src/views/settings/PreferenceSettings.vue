<template>
  <div>
    <Card class="mx-auto max-w-xl">
      <template #content>
        <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="language">{{ m.language() }}</label>
            <Select
              v-model="formPreferences.language"
              :options="[...locales]"
              label-id="language"
              :option-label="(value: Locale) => languageLabels[value]"
              aria-describedby="language-help"
            >
            </Select>
            <Message id="language-help" size="small" severity="secondary" variant="simple">{{
              m.language_description()
            }}</Message>
            <label for="theme">{{ m.theme() }}</label>
            <Select
              v-model="formPreferences.theme"
              :options="[...availableThemes]"
              label-id="theme"
              :option-label="(value: Theme) => themeTranslations[value]()"
              aria-describedby="theme-help"
            >
            </Select>
            <Message id="theme-help" size="small" severity="secondary" variant="simple">{{
              m.theme_description()
            }}</Message>
            <label for="primaryColor">{{ m.primary_color() }}</label>
            <Select
              v-model="formPreferences.primary"
              :options="colors"
              data-key="name"
              label-id="primaryColor"
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
              v-model="formPreferences.surface"
              data-key="name"
              :options="surfaces"
              label-id="surfaceColor"
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
          <div class="mt-3">
            <SecondaryButton
              :label="m.save()"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!preferences.isModifiedFrom(formPreferences)"
            ></SecondaryButton>
            <DangerButton
              type="reset"
              :label="m.cancel()"
              size="small"
              :disabled="!preferences.isModifiedFrom(formPreferences)"
            ></DangerButton>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from 'vue'

import type { ColorOption } from '@cq/ui'
import {
  Card,
  colors,
  DangerButton,
  Message,
  SecondaryButton,
  Select,
  surfaces,
  useToast
} from '@cq/ui'

import type { Locale } from '@/paraglide/runtime'
import type { Theme } from '@/stores/preferences'
import ColorName from '@/components/ColorName.vue'
import * as m from '@/paraglide/messages'
import { locales } from '@/paraglide/runtime'
import { availableThemes, usePreferences } from '@/stores/preferences'

const toast = useToast()
const preferences = usePreferences()

const formKey = ref(1)
const formPreferences = ref(structuredClone(toRaw(preferences.preferences)))

const themeTranslations: Record<Theme, () => string> = {
  dark: m.theme_dark,
  light: m.theme_light
}

const languageLabels: Record<Locale, string> = {
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
  zh: '中文 (Chinese)'
}

watch(preferences.preferences, (v) => (formPreferences.value.theme = v.theme))

function onReset() {
  formPreferences.value = structuredClone(toRaw(preferences.preferences))
  formKey.value += 1
}

function onSubmit() {
  preferences.preferences = formPreferences.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.preferences_saved(),
    life: 3000
  })
  onReset()
}
</script>
