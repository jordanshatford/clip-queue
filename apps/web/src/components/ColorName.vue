<template>
  <div class="flex items-center gap-2">
    <span class="h-4 w-4 rounded-full" :style="{ backgroundColor: color }"></span>
    <div>{{ colorNameTranslations[name]() }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ColorName } from '@cq/ui'

import * as m from '@/paraglide/messages'

export interface Props {
  name: ColorName
  color: string
}

defineProps<Props>()

const colorNameTranslations: Record<ColorName, () => string> = {
  emerald: m.emerald,
  green: m.green,
  lime: m.lime,
  orange: m.orange,
  amber: m.amber,
  yellow: m.yellow,
  teal: m.teal,
  cyan: m.cyan,
  sky: m.sky,
  blue: m.blue,
  indigo: m.indigo,
  violet: m.violet,
  purple: m.purple,
  fuchsia: m.fuchsia,
  pink: m.pink,
  rose: m.rose,
  slate: m.slate,
  gray: m.gray,
  zinc: m.zinc,
  neutral: m.neutral,
  stone: m.stone,
  soho: m.soho,
  viva: m.viva,
  ocean: m.ocean
}
</script>
