<template>
  <div>
    <Card class="mx-auto max-w-lg">
      <template #content>
        <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="language">{{ m.language() }}</label>
            <Select
              v-model="formTheme.language"
              :options="[...availableLanguageTags]"
              class="md:w-14rem w-full"
              label-id="language"
              :option-label="(value: AvailableLanguageTag) => languageLabels[value]"
            >
            </Select>
            <small id="language-help" class="pb-2 text-sm text-surface-400">{{
              m.language_description()
            }}</small>
            <label for="primaryColor">{{ m.primary_color() }}</label>
            <Select
              v-model="formTheme.primary"
              :options="colors"
              data-key="name"
              class="md:w-14rem w-full"
              label-id="primaryColor"
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
              label-id="surfaceColor"
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
              :disabled="!preferences.isModifiedFrom(formTheme)"
            ></Button>
            <Button
              type="reset"
              severity="danger"
              :label="m.cancel()"
              size="small"
              :disabled="!preferences.isModifiedFrom(formTheme)"
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

import type { AvailableLanguageTag } from '@/paraglide/runtime'
import ColorName from '@/components/ColorName.vue'
import * as m from '@/paraglide/messages'
import { availableLanguageTags } from '@/paraglide/runtime'
import { usePreferences } from '@/stores/preferences'

const toast = useToast()
const preferences = usePreferences()

const formKey = ref(1)
const formTheme = ref(structuredClone(toRaw(preferences.preferences)))

const languageLabels: Record<AvailableLanguageTag, string> = {
  ar: 'عربي (Arabic)',
  de: 'Deutsch (German)',
  en: 'English',
  es: 'Español (Spanish)',
  fr: 'Français (French)',
  it: 'Italiano (Italian)',
  ja: '日本語 (Japanese)',
  ko: '한국인 (Korean)',
  ru: 'русский (Russian)',
  tr: 'Türkçe (Turkish)',
  zh: '中文 (Chinese)'
}

function onReset() {
  formTheme.value = structuredClone(toRaw(preferences.preferences))
  formKey.value += 1
}

function onSubmit() {
  preferences.preferences = formTheme.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.preferences_saved(),
    life: 3000
  })
  onReset()
}
</script>
