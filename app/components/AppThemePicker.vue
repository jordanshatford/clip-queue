<template>
  <UPopover
    v-model:open="open"
    :ui="{ content: 'w-80 px-4 py-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-5rem)]' }"
  >
    <template #default>
      <UButton
        icon="lucide:swatch-book"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        aria-label="Color picker"
        :ui="{ leadingIcon: 'text-primary' }"
      />
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-left">
        <UFormField size="sm" :label="m.primary_color()">
          <div class="grid grid-cols-3 gap-1">
            <AppThemePickerButton
              v-for="color in primaryColors"
              :key="color"
              :name="color"
              :selected="preferences.primary === color"
              @click="preferences.primary = color"
            />
          </div>
        </UFormField>
        <UFormField size="sm" :label="m.neutral_color()">
          <div class="grid grid-cols-3 gap-1">
            <AppThemePickerButton
              v-for="color in neutralColors"
              :key="color"
              :name="color"
              :selected="preferences.neutral === color"
              @click="preferences.neutral = color"
            />
          </div>
        </UFormField>
        <UFormField size="sm" :label="m.locale()">
          <ULocaleSelect
            v-model="preferences.locale"
            value-key="code"
            :locales="preferences.supportedUiLocales"
            :ui="{
              leading: '[&>span]:size-4',
            }"
            class="w-full"
          />
        </UFormField>
        <UFormField size="sm" :label="m.color_mode()">
          <UColorModeSelect id="color-mode" class="w-full" />
        </UFormField>
        <div class="ml-auto flex items-center justify-between gap-1">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="lucide:rotate-ccw"
            :disabled="!preferences.isModified"
            @click="preferences.reset()"
            >{{ m.reset() }}</UButton
          >
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'

const preferences = usePreferences()
const open = ref<boolean>(false)
</script>
